"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let cart = localStorage.getItem("carts");

    if (cart) {
      cart = JSON.parse(cart);

      let price = 0;
      cart.forEach((c) => {
        price += c.price * c.amount;
      });

      setTotalPrice(price);
      setCart(cart);
    }
  }, []);

  function handleRemoveItem(productId: number) {
    let cart = localStorage.getItem("carts");
    if (cart) {
      cart = JSON.parse(cart);

      const i = cart.findIndex((e) => e.productId === productId);
      if (i !== -1) {
        cart.splice(i, 1);

        localStorage.setItem("carts", JSON.stringify(cart));
      }

      window.location.reload();
    }
  }

  function handleCheckout() {
    let cart = localStorage.getItem("carts");
    if (cart) {
      cart = JSON.parse(cart);

      let totalPrice = 0;

      for (let obj in cart) {
        totalPrice += cart[obj].amount * cart[obj].price;
      }

      alert(`Total Price: ${totalPrice}`);
      alert(`Thank you for shopping with us`);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "checkout-success",
      });

      localStorage.removeItem("carts");
      window.location.replace("/");
    }
  }

  return (
    <div>
      <div>Cart</div>
      <ol>
        {cart.map((p: Product) => (
          <ul>
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <img
                src={p.image}
                alt="Sunset in the mountains"
                width={100}
                height={100}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{p.productName}</div>
              </div>
              <div className="px-6 py-4">
                <div className="text-xl mb-2">Price Name: {p.price}</div>
              </div>
              <div className="px-6 py-4">
                <div className="text-xl mb-2">Amount: {p.amount}</div>
              </div>
              <Button onClick={() => handleRemoveItem(p.productId)}>
                Remove from cart
              </Button>
            </div>
            <br />
          </ul>
        ))}
      </ol>
      <div>Total Price: {totalPrice}</div>
      <div>
        <Button onClick={() => handleCheckout()}>Buy Now</Button>
      </div>
    </div>
  );
}
