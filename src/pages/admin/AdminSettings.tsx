import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Mail } from "lucide-react";

const AdminSettings = () => {
  const { user, profile, roles } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Account info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium text-foreground">{profile?.full_name || "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-foreground">{user?.email || "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Roles:</span>
              <div className="flex gap-1.5">
                {roles.map((r) => (
                  <Badge key={r} className="text-xs">{r}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role management info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Role Management</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Roles are managed at the database level for security. To assign admin or church_admin roles, 
            run the following SQL in your backend console:
          </p>
          <pre className="mt-3 rounded-lg bg-muted p-4 text-xs text-foreground overflow-x-auto">
{`-- Make a user admin by email:
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'user@example.com'),
  'admin'
);

-- Or church_admin:
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'user@example.com'),
  'church_admin'
);`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
