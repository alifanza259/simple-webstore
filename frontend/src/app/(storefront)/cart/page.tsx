"use client";

import { useCart } from "@/app/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  productId: number;
  productName: string;
  price: number;
  image: string;
  amount: number;
};

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const router = useRouter();
  const { refreshCart } = useCart();

  useEffect(() => {
    let cartString = localStorage.getItem("carts");

    if (cartString) {
      const cart = JSON.parse(cartString) as CartItem[];

      let price = 0;
      cart.forEach((c: CartItem) => {
        price += c.price * c.amount;
      });

      setTotalPrice(price);
      setCart(cart);
    }
  }, []);

  function updateAmount(index: number, newAmount: number) {
    const cartString = localStorage.getItem("carts");

    if (!cartString) return;

    const cart = JSON.parse(cartString) as CartItem[];

    cart[index].amount = newAmount;
    setCart(cart);

    let price = 0;

    cart.forEach((c) => {
      price += c.price * c.amount;
    });

    setTotalPrice(price);

    localStorage.setItem("carts", JSON.stringify(cart));
  }

  function handleRemoveItem(productId: number) {
    const cartString = localStorage.getItem("carts");
    if (cartString) {
      const cart = JSON.parse(cartString) as CartItem[];

      const i = cart.findIndex((e) => e.productId === productId);
      if (i !== -1) {
        cart.splice(i, 1);

        localStorage.setItem("carts", JSON.stringify(cart));
      }

      let price = 0;

      cart.forEach((c) => {
        price += c.price * c.amount;
      });

      setTotalPrice(price);

      refreshCart();
      setCart(cart);
      router.refresh();
    }
  }

  function handleCheckout() {
    const cartString = localStorage.getItem("carts");
    if (cartString) {
      const cart = JSON.parse(cartString) as CartItem[];

      let totalPrice = 0;

      for (let obj in cart) {
        totalPrice += cart[obj].amount * cart[obj].price;
      }

      setCheckoutSuccess(true);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "checkout-success",
      });

      localStorage.removeItem("carts");
      refreshCart();
    }
  }

  function closeModal() {
    router.push("/");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 min-h-[55vh]">
      {cart?.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
          <Package className="w-16 h-16 text-gray-400" fill="none" />
          <p className="mt-4">Cart is empty</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-10">
          {cart.map((c, i) => (
            <div key={c.productId} className="flex pb-6 ">
              <div className="w-24 h-24 sm:w-32 sm:h-32">
                <img src={c.image} className="h-full object-contain" />
              </div>
              <div className="ml-5 flex justify-between w-full font-medium">
                <p className="w-2/3">{c.productName}</p>
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center gap-x-2 justify-end">
                    <p>Price: ${c.price}</p>
                  </div>

                  <div className="flex ">
                    <Button onClick={() => handleRemoveItem(c.productId)}>
                      <Trash />
                    </Button>
                    <input
                      type="number"
                      className="border rounded-md ml-3 px-2 py-1 w-[80px]"
                      min={1}
                      value={c.amount}
                      onChange={(e) =>
                        updateAmount(i, parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <div className="flex items-center justify-between font-medium">
              <p>Total Price:</p>
              <p>${totalPrice}</p>
            </div>

            <Button
              size="lg"
              className="w-full mt-5"
              onClick={() => handleCheckout()}
            >
              Checkout
            </Button>
          </div>
          <Dialog open={checkoutSuccess} onOpenChange={setCheckoutSuccess}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Checkout Successful</DialogTitle>
              </DialogHeader>
              <p>Thank you for shopping with us!</p>
              <Button className="mt-4 w-full" onClick={closeModal}>
                OK
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
