"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
};

type Meta = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

export default function Items({
  title,
  category,
  initialItems,
  fetchData,
  meta,
}: {
  title: string;
  category: string;
  initialItems: Product[];
  fetchData: any;
  meta: Meta;
}) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialItems);
  const observerRef = useRef(null);

  const loadMore = async () => {
    setLoading(true);

    const { data } = await fetchData(meta.perPage, title, category, products[products.length-1]?.id);

    setProducts(products.concat(data));
    setLoading(false);
  };

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

  useEffect(() => {
    setProducts(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading]);

  return (
    <div>
      <ol>
        {products.map((p: Product) => (
          <ul>
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <img
                src={p.image}
                alt="Sunset in the mountains"
                width={100}
                height={100}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{p.title}</div>
              </div>
              <div className="px-6 py-4">
                <div className="text-xl mb-2">Price: {p.price}</div>
              </div>
              <div className="flex px-6 pt-4 pb-2 justify-between">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #{p.category}
                </span>
                <Button className="addToCart" onClick={() => handleBuy(p)}>Buy</Button>
              </div>
            </div>
            <br />
          </ul>
        ))}
      </ol>

      {products.length < meta.totalItems && (
        <div ref={observerRef} className="h-10 bg-gray-200 mt-4"></div>
      )}

      {loading && <p className="text-center">Loading more...</p>}
    </div>
  );
}
