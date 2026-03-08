import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useChurches } from "@/hooks/useChurches";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [churchId, setChurchId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: churches } = useChurches();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Password too short", description: "Use at least 6 characters." });
      return;
    }
    if (!churchId) {
      toast({ variant: "destructive", title: "Church required", description: "Please select your home church." });
      return;
    }
    setLoading(true);

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ variant: "destructive", title: "Signup failed", description: error.message });
      setLoading(false);
      return;
    }

    // Update profile with church if selected
    if (authData.user && churchId) {
      await supabase
        .from("profiles")
        .update({ church_id: churchId })
        .eq("user_id", authData.user.id);
    }

    toast({
      title: "Account created!",
      description: "Welcome to SDA Unite. You are now signed in.",
    });
    navigate("/profile");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-16 md:py-24">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sda">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Join Fellowship</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create your SDA Unite account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Home Church *</Label>
              <Select value={churchId} onValueChange={setChurchId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your church" />
                </SelectTrigger>
                <SelectContent>
                  {churches?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.church_name} — {c.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sda-gradient text-primary-foreground hover:opacity-90"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-secondary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
