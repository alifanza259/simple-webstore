"use client";

import { useCart } from "@/app/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
};

type CartItem = {
  productId: number;
  productName: string;
  price: number;
  image: string;
  amount: number;
};

export default function Item({ product }: { product: Product }) {
  const { refreshCart } = useCart();

  const router = useRouter();

  function handleBuy(p: Product) {
    const userCartString = localStorage.getItem("carts");

    const userCart = userCartString == null ? [] : JSON.parse(userCartString);

    const i = userCart.findIndex((e: CartItem) => e.productId === p.id);

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

    refreshCart();
    toast.success("Product successfully added to cart", {
      style: { backgroundColor: "green", color: "white" },
    });
    router.refresh();
  }

  return (
    <Button
      size="lg"
      className="w-full mt-5"
      onClick={() => handleBuy(product)}
    >
      <ShoppingBag className="mr-4 h-5 w-5" /> Add to Cart
    </Button>
  );
}
