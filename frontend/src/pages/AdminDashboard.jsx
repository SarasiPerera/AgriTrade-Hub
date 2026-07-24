import { useEffect, useState } from "react";
import client from "../api/client";
import DashboardLayout from "../components/DashboardLayout";

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/60 p-5">
      <p className="font-mono text-xs uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-field">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
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
  }

  async function verify(userId) {
    await client.patch(`/api/admin/users/${userId}/verify`);
    await loadAll();
  }

  return (
    <DashboardLayout title="Admin dashboard" subtitle="Verify users, approve listings, and monitor marketplace health.">
      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : (
        <div className="space-y-10">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Farmers" value={stats.total_farmers} />
            <StatCard label="Buyers" value={stats.total_buyers} />
            <StatCard label="Products" value={stats.total_products} />
            <StatCard label="Active orders" value={stats.active_orders} />
            <StatCard label="Revenue (Rs)" value={stats.revenue.toLocaleString()} />
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-field">Pending listings</h2>
            {pending.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">Nothing awaiting approval.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {pending.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-md border border-ink/10 bg-white/60 px-4 py-3 text-sm">
                    <div>
                      <span className="font-medium text-ink">{p.crop}</span>
                      <span className="ml-2 text-ink/50">{p.quantity} {p.unit} · {p.district} · Rs {p.price_per_unit}/{p.unit}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => decide(p.id, "approve")}
                        className="focus-ring rounded-md bg-field px-2.5 py-1 text-xs text-paper hover:bg-field-light">
                        Approve
                      </button>
                      <button onClick={() => decide(p.id, "reject")}
                        className="focus-ring rounded-md border border-chili/40 px-2.5 py-1 text-xs text-chili hover:bg-chili/10">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
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
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-ink/10 bg-white/60">
                      <td className="px-4 py-2">{u.full_name}</td>
                      <td className="px-4 py-2 capitalize">{u.role}</td>
                      <td className="px-4 py-2">{u.district || "—"}</td>
                      <td className="px-4 py-2">{u.is_verified ? "Yes" : "No"}</td>
                      <td className="px-4 py-2 text-right">
                        {!u.is_verified && (
                          <button onClick={() => verify(u.id)}
                            className="focus-ring rounded-md border border-field/40 px-2.5 py-1 text-xs text-field hover:bg-field/10">
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
