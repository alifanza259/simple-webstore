import { ReactNode } from "react";
import Cart from "./cart";
import { CartProvider } from "../context/CartContext";
import Link from "next/link";

export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-1">
        <CartProvider>
          <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-white">
            <nav className="font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link className="font-bold" key="/" href="/">
                "My Store"
              </Link>
            </nav>

            <Cart />
          </header>
          <main className="storefront">{children}</main>
        </CartProvider>
      </div>
    </>
  );
}
