"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
};

export default function Search() {
  const [product, setProduct] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [amount, setAmount] = useState(0);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const router = useRouter();

  const handleSearch = async (term: string) => {
    setLoadingSearch(true);
    setQuery(term);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/products?title=${term}`
    );
    const products = await response.json();

    setProduct(products.data);
    setLoadingSearch(false);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    setLoadingSubmit(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/product/${selectedProduct.id}/adjust-stock`,
        {
          method: "PATCH",
          body: JSON.stringify({ amount }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Unknown error");

      toast.success("Stock updated successfully!", {
        style: { backgroundColor: "green", color: "white" },
      });

      setAmount(0);
      setSelectedProduct(undefined);

      setTimeout(() => router.refresh(), 500);
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }

      toast.error(`Something went wrong: ${errorMessage}`, {
        style: { backgroundColor: "red", color: "white" },
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex items-center gap-x-4">
      <div className="flex items-center gap-x-2">
        <p className="text-sm text-muted-foreground">Product:</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start">
              {selectedProduct != null
                ? selectedProduct.title
                : "+ Select product"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput
                placeholder="Search product..."
                value={query}
                onValueChange={handleSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {loadingSearch
                    ? "Loading..."
                    : query.length === 0
                    ? "Type letters to find product"
                    : "No results found"}
                  .
                </CommandEmpty>
                <CommandGroup>
                  {product.map((p: Product) => (
                    <CommandItem
                      key={p.id}
                      data-value={p.id}
                      onSelect={() => {
                        setSelectedProduct(p);
                        setOpen(false);
                      }}
                    >
                      {p.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-x-2">
        <label className="text-sm text-muted-foreground">Delta:</label>
        <input
          type="number"
          className="border rounded-md px-2 py-1 w-[80px]"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
      </div>

      <Button
        onClick={() => handleUpdate()}
        className="px-4"
        disabled={!!loadingSubmit}
      >
        {loadingSubmit ? "Loading..." : "Submit"}
      </Button>
    </div>
  );
}
