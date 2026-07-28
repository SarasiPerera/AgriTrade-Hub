import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const dashboardByRole = {
  farmer: "/farmer",
  wholesale: "/wholesale",
  export: "/export",
  admin: "/admin",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const notify = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      notify(`Welcome back!`);
      navigate(dashboardByRole[user.role] || "/");
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed. Check your credentials.";
      setError(msg);
      setShake((s) => s + 1);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="font-display text-lg font-semibold text-field">
          AgriTrade <span className="text-harvest">Hub</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Log in</h1>

        <motion.form
          key={shake}
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-ink/70">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/70">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md"
            />
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
            {submitting ? "Logging in…" : "Log in"}
          </motion.button>
        </motion.form>

        <p className="mt-6 text-sm text-ink/60">
          New here?{" "}
          <Link to="/register" className="font-medium text-field underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
