'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getDeliveryZones } from '@/lib/dataService';
import { DeliveryZone, CustomerAddress } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Phone, User, Home, AlertCircle, ShoppingBag, ArrowRight, Loader2, MessageSquare } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    selectedBranch,
    customerAddress,
    setCustomerAddress,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    clearCart,
  } = useCart();

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [isLoadingZones, setIsLoadingZones] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form Fields
  const [nameInput, setNameInput] = useState<string>(customerName || '');
  const [phoneInput, setPhoneInput] = useState<string>(customerPhone || '');
  const [areaInput, setAreaInput] = useState<string>(customerAddress?.area || '');
  const [streetInput, setStreetInput] = useState<string>(customerAddress?.street || '');
  const [buildingInput, setBuildingInput] = useState<string>(customerAddress?.building || '');
  const [floorInput, setFloorInput] = useState<string>(customerAddress?.floor || '');
  const [apartmentInput, setApartmentInput] = useState<string>(customerAddress?.apartment || '');
  const [landmarkInput, setLandmarkInput] = useState<string>(customerAddress?.landmark || '');
  const [notesInput, setNotesInput] = useState<string>('');

  // Load delivery zones for selected branch
  useEffect(() => {
    async function loadZones() {
      setIsLoadingZones(true);
      try {
        const branchId = selectedBranch?.id;
        let zones = await getDeliveryZones(branchId);
        if (zones.length === 0) {
          zones = await getDeliveryZones();
        }
        setDeliveryZones(zones);
        if (zones.length > 0) {
          setSelectedZone(zones[0]);
          if (!areaInput) setAreaInput(zones[0].area_name);
        }
      } catch (err) {
        console.error('Failed to load zones', err);
      } finally {
        setIsLoadingZones(false);
      }
    }
    loadZones();
  }, [selectedBranch]);

  // Use Saved Address Convenience Action
  const handleUseSavedAddress = () => {
    if (!customerAddress) return;
    setAreaInput(customerAddress.area || '');
    setStreetInput(customerAddress.street || '');
    setBuildingInput(customerAddress.building || '');
    setFloorInput(customerAddress.floor || '');
    setApartmentInput(customerAddress.apartment || '');
    setLandmarkInput(customerAddress.landmark || '');
  };

  const deliveryFee = selectedZone ? Number(selectedZone.delivery_fee) : 0;
  const grandTotal = subtotal + deliveryFee;
  const minOrder = selectedZone ? Number(selectedZone.min_order) : 100;
  const isMinOrderMet = subtotal >= minOrder;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('السلة فاضية، اضف منتجات أولاً قبل إتمام الطلب.');
      return;
    }

    if (!nameInput.trim() || !phoneInput.trim()) {
      setErrorMessage('من فضلك ادخل اسمك ورقم الهاتف لتواصل الدليفري.');
      return;
    }

    if (!selectedZone || !streetInput.trim()) {
      setErrorMessage('من فضلك حدد المنطقة والشارع بالتفصيل.');
      return;
    }

    if (!isMinOrderMet) {
      setErrorMessage(`الحد الأدنى للطلب لهذه المنطقة هو ${minOrder} جنيه.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const addressPayload: CustomerAddress = {
        governorate: 'القاهرة',
        area: selectedZone.area_name,
        street: streetInput.trim(),
        building: buildingInput.trim(),
        floor: floorInput.trim(),
        apartment: apartmentInput.trim(),
        landmark: landmarkInput.trim(),
        notes: notesInput.trim(),
      };

      // Save memory to context & localStorage
      setCustomerName(nameInput.trim());
      setCustomerPhone(phoneInput.trim());
      setCustomerAddress(addressPayload);

      const itemsPayload = cart.map((ci) => ({
        productId: ci.product.id,
        quantity: ci.quantity,
        selectedOptions: ci.selected_options,
      }));

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: selectedBranch?.id || 'b1111111-1111-1111-1111-111111111111',
          deliveryZoneId: selectedZone.id,
          customerName: nameInput.trim(),
          customerPhone: phoneInput.trim(),
          address: addressPayload,
          customerNotes: notesInput.trim(),
          items: itemsPayload,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'حصلت مشكلة أثناء إنشاء الطلب، حاول مرة ثانية.');
        setIsSubmitting(false);
        return;
      }

      // Save order details to sessionStorage for success page
      sessionStorage.setItem(`order_${data.orderCode}`, JSON.stringify(data));

      // Open WhatsApp automatically
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }

      clearCart();
      router.push(`/checkout/success/${data.orderCode}?token=${data.guestAccessToken}`);
    } catch (err) {
      console.error('Submit order failed', err);
      setErrorMessage('تعذر الاتصال بالخادم، تحقق من الاتصال وحاول مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-5xl block">🍽️</span>
        <h2 className="text-2xl font-black text-brand-cream">السلة فاضية حالياً!</h2>
        <p className="text-xs text-brand-cream-muted">لا يوجد منتجات في سلتك لإتمام الطلب.</p>
        <button onClick={() => router.push('/menu')} className="btn-gold px-8 py-3 rounded-xl font-extrabold text-xs">
          تصفح المنيو واطلب الآن
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="space-y-2 border-r-4 border-brand-gold pr-4">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-cream">إتمام الطلب والتوصيل 🛵</h1>
        <p className="text-xs text-brand-cream-muted">
          ادخل عنوان التوصيل للتأكيد وإعداد رسالة الواتساب المباشرة مع المطعم.
        </p>
      </div>

      {/* Customer Memory Prompt */}
      {customerAddress && (
        <div className="glass-panel p-4 rounded-2xl border border-brand-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex items-start sm:items-center gap-3">
            <span className="text-2xl">👋</span>
            <div className="min-w-0">
              <h4 className="font-extrabold text-sm text-brand-cream break-words">أهلاً بيك! نستخدم آخر عنوان مسجل؟</h4>
              <p className="text-xs text-brand-cream-muted break-words">
                {customerAddress.area} - {customerAddress.street}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUseSavedAddress}
            className="btn-gold w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm shrink-0"
          >
            استخدام العنوان 📍
          </button>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-brand-red/20 border border-brand-red-bright text-brand-cream text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details Panel */}
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-brand-gold/20 space-y-4">
            <h3 className="text-lg font-black text-brand-cream flex items-center gap-2 border-b border-brand-gold/20 pb-3">
              <User className="w-5 h-5 text-brand-gold" />
              <span>1. بيانات العميل والتواصل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-cream block">الاسم بالكامل *</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-cream block">رقم الهاتف (واتساب) *</label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Panel */}
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-brand-gold/20 space-y-4">
            <h3 className="text-lg font-black text-brand-cream flex items-center gap-2 border-b border-brand-gold/20 pb-3">
              <Home className="w-5 h-5 text-brand-gold" />
              <span>2. عنوان التوصيل بالتفصيل</span>
            </h3>

            <div className="space-y-4">
              {/* Delivery Zone Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-cream block">المنطقة السكنية (تبع فرع {selectedBranch?.name_ar}) *</label>
                {isLoadingZones ? (
                  <div className="py-2 text-xs text-brand-cream-muted flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                    <span>جاري تحميل المناطق...</span>
                  </div>
                ) : (
                  <select
                    value={selectedZone?.id || ''}
                    onChange={(e) => {
                      const zone = deliveryZones.find((z) => z.id === e.target.value);
                      if (zone) {
                        setSelectedZone(zone);
                        setAreaInput(zone.area_name);
                      }
                    }}
                    className="w-full bg-brand-dark-800 border border-brand-gold/30 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                  >
                    {deliveryZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.area_name} (رسوم التوصيل: {z.delivery_fee} جنيه — الحد الأدنى: {z.min_order} جنيه)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Detailed Street Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-cream block">اسم الشارع *</label>
                  <input
                    type="text"
                    required
                    value={streetInput}
                    onChange={(e) => setStreetInput(e.target.value)}
                    placeholder="اسم الشارع بالتفصيل"
                    className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-cream block">رقم العمارة / المبنى</label>
                  <input
                    type="text"
                    value={buildingInput}
                    onChange={(e) => setBuildingInput(e.target.value)}
                    placeholder="رقم العمارة"
                    className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-cream block">الدور</label>
                  <input
                    type="text"
                    value={floorInput}
                    onChange={(e) => setFloorInput(e.target.value)}
                    placeholder="الدور"
                    className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-cream block">رقم الشقة</label>
                  <input
                    type="text"
                    value={apartmentInput}
                    onChange={(e) => setApartmentInput(e.target.value)}
                    placeholder="الشقة"
                    className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-brand-cream block">علامة مميزة</label>
                  <input
                    type="text"
                    value={landmarkInput}
                    onChange={(e) => setLandmarkInput(e.target.value)}
                    placeholder="بجوار مسجد / مستشفى"
                    className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl py-2.5 px-3 text-xs font-bold text-brand-cream outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-brand-cream block">ملاحظات إضافية للمطعم</label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="مثال: زيادة طحينة، بدون شطة، السواق يتصل لما يوصل..."
                  className="w-full bg-brand-dark-800 border border-brand-dark-600 focus:border-brand-gold rounded-xl p-3 text-xs font-bold text-brand-cream outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-brand-gold/30 space-y-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-black text-brand-cream flex items-center gap-2 border-b border-brand-gold/20 pb-3">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <span>ملخص الطلب والإجمالي</span>
            </h3>

            {/* Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cart_item_id} className="flex items-start justify-between gap-3 text-xs border-b border-brand-dark-700 pb-2">
                  <div className="min-w-0 space-y-0.5">
                    <span className="font-bold text-brand-cream block break-words">{item.product.name_ar} × {item.quantity}</span>
                    {item.selected_options && item.selected_options.length > 0 && (
                      <span className="text-[10px] text-brand-gold block">
                        {item.selected_options.map((o) => o.item_name).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 font-black text-brand-gold">{formatCurrency(item.total_price)}</span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs border-t border-brand-dark-700 pt-3">
              <div className="flex items-start justify-between gap-3 text-brand-cream-muted">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-brand-cream">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-start justify-between gap-3 text-brand-cream-muted">
                <span className="break-words">رسوم التوصيل ({selectedZone?.area_name}):</span>
                <span className="font-bold text-brand-gold">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex items-start justify-between gap-3 text-base font-black text-brand-cream pt-3 border-t border-brand-gold/20">
                <span>الإجمالي النهائي:</span>
                <span className="text-xl text-brand-gold">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* WhatsApp Note */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>عند الضغط سيتصاعد الطلب للخادم وتفتح رسالة الواتساب المنسقة تلقائياً.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isMinOrderMet}
              className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-gold transition-all ${
                isSubmitting || !isMinOrderMet
                  ? 'bg-brand-dark-700 text-brand-cream-dim cursor-not-allowed border border-brand-dark-600'
                  : 'btn-gold hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-brand-dark-900" />
                  <span>جاري تسجيل الطلب وتنسيق الواتساب...</span>
                </>
              ) : (
                <>
                  <span>تأكيد الطلب وفتح WhatsApp 📲</span>
                  <ArrowRight className="w-5 h-5 text-brand-dark-900 rotate-180" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
