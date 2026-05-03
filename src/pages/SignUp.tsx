import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SocialAuthButtons from "@/components/SocialAuthButtons";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Password too short", description: "Use at least 6 characters." });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ variant: "destructive", title: "Sign up failed", description: error.message });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account, then sign in.",
      });
      navigate("/auth/sign-in");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(202,100%,18%)] to-[hsl(200,78%,33%)] px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl dark:bg-card">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block text-xl font-bold tracking-tight text-[hsl(202,100%,18%)]">
            SDA <span className="text-[hsl(var(--accent))]">Unite</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-[hsl(220,9%,20%)] dark:text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-[hsl(220,9%,46%)] dark:text-muted-foreground">
            Join the Adventist Unite community
          </p>
        </div>

        {/* Social buttons */}
        <SocialAuthButtons />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[hsl(220,13%,91%)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[hsl(220,9%,60%)] dark:bg-card dark:text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[hsl(220,9%,30%)] dark:text-foreground">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={100}
              className="border-[hsl(220,13%,87%)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[hsl(220,9%,30%)] dark:text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[hsl(220,13%,87%)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[hsl(220,9%,30%)] dark:text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-[hsl(220,13%,87%)]"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(202,100%,18%)] text-white font-semibold hover:bg-[hsl(202,100%,24%)] shadow-md"
            size="lg"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-[hsl(220,9%,46%)] dark:text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/sign-in" className="font-semibold text-[hsl(202,100%,18%)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
