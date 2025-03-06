import { Button } from "@/components/ui/button";

type Product = {
  id: number;
};

export default async function Admin() {
  const response = await fetch("http://localhost:3003/products");
  const data: Product[] = (await response.json()).data;

  return (
    <div className="p-6">
      Test
    </div>
  );
}
