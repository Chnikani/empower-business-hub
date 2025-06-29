
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessSelector } from "./BusinessSelector";

const AppLayout = () => {
  return (
    <div className="flex w-full">
      <AppSidebar />
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 w-full">
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-card/80 backdrop-blur-md px-6 z-10 shadow-sm">
          <SidebarTrigger className="-ml-1 hover:bg-accent/10" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-lg">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Business OS</h1>
              <p className="text-xs text-muted-foreground">Empower Your Business</p>
            </div>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <BusinessSelector />
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
