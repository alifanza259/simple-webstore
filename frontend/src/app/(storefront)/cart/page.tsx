"use client";

import { Button } from "@/components/ui/button";
import { Package, Trash } from "lucide-react";
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

  function updateAmount(index: number, newAmount: number) {
    let cart = localStorage.getItem("carts");

    cart = JSON.parse(cart);

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
                <img src={c.image} className="h-full object-cover" />
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
                      onChange={(e) => updateAmount(i, e.target.value)}
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
        </div>
      )}
      {/* <div>Cart</div>
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
      </div> */}
    </div>
  );
}
