import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/service-mission", label: "Service & Mission" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[hsl(202,100%,18%)]/90 shadow-sm border-b border-white/5"
          : "bg-transparent border-b border-white/10"
      } backdrop-blur-md`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="text-base font-semibold tracking-tight text-white">
            SDA <span className="text-[hsl(var(--accent))]">Unite</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded ${
                isActive(link.href)
                  ? "text-white"
                  : "text-white/70 hover:text-[hsl(var(--accent))]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/my-tickets"
              className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded ${
                isActive("/my-tickets")
                  ? "text-white"
                  : "text-white/70 hover:text-[hsl(var(--accent))]"
              }`}
            >
              My Tickets
            </Link>
          )}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-[hsl(var(--accent))] transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                {profile?.full_name || "Profile"}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/signup"
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
            >
              Join Fellowship
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-1.5 text-white/80 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[hsl(202,100%,18%)] border-t border-white/10">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/my-tickets"
                  className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  My Tickets
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
            <div className="mt-3 pt-3 border-t border-white/10">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="block text-center rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
                >
                  Join Fellowship
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
