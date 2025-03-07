import { Button } from "@/components/ui/button";
import Search from "./search";
import Items from "./items";
import Cart from "./cart";

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

export default async function Home({
  searchParams,
}: {
  searchParams: {
    title?: string;
    category?: string;
  };
}) {
  const { title = "", category = "" } = await searchParams;

  async function fetchData(
    offset: number,
    perPage: number,
    title?: string,
    category?: string
  ) {
    "use server";

    const response = await fetch(
      `http://localhost:3001/products?title=${title}&category=${category}&offset=${offset}&perPage=${perPage}`
    );
    const { data, meta }: { data: Product[]; meta: Meta } =
      await response.json();

    return { data, meta };
  }
  const { data: items, meta } = await fetchData(0, 10, title, category);

  return (
    <div>
      <div className="flex justify-between">
        Store Page
        <Button>
          <a href="/admin/products">Go To Admin Page</a>
        </Button>
      </div>
      <Cart />
      <div>
        <Search />
        <Items
          title={title}
          category={category}
          initialItems={items}
          fetchData={fetchData}
          meta={meta}
        />
      </div>
    </div>
  );
}
