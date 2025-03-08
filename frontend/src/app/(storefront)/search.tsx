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
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <input
        type="text"
        id="table-search"
        className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-48 sm:w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        id="table-search-category"
        className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-48 sm:w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Category"
        onChange={(e) => setCategory(e.target.value)}
      />
      <Button
        className="px-4 py-2 cursor-pointer"
        onClick={() => {
          handleSearch();
        }}
      >
        Search
      </Button>
    </div>
  );
}
