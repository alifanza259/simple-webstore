"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteProduct({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/product/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (result.status != 204) {
        const response = await result.json();
        throw new Error(response.message || "Unknown error");
      }

      toast.success("Success delete product", {
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => handleDelete()}
              disabled={!!loading}
            >
              {loading ? "Loading..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
