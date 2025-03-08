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
import { useState } from "react";

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

  const handleSearch = async (term: string) => {
    setQuery(term);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/products?title=${term}`
    );
    const products = await response.json();

    setProduct(products.data);
  };

  const handleUpdate = async () => {
    if (selectedProduct == null) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/product/${selectedProduct.id}/adjust-stock`,
      {
        method: "PATCH",
        body: JSON.stringify({
          amount,
        }),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    await response.json();
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-x-4">
      {/* Product Selector */}
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
                <CommandEmpty>{query.length === 0 ? 'Type letters to find product' : 'No results found'}.</CommandEmpty>
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

      {/* Delta Input */}
      <div className="flex items-center gap-x-2">
        <label className="text-sm text-muted-foreground">Delta:</label>
        <input
          type="number"
          className="border rounded-md px-2 py-1 w-[80px]"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <Button onClick={() => handleUpdate()} className="px-4">
        Submit
      </Button>
    </div>
  );
}
