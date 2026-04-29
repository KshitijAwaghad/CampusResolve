import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const roleOptions = ["Faculty", "Warden", "Admin"];

function UserManagement() {
  const { createManagedUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Faculty",
    hostel: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "role" && value !== "Warden" ? { hostel: "" } : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const user = await createManagedUser({
        ...form,
        role: form.role,
        hostel: form.role === "Warden" ? form.hostel : "",
      });

      setSuccess(`Created ${form.role.toLowerCase()} account for ${user.email || form.email}.`);
      setForm({
        name: "",
        email: "",
        role: "Faculty",
        hostel: "",
        password: "",
      });
    } catch (err) {
      setError(err.message || "Failed to create managed user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">User Management</h2>
        <p className="page-subtitle">Create faculty, warden, and admin accounts from a protected admin workflow.</p>
      </div>

      <Card className="max-w-3xl">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Create Managed Account</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            This screen is designed to call a secure admin provisioning endpoint. Public registration remains student-only.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input label="Full Name" value={form.name} onChange={(e) => onField("name", e.target.value)} required />
          <Input label="Email Address" type="email" value={form.email} onChange={(e) => onField("email", e.target.value)} required />
          <Select label="Role" value={form.role} onChange={(e) => onField("role", e.target.value)} options={roleOptions} />

          {form.role === "Warden" && (
            <Input label="Hostel Assigned" value={form.hostel} onChange={(e) => onField("hostel", e.target.value)} required />
          )}

          <Input
            label="Temporary Password"
            type="password"
            value={form.password}
            onChange={(e) => onField("password", e.target.value)}
            required
          />

          {error && (
            <p className="rounded-xl border border-rose-300 bg-rose-100/80 p-3 text-sm font-semibold text-rose-600 dark:border-rose-900 dark:bg-rose-900/30">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl border border-emerald-300 bg-emerald-100/80 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              {success}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default UserManagement;
