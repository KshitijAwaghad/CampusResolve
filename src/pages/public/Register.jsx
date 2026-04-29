import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createdEmail, setCreatedEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and Confirm Password must match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await registerUser({
        name: name.trim(),
        email: normalizedEmail,
        role: "student",
        department: department.trim(),
        password,
      });

      setCreatedEmail(user?.email || normalizedEmail);
      setName("");
      setEmail("");
      setDepartment("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to register user.");
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
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Create Account</h2>
        <p className="mt-1 text-sm text-slate-500">Register a student profile with your email and password</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && (
            <p className="rounded-xl border border-rose-300 bg-rose-100/80 p-2 text-sm font-semibold text-rose-600 dark:border-rose-900 dark:bg-rose-900/30">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full py-2.5" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register User"}
          </Button>
        </form>

        {createdEmail && (
          <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-100/80 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            Account created successfully! Please proceed to login with <span className="text-base font-extrabold">{createdEmail}</span>.
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500">
            Go to Login
          </Link>
          <button
            type="button"
            className="font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </Card>
    </div>
  );
}

export default Register;
