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

type StockLog = {
  logId: number;
  productId: number;
  productName: string;
  changes: number;
  transactionDate: number;
  activity: string;
};

export default function Search() {
  const [product, setProduct] = useState<StockLog[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleSearch = async (term: string) => {
    setQuery(term);

    const response = await fetch(`${process.env.APP_URL}/product/stock-logs`);
    const products = await response.json();

    setProduct(products.data);
  };

  const handleUpdate = async () => {
    const response = await fetch(
      `${process.env.APP_URL}/product/${selectedProductId}/adjust-stock`,
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
    <div className="flex flex-col space-y-2">
      <p className="text-sm text-muted-foreground">Product</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedProductId ? selectedProductId : "+ Select product"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput
              placeholder="Search product..."
              value={query}
              onValueChange={handleSearch} //
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {product.map((p) => (
                  <CommandItem
                    key={p.productId}
                    data-value={p.productId}
                    onSelect={() => {
                      setSelectedProductId(p.productId);
                      setOpen(false);
                    }}
                  >
                    {p.productName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <label>Delta: </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Button onClick={() => handleUpdate()}>Submit</Button>
    </div>
  );
}
