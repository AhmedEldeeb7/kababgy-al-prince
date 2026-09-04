'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Branch, CustomerAddress, Product, CartItemOption } from '@/types/database';
import { INITIAL_BRANCHES } from '@/lib/mockData';

interface CartContextType {
  cart: CartItem[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  customerAddress: CustomerAddress | null;
  setCustomerAddress: (address: CustomerAddress) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  addToCart: (product: Product, quantity: number, selectedOptions: CartItemOption[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kababgy_prince_cart_v1';
const BRANCH_STORAGE_KEY = 'kababgy_prince_branch_v1';
const ADDRESS_STORAGE_KEY = 'kababgy_prince_address_v1';
const CUSTOMER_INFO_KEY = 'kababgy_prince_customer_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(null);
  const [customerAddress, setCustomerAddressState] = useState<CustomerAddress | null>(null);
  const [customerName, setCustomerNameState] = useState<string>('');
  const [customerPhone, setCustomerPhoneState] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    try {
      const savedBranch = localStorage.getItem(BRANCH_STORAGE_KEY);
      if (savedBranch) {
        setSelectedBranchState(JSON.parse(savedBranch));
      } else {
        setSelectedBranchState(INITIAL_BRANCHES[0]);
      }

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (savedAddress) {
        setCustomerAddressState(JSON.parse(savedAddress));
      }

      const savedCustomer = localStorage.getItem(CUSTOMER_INFO_KEY);
      if (savedCustomer) {
        const parsed = JSON.parse(savedCustomer);
        setCustomerNameState(parsed.name || '');
        setCustomerPhoneState(parsed.phone || '');
      }
    } catch {
      setSelectedBranchState(INITIAL_BRANCHES[0]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart, isInitialized]);

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    try {
      localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(branch));
    } catch (e) {
      console.error('Failed to save branch', e);
    }
  };

  const setCustomerAddress = (address: CustomerAddress) => {
    setCustomerAddressState(address);
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
    } catch (e) {
      console.error('Failed to save address', e);
    }
  };

  const setCustomerName = (name: string) => {
    setCustomerNameState(name);
    try {
      localStorage.setItem(
        CUSTOMER_INFO_KEY,
        JSON.stringify({ name, phone: customerPhone })
      );
    } catch (e) {
      console.error('Failed to save customer name', e);
    }
  };

  const setCustomerPhone = (phone: string) => {
    setCustomerPhoneState(phone);
    try {
      localStorage.setItem(
        CUSTOMER_INFO_KEY,
        JSON.stringify({ name: customerName, phone })
      );
    } catch (e) {
      console.error('Failed to save customer phone', e);
    }
  };

  const addToCart = (
    product: Product,
    quantity: number,
    selectedOptions: CartItemOption[]
  ) => {
    const optionsKey = selectedOptions
      .map((o) => o.item_id)
      .sort()
      .join('_');
    const cartItemId = `${product.id}-${optionsKey}`;

    const optionExtra = selectedOptions.reduce((acc, o) => acc + (o.price_modifier || 0), 0);
    const unitPrice = product.base_price + optionExtra;
    const totalPrice = unitPrice * quantity;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cart_item_id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          total_price: unitPrice * newQty,
        };
        return updated;
      }

      return [
        ...prevCart,
        {
          cart_item_id: cartItemId,
          product,
          quantity,
          selected_options: selectedOptions,
          unit_price: unitPrice,
          total_price: totalPrice,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.cart_item_id === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            total_price: item.unit_price * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.total_price, 0);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedBranch,
        setSelectedBranch,
        customerAddress,
        setCustomerAddress,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
