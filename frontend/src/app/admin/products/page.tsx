type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
};

type Meta = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

import { Button } from "@/components/ui/button";
import Search from "./search";

export default async function AdminProduct({
  searchParams,
}: {
  searchParams: {
    title?: string;
    category?: string;
    page?: string;
    perPage?: string;
  };
}) {
  const {
    title = "",
    category = "",
    page = "1",
    perPage = "10",
  } = await searchParams;

  const response = await fetch(
    `http://localhost:3001/products?title=${title}&category=${category}&page=${page}&perPage=${perPage}`
  );
  const { data, meta }: { data: Product[]; meta: Meta } = await response.json();
  console.log(meta);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="pb-5">Product Management</h1>
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div className="flex">
          <Search />
        </div>
        <div className="relative">
          <Button>Add Product</Button>
        </div>
      </div>
      <br />
      <div>Item per page: {meta.perPage}</div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d: Product) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={d.id}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {d.title}
              </th>
              <td className="px-6 py-4">{d.price}</td>
              <td className="overflow-hidden text-ellipsis px-6 py-4">
                {d.description}
              </td>
              <td className="px-6 py-4 text-ellipsis">{d.category}</td>
              <td className="px-6 py-4">
                <Button>
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </a>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        <div>
          Showing {(parseInt(page) - 1) * parseInt(perPage) + 1} to {Math.min(parseInt(page) * parseInt(perPage), meta.totalItems)} of{" "}
          {meta.totalItems} entries
        </div>
        <div className="flex">
          <Button disabled={parseInt(page)===1} style={{marginRight: '15px'}}>
            <a href={`/admin/products?title=${title}&category=${category}&page=${parseInt(page)-1}&perPage=${perPage}`} >Previous</a>
          </Button>
          <Button disabled={parseInt(page)>=meta.totalPages}>
            <a style={{paddingRight: '15px'}} href={`/admin/products?title=${title}&category=${category}&page=${parseInt(page)+1}&perPage=${perPage}`}>Next</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
