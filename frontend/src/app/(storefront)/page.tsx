import Filter from "./filter";
import Items from "./items";
import Search from "./search";

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
    perPage: number,
    title?: string,
    category?: string,
    lastProductId?: number | null
  ) {
    "use server";

    const params = new URLSearchParams({
      perPage: perPage.toString(),
      ...(title && { title }),
      ...(category && { category }),
      ...(lastProductId != null && { lastProductId: lastProductId.toString() }),
    });
    const response = await fetch(
      `${process.env.APP_URL}/products?${params.toString()}`
    );
    const { data, meta }: { data: Product[]; meta: Meta } =
      await response.json();

    return { data, meta };
  }
  const { data: items, meta } = await fetchData(10, title, category, null);

  return (
    <>
      <Search />
      <Items
        title={title}
        category={category}
        initialItems={items}
        fetchData={fetchData}
        meta={meta}
      />
    </>
  );
}
