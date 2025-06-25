
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Accounting from "./pages/Accounting";
import KnowledgeBase from "./pages/KnowledgeBase";
import CRM from "./pages/CRM";
import CreativeStudio from "./pages/CreativeStudio";
import WebsiteBuilder from "./pages/WebsiteBuilder";
import ESignatures from "./pages/ESignatures";
import Retail from "./pages/Retail";
import TeamChat from "./pages/TeamChat";
import Marketing from "./pages/Marketing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <div className="min-h-screen flex w-full">
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="accounting" element={<Accounting />} />
                <Route path="knowledge" element={<KnowledgeBase />} />
                <Route path="crm" element={<CRM />} />
                <Route path="creative" element={<CreativeStudio />} />
                <Route path="website" element={<WebsiteBuilder />} />
                <Route path="signatures" element={<ESignatures />} />
                <Route path="retail" element={<Retail />} />
                <Route path="chat" element={<TeamChat />} />
                <Route path="marketing" element={<Marketing />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
