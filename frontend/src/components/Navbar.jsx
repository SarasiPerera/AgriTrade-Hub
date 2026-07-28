import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const roleLabels = {
  farmer: "Farmer",
  wholesale: "Wholesale Center",
  export: "Export Center",
  admin: "Administrator",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="border-b border-field/10 bg-field">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-semibold text-paper">
          AgriTrade <span className="text-harvest">Hub</span>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-wide text-paper/70">
              {roleLabels[user.role]} · {user.full_name}
            </span>
            <motion.button
               whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="focus-ring rounded-md border border-paper/30 px-3 py-1.5 text-sm text-paper transition-colors hover:bg-paper/10"
            >
              Log out
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
}
