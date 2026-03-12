import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Users, Settings, LayoutDashboard, Mountain, BookOpen, Video, Image } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/retreats", label: "Retreats", icon: Mountain },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/streams", label: "Streams", icon: Video },
  { to: "/admin/xperience", label: "Xperience", icon: Image },
  { to: "/admin/attendees", label: "Attendees", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, roles, loading } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);

  const isAdmin = roles.includes("admin") || roles.includes("church_admin") || roles.includes("organizer") || roles.includes("super_admin");

  useEffect(() => {
    if (!loading && user && !isAdmin && !toastShown.current) {
      toastShown.current = true;
      toast.error("Access denied. You don't have admin privileges.");
    }
  }, [loading, user, isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-[80vh]">
      <div className="border-b border-border bg-card/50">
        <div className="container">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(item.to, item.end)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="container py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
