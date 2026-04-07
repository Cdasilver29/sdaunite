import { useState } from "react";
import { Heart, Phone, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type DonationState = "amount" | "phone" | "processing" | "polling" | "success" | "failed";

const SUGGESTED_AMOUNTS = [100, 500, 1000, 2500, 5000];

const CampMeetingDonation = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<DonationState>("amount");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const reset = () => {
    setState("amount");
    setAmount("");
    setPhone("");
    setError("");
    setReceipt("");
  };

  const handlePhoneSubmit = async () => {
    setError("");
    const cleaned = phone.replace(/[\s\-]/g, "");
    if (!/^(\+?254|0)[17]\d{8}$/.test(cleaned)) {
      setError("Enter a valid Kenyan phone number");
      return;
    }
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 1) {
      setError("Enter a valid amount");
      return;
    }

    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to make a donation.", variant: "destructive" });
      return;
    }

    setState("processing");

    try {
      // Create a payment record via the edge function
      const { data, error: fnError } = await supabase.functions.invoke("camp-meeting-donate", {
        body: { phone_number: cleaned, amount: numAmount },
      });

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error || "STK Push failed");

      setState("polling");
      pollPayment(data.payment_id);
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment");
      setState("phone");
    }
  };

  const pollPayment = (paymentId: string) => {
    let count = 0;
    const interval = setInterval(async () => {
      count++;
      if (count > 24) {
        clearInterval(interval);
        setState("failed");
        setError("Payment confirmation timed out. If you paid, we'll confirm shortly.");
        return;
      }
      try {
        const { data } = await supabase.functions.invoke("mpesa-payment-status", {
          body: { payment_id: paymentId },
        });
        if (data?.status === "completed") {
          clearInterval(interval);
          setReceipt(data.mpesa_receipt || "");
          setState("success");
          toast({ title: "Thank you!", description: "Your donation has been received." });
        } else if (data?.status === "failed") {
          clearInterval(interval);
          setState("failed");
          setError("Payment was not completed. Please try again.");
        }
      } catch { /* retry */ }
    }, 5000);
  };

  const renderContent = () => {
    if (state === "success") {
      return (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Thank You!</h3>
          <p className="text-sm text-muted-foreground">Your donation of KES {parseInt(amount).toLocaleString()} has been received.</p>
          {receipt && <p className="text-xs text-muted-foreground">M-Pesa Receipt: <span className="font-mono font-semibold">{receipt}</span></p>}
          <Button onClick={() => { reset(); setOpen(false); }} className="w-full rounded-full">Close</Button>
        </div>
      );
    }

    if (state === "failed") {
      return (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Payment Failed</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={reset} className="w-full rounded-full">Try Again</Button>
        </div>
      );
    }

    if (state === "processing" || state === "polling") {
      return (
        <div className="space-y-4 text-center py-8">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[hsl(var(--sda-warm))]" />
          <h3 className="text-lg font-bold text-foreground">
            {state === "processing" ? "Initiating Payment..." : "Waiting for Confirmation"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {state === "processing" ? "Sending STK Push to your phone..." : "Enter your M-Pesa PIN on your phone to complete."}
          </p>
          {state === "polling" && <p className="text-xs text-muted-foreground/70 animate-pulse">Do not close this window</p>}
        </div>
      );
    }

    if (state === "phone") {
      return (
        <div className="space-y-4">
          <button onClick={() => setState("amount")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Change amount
          </button>
          <p className="text-sm text-muted-foreground">Donating <strong>KES {parseInt(amount).toLocaleString()}</strong></p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">M-Pesa Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="tel" placeholder="0712345678" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" maxLength={13} />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <Button onClick={handlePhoneSubmit} disabled={!phone.trim()} className="w-full rounded-full bg-[hsl(var(--sda-warm))] text-white hover:bg-[hsl(var(--sda-warm))]/90">
            Send KES {parseInt(amount || "0").toLocaleString()} via M-Pesa
          </Button>
        </div>
      );
    }

    // Amount selection
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Choose or enter a donation amount</p>
        <div className="grid grid-cols-3 gap-2">
          {SUGGESTED_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(String(a))}
              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                amount === String(a)
                  ? "border-[hsl(var(--sda-warm))] bg-[hsl(var(--sda-warm))]/10 text-[hsl(var(--sda-warm))]"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              KES {a.toLocaleString()}
            </button>
          ))}
          <div className="col-span-3">
            <Input
              type="number"
              placeholder="Custom amount (KES)"
              value={SUGGESTED_AMOUNTS.includes(Number(amount)) ? "" : amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
            />
          </div>
        </div>
        <Button
          onClick={() => setState("phone")}
          disabled={!amount || parseInt(amount) < 1}
          className="w-full rounded-full bg-[hsl(var(--sda-warm))] text-white hover:bg-[hsl(var(--sda-warm))]/90"
        >
          Continue
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button className="bg-[hsl(var(--sda-warm))] text-white hover:bg-[hsl(var(--sda-warm))]/90 rounded-full px-8 h-10 font-medium text-sm min-w-[160px]">
          <Heart className="mr-1.5 h-4 w-4" /> Support via M-Pesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support Camp Meeting Music</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CampMeetingDonation;
