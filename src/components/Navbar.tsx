import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, roles, signOut } = useAuth();

  const isOrganizer = roles.includes("organizer") || roles.includes("admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <>
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[hsl(202,100%,18%)]/95 backdrop-blur-md shadow-sm"
          : "bg-[hsl(202,100%,18%)]/10 backdrop-blur-md"
      } border-b border-white/10`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent))]">
            <span className="text-sm font-bold text-white">SU</span>
          </div>
          <span className="text-lg font-semibold text-white">
            SDA <span className="text-[hsl(var(--accent))]">Unite</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-[hsl(var(--accent))] ${
                isActive(link.href) ? "text-white" : "text-white/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/my-tickets"
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-1.5"
              >
                <Ticket className="h-3.5 w-3.5" /> My Tickets
              </Link>
              <Link
                to="/profile"
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5" /> {profile?.full_name || "Profile"}
              </Link>
              {isOrganizer && (
                <Link
                  to="/dashboard"
                  className="rounded-full bg-[hsl(var(--accent))]/20 px-4 py-1.5 text-sm font-medium text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/30 transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-white/90 hover:text-[hsl(var(--accent))] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--accent))] px-5 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Join Fellowship
              </Link>
            </>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Open menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72 bg-[hsl(202,100%,18%)] border-l border-white/10 p-0">
              <SheetHeader className="border-b border-white/10 px-5 py-4">
                <SheetTitle className="text-left text-white">
                  SDA <span className="text-[hsl(var(--accent))]">Unite</span>
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
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="my-2 border-t border-white/10" />
                    <Link
                      to="/my-tickets"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive("/my-tickets")
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Ticket className="h-4 w-4" /> My Tickets
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive("/profile")
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    {isOrganizer && (
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-[hsl(var(--accent))] transition-colors hover:bg-white/5`}
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                  </>
                )}

                <div className="mt-4 flex flex-col gap-2 px-1">
                  {user ? (
                    <button
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="rounded-full bg-white/10 px-4 py-2 text-center text-sm font-medium text-white hover:bg-white/20 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setOpen(false)}
                        className="rounded-full bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--accent))] px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                      >
                        Join Fellowship
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    {/* Spacer for fixed navbar */}
    <div className="h-[60px]" />
    </>
  );
};

export default Navbar;
