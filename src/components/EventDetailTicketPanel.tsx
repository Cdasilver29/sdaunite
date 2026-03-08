import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle } from "lucide-react";
import MpesaCheckout from "@/components/MpesaCheckout";
import type { DbEvent } from "@/hooks/useEvents";

const EventDetailTicketPanel = ({ event }: { event: DbEvent }) => {
  const { user, profile } = useAuth();
  const [selectedTier, setSelectedTier] = useState(0);
  const [conductAgreed, setConductAgreed] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const tiers = event.ticket_types || [];
  const tier = tiers[selectedTier];

  const profileComplete = !!profile?.full_name && !!profile?.church_id;
  const isLoggedIn = !!user;

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sda text-center">
        <UserCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-3 text-lg font-bold text-foreground">Sign in to continue</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create an account or log in to view event details and secure your ticket.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild className="bg-sda-gradient text-primary-foreground hover:opacity-90">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Logged in but profile incomplete
  if (!profileComplete) {
    return (
      <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sda text-center">
        <UserCircle className="mx-auto h-10 w-10 text-secondary" />
        <h3 className="mt-3 text-lg font-bold text-foreground">Complete Your Profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Please complete your profile to access event details, purchase tickets, and register for events.
        </p>
        <Button asChild className="mt-4 w-full bg-sda-gradient text-primary-foreground hover:opacity-90">
          <Link to="/profile">Complete Profile</Link>
        </Button>
      </div>
    );
  }

  // Show M-Pesa checkout
  if (showCheckout && tier) {
    return (
      <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sda">
        <MpesaCheckout
          eventId={event.id}
          ticketTypeId={tier.id}
          ticketName={tier.name}
          price={tier.price}
          currency={tier.currency}
          onBack={() => setShowCheckout(false)}
        />
      </div>
    );
  }

  // Full access — ticket selection
  return (
    <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sda">
      <h3 className="text-lg font-bold text-foreground">Secure Your Ticket</h3>

      {tiers.length > 0 ? (
        <div className="mt-4 space-y-2">
          {tiers.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(i)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                selectedTier === i
                  ? "border-secondary bg-secondary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{t.name}</span>
                <span className="text-sm font-bold text-primary">
                  {t.price === 0 ? "Free" : `${t.currency} ${t.price.toLocaleString()}`}
                </span>
              </div>
              {t.description && (
                <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No ticket types available yet.</p>
      )}

      {/* Code of conduct checkbox */}
      <div className="mt-6 flex items-start gap-2">
        <Checkbox
          id="conduct"
          checked={conductAgreed}
          onCheckedChange={(v) => setConductAgreed(v === true)}
          className="mt-0.5"
        />
        <label htmlFor="conduct" className="text-xs leading-relaxed text-muted-foreground">
          I agree to follow the{" "}
          <Link to="/code-of-conduct" className="font-medium text-secondary underline">
            SDA event code of conduct
          </Link>
          .
        </label>
      </div>

      <Button
        disabled={!conductAgreed || tiers.length === 0}
        onClick={() => setShowCheckout(true)}
        className="mt-4 w-full bg-sda-gradient text-primary-foreground hover:opacity-90 font-semibold"
        size="lg"
      >
        {tier?.price === 0
          ? "Register for Free"
          : tier
          ? `Pay ${tier.currency} ${tier.price.toLocaleString()}`
          : "No Tickets Available"}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Payments via M-Pesa
      </p>
    </div>
  );
};

export default EventDetailTicketPanel;
