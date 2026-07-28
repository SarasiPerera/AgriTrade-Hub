import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import { useToast } from "../components/Toast";
import { SkeletonList, SkeletonRow } from "../components/Skeleton";
import { EmptyBasketIllustration } from "../components/illustrations";

const emptyForm = {
  crop: "",
  variety: "",
  harvest_date: "",
  quantity: "",
  unit: "kg",
  grade: "B",
  organic: false,
  district: "",
  estimated_delivery_date: "",
  price_per_unit: "",
  export_quality: false,
};

function StatusPill({ status }) {
  const styles = {
    pending: "bg-harvest-light/40 text-clay",
    approved: "bg-field-light/20 text-field",
    rejected: "bg-chili/10 text-chili",
    sold_out: "bg-ink/10 text-ink/50",
    accepted: "bg-field-light/20 text-field",
    delivered: "bg-field-light/20 text-field",
    cancelled: "bg-ink/10 text-ink/50",
  };
  return (
    <motion.span
      layout
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-ink/10"}`}
    >
      {status.replace("_", " ")}
    </motion.span>
  );
}

const listItem = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
};

function EmptyState({ text }) {
  return (
    <div className="mt-3 flex flex-col items-center gap-2 rounded-md border border-dashed border-ink/15 py-8 text-center">
      <EmptyBasketIllustration className="h-16 w-16 opacity-70" />
      <p className="text-sm text-ink/50">{text}</p>
    </div>
  );
}

export default function FarmerDashboard() {
  const notify = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    const [p, o] = await Promise.all([
      client.get("/api/products/mine"),
      client.get("/api/orders/incoming"),
    ]);
    setProducts(p.data);
    setOrders(o.data);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price_per_unit: Number(form.price_per_unit),
        variety: form.variety || null,
        estimated_delivery_date: form.estimated_delivery_date || null,
      };
      await client.post("/api/products", payload);
      setForm(emptyForm);
      await loadAll();
      notify(`${payload.crop} listing added — pending admin approval.`);
    } catch (err) {
      const msg = err.response?.data?.detail || "Could not add listing.";
      setError(msg);
      notify(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function respondToOrder(orderId, status) {
    await client.patch(`/api/orders/${orderId}/status`, { status });
    await loadAll();
    notify(status === "accepted" ? "Order accepted." : "Order rejected.", status === "accepted" ? "success" : "error");
  }

  return (
    <DashboardLayout
      title="Farmer dashboard"
      subtitle="List your harvest, track approvals, and respond to incoming orders."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Add listing */}
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-lg border border-ink/10 bg-white/60 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-field">Add a listing</h2>
          <form onSubmit={handleAddProduct} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Crop (e.g. Carrot)" value={form.crop}
                onChange={(e) => update("crop", e.target.value)}
                className="focus-ring rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
              <input placeholder="Variety" value={form.variety}
                onChange={(e) => update("variety", e.target.value)}
                className="focus-ring rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-ink/60">Harvest date</label>
                <input required type="date" value={form.harvest_date}
                  onChange={(e) => update("harvest_date", e.target.value)}
                  className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
              </div>
              <div>
                <label className="text-xs text-ink/60">Est. delivery</label>
                <input type="date" value={form.estimated_delivery_date}
                  onChange={(e) => update("estimated_delivery_date", e.target.value)}
                  className="focus-ring mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input required type="number" min="0" step="0.1" placeholder="Quantity" value={form.quantity}
                onChange={(e) => update("quantity", e.target.value)}
                className="focus-ring rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
              <select value={form.unit} onChange={(e) => update("unit", e.target.value)}
                className="focus-ring rounded-md border border-ink/20 bg-white px-3 py-2 text-sm">
                <option value="kg">kg</option>
                <option value="unit">unit</option>
              </select>
              <select value={form.grade} onChange={(e) => update("grade", e.target.value)}
                className="focus-ring rounded-md border border-ink/20 bg-white px-3 py-2 text-sm">
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="District" value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className="focus-ring rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
              <input required type="number" min="0" step="0.01" placeholder="Price per unit (Rs)"
                value={form.price_per_unit}
                onChange={(e) => update("price_per_unit", e.target.value)}
                className="focus-ring rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
            </div>
            <div className="flex gap-5 text-sm text-ink/70">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.organic}
                  onChange={(e) => update("organic", e.target.checked)} />
                Organic
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.export_quality}
                  onChange={(e) => update("export_quality", e.target.checked)} />
                Export quality
              </label>
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
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.97 }}
              className="focus-ring w-full rounded-md bg-field py-2.5 font-medium text-paper transition-colors hover:bg-field-light disabled:opacity-60"
            >
              {submitting ? "Listing…" : "Add listing"}
            </motion.button>
          </form>
        </motion.section>

        {/* Listings + orders */}
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-lg font-semibold text-field">Your listings</h2>
            {loading ? (
              <div className="mt-3"><SkeletonList count={3} /></div>
            ) : products.length === 0 ? (
              <EmptyState text="No listings yet — add your first harvest." />
            ) : (
              <div className="mt-3 space-y-2">
                <AnimatePresence>
                  {products.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      variants={listItem}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center justify-between rounded-md border border-ink/10 bg-white/60 px-4 py-3 text-sm transition-shadow hover:shadow-sm"
                    >
                      <div>
                        <span className="font-medium text-ink">{p.crop}</span>
                        <span className="ml-2 text-ink/50">{p.quantity} {p.unit} · {p.district}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-ink/70">Rs {p.price_per_unit}/{p.unit}</span>
                        <StatusPill status={p.status} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-field">Incoming orders</h2>
            {loading ? (
              <div className="mt-3"><SkeletonRow /></div>
            ) : orders.length === 0 ? (
              <EmptyState text="No orders yet." />
            ) : (
              <div className="mt-3 space-y-2">
                <AnimatePresence>
                  {orders.map((o) => (
                    <motion.div
                      key={o.id}
                      layout
                      variants={listItem}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center justify-between rounded-md border border-ink/10 bg-white/60 px-4 py-3 text-sm transition-shadow hover:shadow-sm"
                    >
                      <div>
                        <span className="font-medium text-ink">Order #{o.id}</span>
                        <span className="ml-2 text-ink/50">{o.quantity} units · Rs {o.total_price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusPill status={o.status} />
                        {o.status === "pending" && (
                          <>
                            <motion.button whileTap={{ scale: 0.94 }} onClick={() => respondToOrder(o.id, "accepted")}
                              className="focus-ring rounded-md bg-field px-2.5 py-1 text-xs text-paper hover:bg-field-light">
                              Accept
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.94 }} onClick={() => respondToOrder(o.id, "rejected")}
                              className="focus-ring rounded-md border border-chili/40 px-2.5 py-1 text-xs text-chili hover:bg-chili/10">
                              Reject
                            </motion.button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
