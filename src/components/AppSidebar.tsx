
import { Calendar, Database, FileText, Users, Palette, Monitor, FileCheck, ShoppingCart, MessageSquare, Megaphone, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Accounting",
    url: "/accounting",
    icon: Database,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge",
    icon: FileText,
  },
  {
    title: "CRM",
    url: "/crm",
    icon: Users,
  },
  {
    title: "Creative Studio",
    url: "/creative",
    icon: Palette,
  },
  {
    title: "Website Builder",
    url: "/website",
    icon: Monitor,
  },
  {
    title: "E-Signatures",
    url: "/signatures",
    icon: FileCheck,
  },
  {
    title: "Retail",
    url: "/retail",
    icon: ShoppingCart,
  },
  {
    title: "Team Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Marketing",
    url: "/marketing",
    icon: Megaphone,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
            B
          </div>
          <span className="font-semibold text-lg">Business OS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
