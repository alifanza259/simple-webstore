"use client";

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
  const [offset, setOffset] = useState(initialItems.length);
  const observerRef = useRef(null);
  
  async function test() {
    const { data } = await fetchData(
      offset,
      meta.perPage,
      title,
      category
    );

    setOffset(offset + data.length);
    setProducts(products.concat(data));
  }

  const loadMore = async () => {
    setLoading(true);

    setTimeout(async () => {
      await test();
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    setProducts(initialItems);
    setOffset(initialItems.length);
  }, [initialItems]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1}
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
              <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #{p.category}
                </span>
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
