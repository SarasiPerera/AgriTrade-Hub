import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import { useToast } from "../components/Toast";
import { SkeletonGrid, SkeletonRow } from "../components/Skeleton";
import { EmptyBasketIllustration } from "../components/illustrations";

function StatCard({ label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="rounded-lg border border-ink/10 bg-white/60 p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="font-mono text-xs uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-field">{value}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const notify = useToast();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    const [s, p, u] = await Promise.all([
      client.get("/api/admin/stats"),
      client.get("/api/admin/products/pending"),
      client.get("/api/admin/users"),
    ]);
    setStats(s.data);
    setPending(p.data);
    setUsers(u.data);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function decide(productId, action) {
    await client.patch(`/api/admin/products/${productId}/${action}`);
    await loadAll();
    notify(action === "approve" ? "Listing approved." : "Listing rejected.", action === "approve" ? "success" : "error");
  }

  async function verify(userId) {
    await client.patch(`/api/admin/users/${userId}/verify`);
    await loadAll();
    notify("User verified.");
  }

  return (
    <DashboardLayout title="Admin dashboard" subtitle="Verify users, approve listings, and monitor marketplace health.">
      {loading ? (
        <div className="space-y-10">
          <SkeletonGrid count={5} />
          <SkeletonRow />
        </div>
      ) : (
        <div className="space-y-10">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard index={0} label="Farmers" value={stats.total_farmers} />
            <StatCard index={1} label="Buyers" value={stats.total_buyers} />
            <StatCard index={2} label="Products" value={stats.total_products} />
            <StatCard index={3} label="Active orders" value={stats.active_orders} />
            <StatCard index={4} label="Revenue (Rs)" value={stats.revenue.toLocaleString()} />
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-field">Pending listings</h2>
            {pending.length === 0 ? (
              <div className="mt-3 flex flex-col items-center gap-2 rounded-md border border-dashed border-ink/15 py-8 text-center">
                <EmptyBasketIllustration className="h-14 w-14 opacity-70" />
                <p className="text-sm text-ink/50">Nothing awaiting approval.</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <AnimatePresence>
                  {pending.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
                      className="flex items-center justify-between rounded-md border border-ink/10 bg-white/60 px-4 py-3 text-sm transition-shadow hover:shadow-sm"
                    >
                      <div>
                        <span className="font-medium text-ink">{p.crop}</span>
                        <span className="ml-2 text-ink/50">{p.quantity} {p.unit} · {p.district} · Rs {p.price_per_unit}/{p.unit}</span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button whileTap={{ scale: 0.94 }} onClick={() => decide(p.id, "approve")}
                          className="focus-ring rounded-md bg-field px-2.5 py-1 text-xs text-paper hover:bg-field-light">
                          Approve
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.94 }} onClick={() => decide(p.id, "reject")}
                          className="focus-ring rounded-md border border-chili/40 px-2.5 py-1 text-xs text-chili hover:bg-chili/10">
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-field">Users</h2>
            <div className="mt-3 overflow-hidden rounded-lg border border-ink/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-field text-paper">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Role</th>
                    <th className="px-4 py-2 font-medium">District</th>
                    <th className="px-4 py-2 font-medium">Verified</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((u) => (
                      <motion.tr
                        key={u.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-ink/10 bg-white/60 transition-colors hover:bg-white"
                      >
                        <td className="px-4 py-2">{u.full_name}</td>
                        <td className="px-4 py-2 capitalize">{u.role}</td>
                        <td className="px-4 py-2">{u.district || "—"}</td>
                        <td className="px-4 py-2">{u.is_verified ? "Yes" : "No"}</td>
                        <td className="px-4 py-2 text-right">
                          {!u.is_verified && (
                            <motion.button whileTap={{ scale: 0.94 }} onClick={() => verify(u.id)}
                              className="focus-ring rounded-md border border-field/40 px-2.5 py-1 text-xs text-field hover:bg-field/10">
                              Verify
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
