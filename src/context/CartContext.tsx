import React, { createContext, useState, useContext } from 'react';
import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
  checked: boolean;
}

interface CartContextData {
  items: CartItem[];
  totalItems: number;
  addToCart: (product: any, quantity: number) => void;
  updateQuantity: (productId: number, newQty: number) => void;
  removeFromCart: (productId: number) => void;
  toggleCheck: (productId: number) => void;
  toggleBrandCheck: (brandName: string, isChecked: boolean) => void;
}
const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  // const totalPrice = items.reduce(
  //   (total, item) => total + Number(item.product.selling_price) * item.quantity,
  //   0
  // );

  const addToCart = (product: Product, quantity: number) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity, checked: true }];
    });
  };

  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleCheck = (productId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleBrandCheck = (brandName: string, isChecked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.brand?.name === brandName ? { ...item, checked: isChecked } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleCheck,
        toggleBrandCheck,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
