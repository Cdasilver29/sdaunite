import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Footer from "@/components/Footer";
import { Menu } from "lucide-react";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Slim mobile header with sidebar trigger */}
          <header className="sticky top-0 z-40 flex h-12 items-center border-b border-border bg-background/80 backdrop-blur-md md:hidden">
            <SidebarTrigger className="ml-3">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <span className="ml-3 text-sm font-semibold text-foreground">
              SDA <span className="text-secondary">Unite</span>
            </span>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
