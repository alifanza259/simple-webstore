"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

type CartItem = {
  productId: number;
  productName: string;
  price: number;
  image: string;
  amount: number;
};

export default function Cart() {
  const [itemInCart, setItemInCart] = useState<number | null>(null);

  const { cartUpdated } = useCart();

  useEffect(() => {
    const cartString = localStorage.getItem("carts");

    if (cartString) {
      const cart = JSON.parse(cartString) as CartItem[];

      let itemAmount = 0;
      cart.forEach((e) => {
        itemAmount += e.amount;
      });
      setItemInCart(itemAmount);
    } else {
      setItemInCart(0);
    }
  }, [cartUpdated]);

  return (
    <Link href="/cart">
      <Button className="shrink-0 cursor-pointer" variant="outline">
        <ShoppingCart className="h-5 w-5"></ShoppingCart>
        <p>{itemInCart}</p>
      </Button>
    </Link>
  );
}
