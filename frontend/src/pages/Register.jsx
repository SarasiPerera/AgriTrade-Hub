import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roles = [
  { value: "farmer", label: "Farmer", blurb: "List your harvest and manage orders" },
  { value: "wholesale", label: "Wholesale Center", blurb: "Search, filter, and order produce" },
  { value: "export", label: "Export Center", blurb: "Source export-grade lots" },
];

const dashboardByRole = {
  farmer: "/farmer",
  wholesale: "/wholesale",
  export: "/export",
  admin: "/admin",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "farmer",
    district: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(dashboardByRole[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display text-lg font-semibold text-field">
          AgriTrade <span className="text-harvest">Hub</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Create an account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink/70">I am a...</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => update("role", r.value)}
                  className={`focus-ring rounded-md border px-3 py-2 text-left text-sm transition ${
                    form.role === r.value
                      ? "border-field bg-field text-paper"
                      : "border-ink/20 bg-white text-ink/70 hover:border-field"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70">Full name</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink/70">District</label>
              <input
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm"
                placeholder="e.g. Kandy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-chili">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring w-full rounded-md bg-field py-2.5 font-medium text-paper transition hover:bg-field-light disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-field underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
