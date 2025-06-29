import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { AuthGuard } from "@/components/AuthGuard";
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
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import InviteAccept from "./pages/InviteAccept";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BusinessProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen w-full">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/invite/:code" element={<InviteAccept />} />
                
                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <SidebarProvider>
                        <AppLayout />
                      </SidebarProvider>
                    </AuthGuard>
                  }
                >
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
                  <Route path="contact" element={<Contact />} />
                </Route>
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </BusinessProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
