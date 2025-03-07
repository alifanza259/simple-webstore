"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const { replace } = useRouter();

  function handleSearch() {
    const params = new URLSearchParams(searchParams);
    if (title) {
      params.set("title", title);
    } else {
      params.delete("title");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <input
        type="text"
        id="table-search"
        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        id="table-search-category"
        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Category"
        onChange={(e) => setCategory(e.target.value)}
      />
      <Button
        onClick={() => {
          handleSearch();
        }}
      >
        Search
      </Button>
    </div>
  );
}
