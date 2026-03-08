import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sda-gradient">
              <span className="text-xs font-bold text-primary-foreground">SU</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              SDA <span className="text-secondary">Unite</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            A Christ-centered platform connecting SDA youth through fellowship, service, and spiritual growth.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Platform</h4>
          <ul className="mt-3 flex flex-col gap-2">
            <li><Link to="/events" className="text-sm text-muted-foreground hover:text-foreground">Events</Link></li>
            <li><Link to="/code-of-conduct" className="text-sm text-muted-foreground hover:text-foreground">Code of Conduct</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Categories</h4>
          <ul className="mt-3 flex flex-col gap-2">
            <li><span className="text-sm text-muted-foreground">Fellowship</span></li>
            <li><span className="text-sm text-muted-foreground">Outdoor & Nature</span></li>
            <li><span className="text-sm text-muted-foreground">Service & Mission</span></li>
            <li><span className="text-sm text-muted-foreground">Sports & Health</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Scripture</h4>
          <blockquote className="mt-3 border-l-2 border-accent pl-3">
            <p className="text-sm italic text-muted-foreground">
              "And let us consider how we may spur one another on toward love and good deeds."
            </p>
            <cite className="mt-1 block text-xs font-semibold text-secondary">
              Hebrews 10:24
            </cite>
          </blockquote>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SDA Unite. Built for the glory of God.
      </div>
    </div>
  </footer>
);

export default Footer;
