import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PLATFORM_LINKS = [
  { to: "/events", label: "Events" },
  { to: "/retreats", label: "Retreat Escapes" },
  { to: "/streams", label: "Streams" },
  { to: "/xperience", label: "Xperience" },
  { to: "/insider", label: "Blog" },
];

const ABOUT_LINKS = [
  { to: "/about", label: "About Adventist Unite" },
  { to: "/service-mission", label: "Service & Mission" },
  { to: "/contact", label: "Contact Us" },
];

const LEGAL_LINKS = [
  { to: "/code-of-conduct", label: "Code of Conduct" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing! We'll keep you updated.");
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-card">
      {/* Main footer */}
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sda-gradient">
                <span className="text-xs font-bold text-primary-foreground">AU</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                Adventist <span className="text-secondary">Unite</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
              A Christ-centered platform connecting Adventist youth through fellowship, service, and spiritual growth across the nation.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="mt-5 flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Your email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl text-sm"
              />
              <Button type="submit" size="sm" className="rounded-xl px-5 shrink-0">
                Subscribe
              </Button>
            </form>

            {/* Contact info */}
            <div className="mt-5 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> hello@sdaunite.com</div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +254 700 000 000</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Nairobi, Kenya</div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">About</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {ABOUT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Scripture */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal & Info</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li><span className="text-sm text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-sm text-muted-foreground">Terms of Service</span></li>
              <li><span className="text-sm text-muted-foreground">Refund Policy</span></li>
            </ul>

            <blockquote className="mt-6 border-l-2 border-accent pl-3">
              <p className="text-sm italic text-muted-foreground">
                "And let us consider how we may spur one another on toward love and good deeds."
              </p>
              <cite className="mt-1 block text-xs font-semibold text-secondary">
                Hebrews 10:24
              </cite>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Adventist Unite. Built for the glory of God.</span>
          <span>Powered by Adventist Unite – A Christ-centered events platform.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
