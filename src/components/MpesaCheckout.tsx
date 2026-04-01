import { useState, useEffect, useRef } from "react";
import { Phone, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type MpesaCheckoutProps = {
  eventId: string;
  ticketTypeId: string;
  ticketName: string;
  price: number;
  currency: string;
  onBack: () => void;
};

type CheckoutState = "phone_input" | "processing" | "polling" | "success" | "failed";

const MpesaCheckout = ({
  eventId,
  ticketTypeId,
  ticketName,
  price,
  currency,
  onBack,
}: MpesaCheckoutProps) => {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<CheckoutState>("phone_input");
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [mpesaReceipt, setMpesaReceipt] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>();
  const pollCountRef = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleSubmit = async () => {
    setError("");

    // Basic validation
    const cleaned = phone.replace(/[\s\-]/g, "");
    if (!/^(\+?254|0)[17]\d{8}$/.test(cleaned)) {
      setError("Enter a valid Kenyan phone number (e.g. 0712345678)");
      return;
    }

    setState("processing");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("mpesa-stk-push", {
        body: {
          event_id: eventId,
          ticket_type_id: ticketTypeId,
          phone_number: cleaned,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error || "STK Push failed");

      // Handle free tickets
      if (data.free) {
        setTicketId(data.ticket_id);
        setState("success");
        toast({ title: "Ticket secured", description: "Your free ticket has been issued." });
        return;
      }

      setPaymentId(data.payment_id);
      setState("polling");
      startPolling(data.payment_id);
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment");
      setState("phone_input");
    }
  };

  const startPolling = (pId: string) => {
    pollCountRef.current = 0;
    pollRef.current = setInterval(async () => {
      pollCountRef.current++;

      // Timeout after 2 minutes (24 polls × 5s)
      if (pollCountRef.current > 24) {
        clearInterval(pollRef.current);
        setState("failed");
        setError("Payment confirmation timed out. If you paid, your ticket will be issued shortly.");
        return;
      }

      try {
        const { data } = await supabase.functions.invoke("mpesa-payment-status", {
          body: {
            payment_id: pId,
            event_id: eventId,
            ticket_type_id: ticketTypeId,
          },
        });

        if (data?.status === "completed") {
          clearInterval(pollRef.current);
          setTicketId(data.ticket_id);
          setMpesaReceipt(data.mpesa_receipt);
          setState("success");
          toast({ title: "Payment confirmed", description: "Your ticket has been issued." });
        } else if (data?.status === "failed") {
          clearInterval(pollRef.current);
          setState("failed");
          setError("Payment was not completed. Please try again.");
        }
      } catch {
        // Silently retry on network errors
      }
    }, 5000);
  };

  if (state === "success") {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Ticket Confirmed!</h3>
        <p className="text-sm text-muted-foreground">
          Your ticket for <strong>{ticketName}</strong> has been issued.
        </p>
        {mpesaReceipt && (
          <p className="text-xs text-muted-foreground">
            M-Pesa Receipt: <span className="font-mono font-semibold">{mpesaReceipt}</span>
          </p>
        )}
        <Button onClick={() => navigate("/my-tickets")} className="w-full bg-sda-gradient text-primary-foreground">
          View My Tickets
        </Button>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Payment Failed</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            onClick={() => { setState("phone_input"); setError(""); }}
            className="flex-1 bg-sda-gradient text-primary-foreground"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (state === "processing" || state === "polling") {
    return (
      <div className="space-y-4 text-center py-4">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-secondary" />
        <h3 className="text-lg font-bold text-foreground">
          {state === "processing" ? "Initiating Payment..." : "Waiting for Confirmation"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {state === "processing"
            ? "Sending STK Push to your phone..."
            : "Check your phone and enter your M-Pesa PIN to complete payment."}
        </p>
        {state === "polling" && (
          <p className="text-xs text-muted-foreground/70 animate-pulse">
            Do not close this page
          </p>
        )}
      </div>
    );
  }

  // Phone input state
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Back to ticket selection
      </button>

      <div>
        <h3 className="text-lg font-bold text-foreground">Pay with M-Pesa</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {ticketName} — <strong>{currency} {price.toLocaleString()}</strong>
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">M-Pesa Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="0712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-9"
            maxLength={13}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <p className="text-xs text-muted-foreground">
          You'll receive an STK Push on this number. Enter your M-Pesa PIN to pay.
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!phone.trim()}
        className="w-full bg-sda-gradient text-primary-foreground hover:opacity-90 font-semibold"
        size="lg"
      >
        Pay {currency} {price.toLocaleString()}
      </Button>

      <div className="flex items-center justify-center gap-2 pt-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Secured by M-Pesa</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
};

export default MpesaCheckout;
