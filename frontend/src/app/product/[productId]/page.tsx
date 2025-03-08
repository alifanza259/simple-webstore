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
  const response = await fetch(`http://localhost:3001/product/${productId}`);
  const product: Product = (await response.json()).data;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        src={product.image}
        alt="Sunset in the mountains"
        width={100}
        height={100}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{product.title}</div>
      </div>
      <div className="px-6 py-4">
        <div className="text-xl mb-2">Price: {product.price}</div>
      </div>
      <div className="flex px-6 pt-4 pb-2 justify-between">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #{product.category}
        </span>
        <Item product={product} />
      </div>
    </div>
  );
}
