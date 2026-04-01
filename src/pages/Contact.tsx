import { useState } from "react";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible. God bless!",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label="Get In Touch"
        title="Contact"
        titleAccent="Us."
        subtitle="Have a question, suggestion, or need support? We'd love to hear from you"
        backgroundImage="/images/sda-about.jpg"
      />

      <section className="py-16">
        <div className="container grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sda-gradient">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="mt-1 text-sm text-muted-foreground">support@sdaunite.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sda-gradient">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">WhatsApp</h3>
                <p className="mt-1 text-sm text-muted-foreground">+254 700 000 000</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sda-gradient">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Location</h3>
                <p className="mt-1 text-sm text-muted-foreground">Nairobi, Kenya</p>
              </div>
            </div>

            <blockquote className="border-l-4 border-accent pl-4">
              <p className="text-sm italic text-muted-foreground">
                "Bear one another's burdens, and so fulfill the law of Christ."
              </p>
              <cite className="mt-1 block text-xs font-semibold text-secondary">
                — Galatians 6:2
              </cite>
            </blockquote>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sda lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Tell us more..." rows={5} required />
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-sda-gradient text-primary-foreground hover:opacity-90"
            >
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
