import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div>
      Store page

      <Button><a href="/admin">Go To Admin Page</a></Button>
    </div>
  );
}
