import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/service-mission", label: "Service & Mission" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, roles, signOut } = useAuth();

  const isOrganizer = roles.includes("organizer") || roles.includes("admin");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sda-gradient">
            <span className="text-sm font-bold text-primary-foreground">SU</span>
          </div>
          <span className="text-lg font-bold text-foreground">
            SDA <span className="text-secondary">Unite</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {profile?.full_name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-tickets")}>
                  <Ticket className="mr-2 h-4 w-4" /> My Tickets
                </DropdownMenuItem>
                {isOrganizer && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-sda-gradient text-primary-foreground hover:opacity-90" asChild>
                <Link to="/signup">Join Fellowship</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger — Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden text-foreground" aria-label="Open menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle className="text-left">
                <span className="text-foreground">SDA </span>
                <span className="text-secondary">Unite</span>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-3 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <>
                  <div className="my-2 border-t border-border" />
                  <Link
                    to="/my-tickets"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive("/my-tickets")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Ticket className="h-4 w-4" /> My Tickets
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive("/profile")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  {isOrganizer && (
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive("/dashboard")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted/60"
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                </>
              )}

              <div className="mt-4 flex flex-col gap-2 px-1">
                {user ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/login" onClick={() => setOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-sda-gradient text-primary-foreground"
                      asChild
                    >
                      <Link to="/signup" onClick={() => setOpen(false)}>
                        Join Fellowship
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
