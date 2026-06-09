import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronDown, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORIES } from "@/lib/events-data";

type DropdownConfig = {
  label: string;
  items: { href: string; label: string; desc?: string }[];
};

const DROPDOWNS: Record<string, DropdownConfig> = {
  Events: {
    label: "Events",
    items: [
      { href: "/events", label: "All Events", desc: "Browse everything" },
      ...CATEGORIES.map((c) => ({
        href: `/events?category=${encodeURIComponent(c.label)}`,
        label: c.label,
        desc: c.description,
      })),
    ],
  },
  Explore: {
    label: "Explore",
    items: [
      { href: "/retreats", label: "Retreat Escapes", desc: "Unplug & reconnect with God" },
      { href: "/streams", label: "Streams", desc: "Watch sermons & programs" },
      { href: "/xperience", label: "Xperience", desc: "Post-event galleries" },
      { href: "/insider", label: "Insider Blog", desc: "Faith & fellowship articles" },
      { href: "/singles-spark", label: "Singles Spark", desc: "Faith meets fellowship" },
      { href: "/football-league", label: "Football League", desc: "Adventist sports & sportsmanship" },
      { href: "/camp-meeting", label: "Camp Meeting", desc: "Live worship & music library" },
    ],
  },
  "Service & Mission": {
    label: "Service & Mission",
    items: [
      { href: "/service-mission", label: "Overview", desc: "Our mission & outreach" },
      { href: "/events?category=Service+%26+Mission", label: "Mission Events", desc: "Upcoming outreach events" },
      { href: "/contact", label: "Get Involved", desc: "Volunteer or organize" },
    ],
  },
  About: {
    label: "About",
    items: [
      { href: "/about", label: "About Adventist Unite", desc: "Our story & values" },
      { href: "/code-of-conduct", label: "Code of Conduct", desc: "Community guidelines" },
      { href: "/contact", label: "Contact Us", desc: "Reach out to the team" },
    ],
  },
};

const DropdownMenu = ({
  config,
  open,
  onEnter,
  onLeave,
}: {
  config: DropdownConfig;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) => {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded ${
          open ? "text-white" : "text-white/70 hover:text-[hsl(var(--accent))]"
        }`}
      >
        {config.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-2 min-w-[220px]">
          <div className="rounded-lg border border-white/10 bg-[hsl(202,100%,14%)]/95 backdrop-blur-xl shadow-xl py-1.5">
            {config.items.map((item) => (
              <Link
                key={item.href + item.label}
                to={item.href}
                className="flex flex-col px-4 py-2.5 hover:bg-white/10 transition-colors"
              >
                <span className="text-sm font-medium text-white/90">{item.label}</span>
                {item.desc && (
                  <span className="text-xs text-white/50 mt-0.5">{item.desc}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, roles, signOut } = useAuth();
  const isAdminUser = roles.includes("admin") || roles.includes("church_admin") || roles.includes("organizer") || roles.includes("super_admin");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, [location.pathname, location.search]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const handleDropdownEnter = (label: string) => {
    clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const desktopNav = (
    <nav className="hidden items-center gap-0.5 lg:flex">
      <Link
        to="/"
        className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded ${
          isActive("/") ? "text-white" : "text-white/70 hover:text-[hsl(var(--accent))]"
        }`}
      >
        Home
      </Link>

      {Object.entries(DROPDOWNS).map(([key, config]) => (
        <DropdownMenu
          key={key}
          config={config}
          open={openDropdown === key}
          onEnter={() => handleDropdownEnter(key)}
          onLeave={handleDropdownLeave}
        />
      ))}

      <Link
        to="/contact"
        className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded ${
          isActive("/contact") ? "text-white" : "text-white/70 hover:text-[hsl(var(--accent))]"
        }`}
      >
        Contact
      </Link>

      {user && (
        <Link
          to="/my-tickets"
          className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded ${
            isActive("/my-tickets") ? "text-white" : "text-white/70 hover:text-[hsl(var(--accent))]"
          }`}
        >
          My Tickets
        </Link>
      )}
    </nav>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b-0 text-primary-foreground transition-all duration-300 backdrop-blur-xl backdrop-saturate-150 ${
        scrolled
          ? "bg-[hsl(202,100%,14%)]/60 shadow-lg shadow-black/10"
          : "bg-[hsl(202,100%,14%)]/30 shadow-none"
      }`}
      style={{
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        backdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="text-base font-semibold tracking-tight text-white drop-shadow-sm">
            Adventist <span className="text-[hsl(var(--accent))]">Unite</span>
          </span>
        </Link>

        {desktopNav}

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="flex items-center gap-2">
              {isAdminUser && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--sda-warm))] hover:text-[hsl(var(--accent))] transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
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
              to="/auth/sign-in"
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-1.5 text-white/80 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[hsl(202,100%,18%)] border-t border-white/10">
          <nav className="flex flex-col px-5 py-4 gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                isActive("/") ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Home
            </Link>

            {Object.entries(DROPDOWNS).map(([key, config]) => (
              <div key={key}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  {config.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      mobileExpanded === key ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileExpanded === key && (
                  <div className="ml-3 border-l border-white/10 pl-3 flex flex-col gap-0.5 mt-1 mb-1">
                    {config.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        to={item.href}
                        className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                isActive("/contact") ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Contact
            </Link>

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
                {isAdminUser && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[hsl(var(--sda-warm))] hover:bg-white/5 rounded transition-colors"
                  >
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                )}
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
                  to="/auth/sign-in"
                  className="block text-center rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
                >
                  Sign In
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
