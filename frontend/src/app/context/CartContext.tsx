"use client";

import { createContext, useContext, useState } from "react";

type CartContextType = {
  cartUpdated: boolean;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartUpdated, setCartUpdated] = useState(false);

  const refreshCart = () => setCartUpdated((prev) => !prev);

  return (
    <CartContext.Provider value={{ cartUpdated, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}