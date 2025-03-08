import { Package } from "lucide-react";
import Item from "./item";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
};

export default async function ProductDetail({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = await params;
  const response = await fetch(`${process.env.APP_URL}/product/${productId}`);
  const product: Product = (await response.json()).data;

  return (
    <>
      {product == null ? (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
          <Package className="w-16 h-16 text-gray-400" fill="none" />
          <p className="mt-4">No items available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
          <img src={product.image} />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.title}
            </h1>
            <p className="text-3xl mt-2 text-gray-900">USD {product.price}</p>
            <p className="text-base text-gray-700 mt-6">
              {product.description}
            </p>
            <div className="flex justify-end">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-2">
                #{product.category}
              </span>
            </div>
            <Item product={product} />
          </div>
        </div>
      )}
    </>
  );
}
