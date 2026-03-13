import { Home, CalendarDays, Heart, Info, Mail, User, LogOut, LayoutDashboard, Ticket } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { title: "Home", url: "/", icon: Home },
  { title: "Events", url: "/events", icon: CalendarDays },
  { title: "Singles Spark", url: "/singles-spark", icon: Heart },
  { title: "Football League", url: "/football-league", icon: CalendarDays },
  { title: "Service & Mission", url: "/service-mission", icon: Heart },
  { title: "About", url: "/about", icon: Info },
  { title: "Contact", url: "/contact", icon: Mail },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, roles, signOut } = useAuth();

  const isOrganizer = roles.includes("organizer") || roles.includes("admin");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/50 backdrop-blur-xl bg-sidebar/90">
      {/* Logo */}
      <SidebarHeader className="px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-accent">
            <span className="text-sm font-bold text-primary-foreground">SU</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">
              SDA <span className="text-accent">Unite</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <Separator className="bg-sidebar-border/50" />

      {/* Main nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Navigate
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account section */}
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Tickets">
                    <NavLink
                      to="/my-tickets"
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <Ticket className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>My Tickets</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Profile">
                    <NavLink
                      to="/profile"
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>My Profile</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isOrganizer && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Admin Dashboard">
                      <NavLink
                        to="/admin"
                        className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>Admin Dashboard</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 py-3">
        <Separator className="mb-3 bg-sidebar-border/50" />
        {user ? (
          <div className="flex flex-col gap-2">
            {!collapsed && (
              <p className="truncate px-2 text-xs text-sidebar-foreground/50">
                {profile?.full_name || user.email}
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="justify-start text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              asChild
            >
              <Link to="/auth/sign-in">
                <User className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="ml-2">Sign In</span>}
              </Link>
            </Button>
            <Button
              size="sm"
              className="justify-start bg-gradient-to-r from-secondary to-accent text-primary-foreground border-0 hover:opacity-90"
              asChild
            >
              <Link to="/auth/sign-up">
                {!collapsed ? "Join Fellowship" : <Heart className="h-4 w-4" />}
              </Link>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
