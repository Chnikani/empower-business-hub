
import { Calendar, Database, FileText, Users, Palette, Monitor, FileCheck, ShoppingCart, MessageSquare, Megaphone, BarChart3, Mail } from "lucide-react";
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
    url: "/dashboard",
    icon: BarChart3,
    description: "Business Overview"
  },
  {
    title: "Accounting",
    url: "/dashboard/accounting",
    icon: Database,
    description: "Financial Management"
  },
  {
    title: "Knowledge Base",
    url: "/dashboard/knowledge",
    icon: FileText,
    description: "Documents & Notes"
  },
  {
    title: "CRM",
    url: "/dashboard/crm",
    icon: Users,
    description: "Customer Relations"
  },
  {
    title: "Creative Studio",
    url: "/dashboard/creative",
    icon: Palette,
    description: "AI Image Generation"
  },
  {
    title: "Website Builder",
    url: "/dashboard/website",
    icon: Monitor,
    description: "Build & Deploy Sites"
  },
  {
    title: "E-Signatures",
    url: "/dashboard/signatures",
    icon: FileCheck,
    description: "Document Signing"
  },
  {
    title: "Retail",
    url: "/dashboard/retail",
    icon: ShoppingCart,
    description: "Inventory & Sales"
  },
  {
    title: "Team Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
    description: "Team Communication"
  },
  {
    title: "Marketing",
    url: "/dashboard/marketing",
    icon: Megaphone,
    description: "Campaigns & Content"
  },
  {
    title: "Contact",
    url: "/dashboard/contact",
    icon: Mail,
    description: "Get in touch with us"
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/50 bg-card/80 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/50 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg">
            B
          </div>
          <div>
            <span className="font-bold text-lg text-gradient">Business OS</span>
            <p className="text-xs text-muted-foreground">All-in-One Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Business Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="group relative overflow-hidden rounded-lg transition-all duration-200 hover:bg-accent/10 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/10 data-[active=true]:to-accent/10 data-[active=true]:border-l-4 data-[active=true]:border-primary"
                  >
                    <Link to={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-colors group-hover:text-primary" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium group-hover:text-foreground transition-colors">
                          {item.title}
                        </span>
                        <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 truncate">
                          {item.description}
                        </p>
                      </div>
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
