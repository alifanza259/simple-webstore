"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Package, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const loadMore = async () => {
    setLoading(true);

    const { data } = await fetchData(
      meta.perPage,
      title,
      category,
      products[products.length - 1]?.id
    );

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

    window.location.replace("/");
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
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
          <Package className="w-16 h-16 text-gray-400 " fill="none" />
          <p className="mt-4">No items available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 mt-6">
            {products.map((i) => (
              <Card
                key={i.id}
                className="cursor-pointer"
                onClick={() => router.push(`/product/${i.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="w-full h-[200px] flex items-center justify-center">
                    <img src={i.image} className="h-full object-cover" />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-2xl line-clamp-2">{i.title}</p>
                  <p className="font-bold mt-3">USD {i.price}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #{i.category}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuy(i);
                    }}
                    className="shrink-0 mt-2 addToCart"
                    variant="outline"
                    size="icon"
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {products.length < meta.totalItems && (
            <div ref={observerRef} className="h-10 bg-gray-200 mt-4"></div>
          )}

          {loading && <p className="text-center">Loading more...</p>}
        </>
      )}
    </div>
  );
}
