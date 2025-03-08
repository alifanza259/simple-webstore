"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [itemInCart, setItemInCart] = useState<number | null>(null);

  useEffect(() => {
    let cart: any = localStorage.getItem("carts");

    if (cart) {
      cart = JSON.parse(cart);

      let itemAmount = 0;
      cart.forEach((e: any) => {
        itemAmount += parseInt(e.amount);
      });
      setItemInCart(itemAmount);
    } else {
      setItemInCart(0);
    }
  }, []);

  return (
    <Link href="/cart">
      <Button className="shrink-0 cursor-pointer" variant="outline">
        <ShoppingCart className="h-5 w-5"></ShoppingCart>
        <p>{itemInCart}</p>
      </Button>
    </Link>
  );
}
