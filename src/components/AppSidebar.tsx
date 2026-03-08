import {
  Home,
  CalendarDays,
  Heart,
  Info,
  Mail,
  Ticket,
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
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

const mainLinks = [
  { title: "Home", url: "/", icon: Home },
  { title: "Events", url: "/events", icon: CalendarDays },
  { title: "Service & Mission", url: "/service-mission", icon: Heart },
  { title: "About", url: "/about", icon: Info },
  { title: "Contact", url: "/contact", icon: Mail },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const isOrganizer = roles.includes("organizer") || roles.includes("admin");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const linkBase =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
  const linkIdle =
    "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";
  const linkActive = "bg-sidebar-accent text-sidebar-primary font-semibold";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* ── Header / Logo ── */}
      <SidebarHeader className="px-4 py-5">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-accent">
            <span className="text-sm font-bold text-white">SU</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-sidebar-foreground">
              SDA <span className="text-secondary">Unite</span>
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      {/* ── Main nav ── */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={`${linkBase} ${linkIdle}`}
                      activeClassName={linkActive}
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

        {/* ── Account section ── */}
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/my-tickets"
                      className={`${linkBase} ${linkIdle}`}
                      activeClassName={linkActive}
                    >
                      <Ticket className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>My Tickets</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/profile"
                      className={`${linkBase} ${linkIdle}`}
                      activeClassName={linkActive}
                    >
                      <User className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <span>{profile?.full_name || "My Profile"}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isOrganizer && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/dashboard"
                        className={`${linkBase} ${linkIdle}`}
                        activeClassName={linkActive}
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

      {/* ── Footer ── */}
      <SidebarFooter className="px-3 pb-4">
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
        {user ? (
          <button
            onClick={handleSignOut}
            className={`${linkBase} ${linkIdle} w-full mt-1`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        ) : (
          <div className="mt-1 flex flex-col gap-1">
            <NavLink
              to="/login"
              className={`${linkBase} ${linkIdle}`}
              activeClassName={linkActive}
            >
              <LogIn className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign In</span>}
            </NavLink>
            <NavLink
              to="/signup"
              className={`${linkBase} text-secondary hover:text-secondary/80`}
              activeClassName={linkActive}
            >
              <UserPlus className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Join Fellowship</span>}
            </NavLink>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
