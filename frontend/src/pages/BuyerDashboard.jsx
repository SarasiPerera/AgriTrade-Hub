import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import { useToast } from "../components/Toast";
import { SkeletonGrid, SkeletonRow } from "../components/Skeleton";
import { EmptyBasketIllustration, TruckIllustration } from "../components/illustrations";

function StatusPill({ status }) {
  const styles = {
    pending: "bg-harvest-light/40 text-clay",
    accepted: "bg-field-light/20 text-field",
    rejected: "bg-chili/10 text-chili",
    delivered: "bg-field-light/20 text-field",
    cancelled: "bg-ink/10 text-ink/50",
  };
  return (
    <motion.span layout className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-ink/10"}`}>
      {status}
    </motion.span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export default function BuyerDashboard({ variant }) {
  const notify = useToast();
  const isExport = variant === "export";
  const [filters, setFilters] = useState({ crop: "", district: "" });
  const [matchQty, setMatchQty] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const { data } = await client.get("/api/orders/mine");
    setOrders(data);
  }

  async function loadProducts() {
    setLoading(true);
    const params = {};
    if (filters.crop) params.crop = filters.crop;
    if (filters.district) params.district = filters.district;
    if (isExport) params.export_quality = true;
    const { data } = await client.get("/api/products", { params });
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    await loadProducts();
  }

  async function handleSmartMatch() {
    if (!filters.crop || !matchQty) return;
    setLoading(true);
    const { data } = await client.get("/api/products/match", {
      params: { crop: filters.crop, quantity: Number(matchQty), district: filters.district || undefined },
    });
    setProducts(data);
    setLoading(false);
    notify(`Found ${data.length} match${data.length === 1 ? "" : "es"} for ${matchQty}kg of ${filters.crop}.`);
  }

  async function placeOrder(productId, maxQty) {
    const qtyStr = window.prompt(`Quantity to order (max ${maxQty})?`, String(Math.min(maxQty, 100)));
    if (!qtyStr) return;
    const quantity = Number(qtyStr);
    if (!quantity || quantity <= 0) return;
    try {
      await client.post("/api/orders", { product_id: productId, quantity });
      notify("Order placed.");
      await Promise.all([loadProducts(), loadOrders()]);
    } catch (err) {
      notify(err.response?.data?.detail || "Could not place order.", "error");
    }
  }

  return (
    <DashboardLayout
      title={isExport ? "Export center dashboard" : "Wholesale center dashboard"}
      subtitle={isExport ? "Browse export-grade lots and manage export orders." : "Search listings by district and crop, then place orders."}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-lg border border-ink/10 bg-white/60 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-field">Search</h2>
          <form onSubmit={handleSearch} className="mt-4 space-y-3">
            <input placeholder="Crop (e.g. Carrot)" value={filters.crop}
              onChange={(e) => setFilters((f) => ({ ...f, crop: e.target.value }))}
              className="focus-ring w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
            <input placeholder="District" value={filters.district}
              onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value }))}
              className="focus-ring w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
            <motion.button whileTap={{ scale: 0.97 }} type="submit"
              className="focus-ring w-full rounded-md bg-field py-2 text-sm font-medium text-paper transition-colors hover:bg-field-light">
              Search
            </motion.button>
          </form>

          <div className="mt-6 border-t border-ink/10 pt-4">
            <h3 className="font-display text-sm font-semibold text-clay">Smart match</h3>
            <p className="mt-1 text-xs text-ink/50">
              e.g. "Need 800kg of carrots" — ranks listings by fit, distance, and grade.
            </p>
            <div className="mt-2 flex gap-2">
              <input type="number" placeholder="Quantity needed" value={matchQty}
                onChange={(e) => setMatchQty(e.target.value)}
                className="focus-ring w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm transition-shadow focus:shadow-md" />
              <motion.button whileTap={{ scale: 0.94 }} onClick={handleSmartMatch}
                className="focus-ring shrink-0 rounded-md border border-clay/40 px-3 py-2 text-sm text-clay hover:bg-clay/10">
                Match
              </motion.button>
            </div>
          </div>

          <div className="mt-6 border-t border-ink/10 pt-4">
            <h3 className="font-display text-sm font-semibold text-clay">Your orders</h3>
            {loading && orders.length === 0 ? (
              <div className="mt-2"><SkeletonRow /></div>
            ) : orders.length === 0 ? (
              <div className="mt-3 flex flex-col items-center gap-2 py-4 text-center">
                <TruckIllustration className="h-14 w-20 opacity-70" />
                <p className="text-sm text-ink/50">No orders yet.</p>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <AnimatePresence>
                  {orders.map((o) => (
                    <motion.div
                      key={o.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between rounded-md border border-ink/10 bg-white px-3 py-2 text-xs"
                    >
                      <span>#{o.id} · {o.quantity} units</span>
                      <StatusPill status={o.status} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>

        <section>
          <h2 className="font-display text-lg font-semibold text-field">
            {isExport ? "Export-quality listings" : "Available listings"}
          </h2>
          {loading ? (
            <div className="mt-3"><SkeletonGrid count={4} /></div>
          ) : products.length === 0 ? (
            <div className="mt-3 flex flex-col items-center gap-2 rounded-md border border-dashed border-ink/15 py-10 text-center">
              <EmptyBasketIllustration className="h-16 w-16 opacity-70" />
              <p className="text-sm text-ink/50">No listings match your search.</p>
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <AnimatePresence>
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ y: -3 }}
                    className="rounded-lg border border-ink/10 bg-white/60 p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold text-ink">{p.crop}</span>
                      <span className="rounded-full bg-harvest-light/40 px-2 py-0.5 text-xs text-clay">Grade {p.grade}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{p.variety || "—"} · {p.district}</p>
                    <p className="mt-2 text-sm text-ink/80">
                      {p.quantity} {p.unit} available · Rs {p.price_per_unit}/{p.unit}
                    </p>
                    <p className="mt-1 text-xs text-ink/40">
                      {p.organic ? "Organic · " : ""}Harvested {p.harvest_date}
                    </p>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => placeOrder(p.id, p.quantity)}
                      className="focus-ring mt-3 w-full rounded-md bg-field py-1.5 text-sm font-medium text-paper transition-colors hover:bg-field-light">
                      Place order
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
