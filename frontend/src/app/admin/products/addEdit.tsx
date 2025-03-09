"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function AddEdit({ data }: { data?: Product }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const formTitle = data == null ? "Add Product" : "Edit Product";
  const buttonTitle = data == null ? "Add Product" : "Edit";

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setCategory(data.category);
      setPrice(data.price);
      setDescription(data.description);
      setImage(data.image);
      setStock(data.stock);
    }
  }, [data]);

  async function handleSubmit() {
    setLoading(true);

    const url = `${process.env.NEXT_PUBLIC_APP_URL}`;
    const endpoint = data ? `/product/${data.id}` : "/products";
    const method = data ? "PATCH" : "POST";
    const action = data ? "edit" : "add";
    const body = JSON.stringify({
      title,
      category,
      price,
      description,
      image,
      stock,
    });

    try {
      const result = await fetch(url + endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const response = await result.json();

      if (!result.ok) throw new Error(response.message || "Unknown error");

      toast.success(`Success ${action} product`, {
        style: { backgroundColor: "green", color: "white" },
      });

      setOpen(false);
      setTimeout(() => router.refresh(), 200);
    } catch (error: any) {
      toast.error(`Something went wrong: ${error.message || error}`, {
        style: { backgroundColor: "red", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Title</Label>
              <Input
                id="name"
                value={title}
                className="col-span-3"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price</Label>
              <Input
                id="price"
                type="number"
                step="any"
                value={price}
                className="col-span-3"
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <Input
                id="description"
                value={description}
                className="col-span-3"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Category</Label>
              <Input
                id="category"
                value={category}
                className="col-span-3"
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Image</Label>
              <Input
                id="image"
                value={image}
                className="col-span-3"
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Stock</Label>
              <Input
                disabled={data != null}
                id="stock"
                value={stock}
                className="col-span-3"
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!!loading} type="submit">
              {loading ? "Loading..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
