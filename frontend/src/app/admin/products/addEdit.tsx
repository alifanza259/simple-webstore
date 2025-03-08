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
import { useEffect, useState } from "react";

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
  }, [data]); // Runs only when `data` changes

  async function handleSubmit() {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}`;
    const body = {
      title,
      category,
      price,
      description,
      image,
      stock,
    };

    if (data == null) {
      await fetch(url + "/products", {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
    } else {
      await fetch(`${url}/product/${data.id}`, {
        body: JSON.stringify(body),
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
      });
    }

    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Title</Label>
            <Input
              id="name"
              value={title}
              className="col-span-3"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Price</Label>
            <Input
              id="price"
              value={price}
              className="col-span-3"
              onChange={(e) => setPrice(parseInt(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Input
              id="description"
              value={description}
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Category</Label>
            <Input
              id="category"
              value={category}
              className="col-span-3"
              onChange={(e) => setCategory(e.target.value)}
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
              onChange={(e) => setStock(parseInt(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={(e) => handleSubmit()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
