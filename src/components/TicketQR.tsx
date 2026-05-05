import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface TicketQRProps {
  ticketId: string;
  size?: number;
}

const TicketQR = ({ ticketId, size = 200 }: TicketQRProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "get-ticket-qr",
          { body: { ticket_id: ticketId } },
        );
        if (error) throw error;
        if (!cancelled) setToken((data as any).token);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load QR");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground"
        style={{ width: size, height: size }}
      >
        QR unavailable
      </div>
    );
  }

  if (!token) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-muted"
        style={{ width: size, height: size }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className="rounded-lg bg-white p-2"
      style={{ width: size, height: size }}
    >
      <QRCodeSVG value={token} size={size - 16} level="M" />
    </div>
  );
};

export default TicketQR;
