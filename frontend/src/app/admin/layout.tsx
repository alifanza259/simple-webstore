import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <SidebarProvider>
          <AppSidebar />
          <main className="ml-3 mr-3 md:w-full">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
  );
}
