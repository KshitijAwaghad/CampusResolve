import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

const roleHome = {
  student: "/student/dashboard",
  faculty: "/faculty/dashboard",
  warden: "/warden/dashboard",
  admin: "/admin/dashboard",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      const userRole = data.user?.user_metadata?.role;
      if (userRole && roleHome[userRole]) {
        navigate(roleHome[userRole]);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <div className="pointer-events-none absolute -left-16 top-20 h-60 w-60 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl" />

      <Card className="relative w-full max-w-md">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Campus Resolve</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Welcome Back</h2>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          {error && (
            <p className="rounded-xl border border-rose-300 bg-rose-100/80 p-2 text-sm font-semibold text-rose-600 dark:border-rose-900 dark:bg-rose-900/30">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full py-2.5" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Continue"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-slate-500">Need an account? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-500">
            Register new user
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
