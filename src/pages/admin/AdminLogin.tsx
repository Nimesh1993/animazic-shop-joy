import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CREDENTIALS, useAuthStore } from "@/stores/authStore";

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/admin");
    } else {
      setError("Invalid credentials. Try the demo login below.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 pt-16 text-foreground">
      <div className="w-full max-w-sm animate-fade-in rounded-2xl border border-border/60 bg-card p-8 shadow-elegant">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Admin sign-in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Animazic Gadgets control room</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="w-full rounded-full">
            <Lock className="h-4 w-4" /> Sign in
          </Button>
        </form>

        <div className="mt-6 rounded-lg border border-dashed border-border/60 bg-secondary/40 p-3 text-center text-xs text-muted-foreground">
          Demo: <span className="text-foreground">{DEMO_CREDENTIALS.username}</span> /{" "}
          <span className="text-foreground">{DEMO_CREDENTIALS.password}</span>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;