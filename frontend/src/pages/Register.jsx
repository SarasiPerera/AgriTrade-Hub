import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

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
  const notify = useToast();
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
  const [shake, setShake] = useState(0);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      notify("Account created — welcome to AgriTrade Hub!");
      navigate(dashboardByRole[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please check your details.");
      setShake((s) => s + 1);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link to="/" className="font-display text-lg font-semibold text-field">
          AgriTrade <span className="text-harvest">Hub</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Create an account</h1>

        <motion.form
          key={shake}
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-ink/70">I am a...</label>
            <LayoutGroup>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <motion.button
                    type="button"
                    key={r.value}
                    onClick={() => update("role", r.value)}
                    whileTap={{ scale: 0.96 }}
                    className={`focus-ring relative rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      form.role === r.value
                        ? "border-field text-paper"
                        : "border-ink/20 bg-white text-ink/70 hover:border-field"
                    }`}
                  >
                    {form.role === r.value && (
                      <motion.span
                        layoutId="role-highlight"
                        className="absolute inset-0 rounded-md bg-field"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{r.label}</span>
                  </motion.button>
                ))}
              </div>
            </LayoutGroup>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70">Full name</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md"
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
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink/70">District</label>
              <input
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md"
                placeholder="e.g. Kandy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-chili"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="focus-ring w-full rounded-md bg-field py-2.5 font-medium text-paper transition-colors hover:bg-field-light disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </motion.button>
        </motion.form>

        <p className="mt-6 text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-field underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
