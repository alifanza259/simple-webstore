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

import { Button } from "@/components/ui/button";
import Search from "./search";
import DeleteProduct from "./delete";
import AddEdit from "./addEdit";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

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
    `${process.env.APP_URL}/products?title=${title}&category=${category}&page=${page}&perPage=${perPage}`
  );
  const { data, meta }: { data: Product[]; meta: Meta } = await response.json();

  return (
    <>
      <Card className="mt-6 w-full">
        <CardHeader className="px-7">
          <CardTitle>
            <p className="text-3xl">Product Management</p>
          </CardTitle>
          <hr />
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto  sm:rounded-lg">
            <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
              <Search />
              <AddEdit />
            </div>
            <br />
            <div>Item per page: {meta.perPage}</div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-3 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
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
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white w-[350px]"
                    >
                      {d.title}
                    </th>
                    <td className="px-6 py-4">
                      <img
                        src={d.image}
                        className="w-[100px] h-[100px] object-contain rounded-md"
                        alt={d.title}
                      />
                    </td>
                    <td className="overflow-hidden text-ellipsis px-6 py-4">
                      {d.description}
                    </td>
                    <td className="px-6 py-4">{d.stock}</td>
                    <td className="px-6 py-4">{d.price}</td>
                    <td className="px-6 py-4 text-ellipsis">{d.category}</td>
                    <td className="px-6 py-4">
                      <AddEdit data={d} />
                      <DeleteProduct productId={d.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row justify-between w-full pb-4">
            <div className="">
              Showing {(parseInt(page) - 1) * parseInt(perPage) + 1} to{" "}
              {Math.min(parseInt(page) * parseInt(perPage), meta.totalItems)} of{" "}
              {meta.totalItems} entries
            </div>
            <div className="ml-auto flex space-x-2">
              {parseInt(page) > 1 ? (
                <Link
                  href={`/admin/products?title=${title}&category=${category}&page=${
                    parseInt(page) - 1
                  }&perPage=${perPage}`}
                >
                  <Button className="cursor-pointer">Previous</Button>
                </Link>
              ) : (
                <Button disabled className="opacity-50 cursor-not-allowed">
                  Previous
                </Button>
              )}

              {parseInt(page) < meta.totalPages ? (
                <Link
                  href={`/admin/products?title=${title}&category=${category}&page=${
                    parseInt(page) + 1
                  }&perPage=${perPage}`}
                >
                  <Button className="cursor-pointer">Next</Button>
                </Link>
              ) : (
                <Button disabled className="opacity-50 cursor-not-allowed">
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
