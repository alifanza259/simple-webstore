"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Cart() {
  const [itemInCart, setItemInCart] = useState(0);

  useEffect(() => {
    let cart = localStorage.getItem("carts");

    if (cart) {
      cart = JSON.parse(cart);

      let itemAmount = 0;
      cart.forEach((e) => {
        itemAmount += e.amount;
      });
      setItemInCart(itemAmount);
    }
  }, []);

  return (
    <div className="flex">
      <div>Product in cart: {itemInCart}</div>
      <Button>
        <a href="/cart">Checkout</a>
      </Button>
    </div>
  );
}
