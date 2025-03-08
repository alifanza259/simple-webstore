"use client";

import { Button } from "@/components/ui/button";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
};

export default function Item({ product }: { product: Product }) {
  function handleBuy(p: Product) {
    let userCartString = localStorage.getItem("carts");

    let userCart = userCartString == null ? [] : JSON.parse(userCartString);

    const i = userCart.findIndex((e: any) => e.productId === p.id);

    if (i !== -1) {
      userCart[i].amount += 1;
    } else {
      userCart.push({
        productId: p.id,
        productName: p.title,
        price: p.price,
        image: p.image,
        amount: 1,
      });
    }

    localStorage.setItem("carts", JSON.stringify(userCart));

    window.location.reload();
  }

  return <Button className="addToCart" onClick={() => handleBuy(product)}>Buy</Button>;
}
