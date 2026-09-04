import { NextResponse } from 'next/server';
import { generateOrderCode, generateSecureToken, buildWhatsAppUrl } from '@/lib/utils';
import { getProducts, getDeliveryZones, getBranches, getRestaurantSettings } from '@/lib/dataService';
import { CartItemOption, CustomerAddress } from '@/types/database';

interface OrderPayload {
  branchId: string;
  deliveryZoneId: string;
  customerName: string;
  customerPhone: string;
  address: CustomerAddress;
  customerNotes?: string;
  idempotencyKey?: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedOptions?: CartItemOption[];
  }>;
}

export async function POST(request: Request) {
  try {
    const body: OrderPayload = await request.json();

    const {
      branchId,
      deliveryZoneId,
      customerName,
      customerPhone,
      address,
      customerNotes,
      items,
    } = body;

    // 1. Basic Server-side Validation
    if (!customerName || !customerPhone || !branchId || !deliveryZoneId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'جميع البيانات الأساسية مطلوبة لإتمام الطلب' },
        { status: 400 }
      );
    }

    if (!address || !address.area || !address.street) {
      return NextResponse.json(
        { error: 'رجاء إدخال عنوان التوصيل بالتفصيل' },
        { status: 400 }
      );
    }

    // 2. Fetch ground-truth values from server records
    const [allProducts, allZones, allBranches, settings] = await Promise.all([
      getProducts(),
      getDeliveryZones(branchId),
      getBranches(),
      getRestaurantSettings(),
    ]);

    const selectedBranch = allBranches.find((b) => b.id === branchId) || allBranches[0];
    const selectedZone = allZones.find((z) => z.id === deliveryZoneId) || allZones[0];

    if (!selectedZone) {
      return NextResponse.json(
        { error: 'منطقة التوصيل المحددة غير متاحة لهذا الفرع' },
        { status: 400 }
      );
    }

    // 3. Recalculate Subtotal & Validate Minimum Order on Server
    let serverSubtotal = 0;
    const itemSnapshots = [];

    for (const clientItem of items) {
      const dbProduct = allProducts.find((p) => p.id === clientItem.productId);
      if (!dbProduct || !dbProduct.is_available) {
        return NextResponse.json(
          { error: `المنتج غير متاح حالياً، يرجى مراجعة السلة` },
          { status: 400 }
        );
      }

      let optionsExtra = 0;
      const optionSnapshots = [];

      if (clientItem.selectedOptions && clientItem.selectedOptions.length > 0) {
        for (const opt of clientItem.selectedOptions) {
          optionsExtra += opt.price_modifier || 0;
          optionSnapshots.push({
            option_name_snapshot: opt.item_name,
            option_price_snapshot: opt.price_modifier || 0,
          });
        }
      }

      const unitPrice = dbProduct.base_price + optionsExtra;
      const itemTotal = unitPrice * clientItem.quantity;
      serverSubtotal += itemTotal;

      itemSnapshots.push({
        product_id: dbProduct.id,
        product_name_snapshot: dbProduct.name_ar,
        unit_price_snapshot: unitPrice,
        quantity: clientItem.quantity,
        subtotal: itemTotal,
        options: optionSnapshots,
        product: dbProduct,
        selected_options: clientItem.selectedOptions || [],
        total_price: itemTotal,
      });
    }

    const deliveryFee = Number(selectedZone.delivery_fee) || 0;

    // Minimum Order Check
    if (selectedZone.min_order && serverSubtotal < selectedZone.min_order) {
      const remaining = selectedZone.min_order - serverSubtotal;
      return NextResponse.json(
        { error: `الحد الأدنى للطلب لهذه المنطقة هو ${selectedZone.min_order} جنيه. أضف ${remaining} جنيه لإكمال الطلب.` },
        { status: 400 }
      );
    }

    const discount = 0;
    const serverTotal = serverSubtotal + deliveryFee - discount;

    // 4. Generate Human-Readable Order Code & Secure Token
    const orderCode = generateOrderCode();
    const guestAccessToken = generateSecureToken();

    // 5. Build WhatsApp URL safely using verified server values
    const whatsappUrl = buildWhatsAppUrl(
      settings.whatsapp_number,
      orderCode,
      selectedBranch.name_ar,
      customerName,
      customerPhone,
      address,
      itemSnapshots as any,
      serverSubtotal,
      deliveryFee,
      serverTotal,
      customerNotes
    );

    // 6. Return response to client
    return NextResponse.json({
      success: true,
      orderCode,
      guestAccessToken,
      whatsappUrl,
      order: {
        orderCode,
        guestAccessToken,
        branchName: selectedBranch.name_ar,
        customerName,
        customerPhone,
        address,
        subtotal: serverSubtotal,
        deliveryFee,
        total: serverTotal,
        status: 'whatsapp_prepared',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'حصلت مشكلة بسيطة أثناء تنفيذ الطلب، حاول مرة تانية.' },
      { status: 500 }
    );
  }
}
