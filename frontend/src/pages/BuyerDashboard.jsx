import { useEffect, useState } from "react";
import client from "../api/client";
import DashboardLayout from "../components/DashboardLayout";

function StatusPill({ status }) {
  const styles = {
    pending: "bg-harvest-light/40 text-clay",
    accepted: "bg-field-light/20 text-field",
    rejected: "bg-chili/10 text-chili",
    delivered: "bg-field-light/20 text-field",
    cancelled: "bg-ink/10 text-ink/50",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-ink/10"}`}>
      {status}
    </span>
  );
}

export default function BuyerDashboard({ variant }) {
  const isExport = variant === "export";
  const [filters, setFilters] = useState({ crop: "", district: "" });
  const [matchQty, setMatchQty] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
  }

  async function placeOrder(productId, maxQty) {
    const qtyStr = window.prompt(`Quantity to order (max ${maxQty})?`, String(Math.min(maxQty, 100)));
    if (!qtyStr) return;
    const quantity = Number(qtyStr);
    if (!quantity || quantity <= 0) return;
    try {
      await client.post("/api/orders", { product_id: productId, quantity });
      setMessage("Order placed.");
      await Promise.all([loadProducts(), loadOrders()]);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not place order.");
    }
  }

  return (
    <DashboardLayout
      title={isExport ? "Export center dashboard" : "Wholesale center dashboard"}
      subtitle={isExport ? "Browse export-grade lots and manage export orders." : "Search listings by district and crop, then place orders."}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <section className="rounded-lg border border-ink/10 bg-white/60 p-6">
          <h2 className="font-display text-lg font-semibold text-field">Search</h2>
          <form onSubmit={handleSearch} className="mt-4 space-y-3">
            <input placeholder="Crop (e.g. Carrot)" value={filters.crop}
              onChange={(e) => setFilters((f) => ({ ...f, crop: e.target.value }))}
              className="focus-ring w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm" />
            <input placeholder="District" value={filters.district}
              onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value }))}
              className="focus-ring w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm" />
            <button type="submit"
              className="focus-ring w-full rounded-md bg-field py-2 text-sm font-medium text-paper hover:bg-field-light">
              Search
            </button>
          </form>

          <div className="mt-6 border-t border-ink/10 pt-4">
            <h3 className="font-display text-sm font-semibold text-clay">Smart match</h3>
            <p className="mt-1 text-xs text-ink/50">
              e.g. "Need 800kg of carrots" — ranks listings by fit, distance, and grade.
            </p>
            <div className="mt-2 flex gap-2">
              <input type="number" placeholder="Quantity needed" value={matchQty}
                onChange={(e) => setMatchQty(e.target.value)}
                className="focus-ring w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm" />
              <button onClick={handleSmartMatch}
                className="focus-ring shrink-0 rounded-md border border-clay/40 px-3 py-2 text-sm text-clay hover:bg-clay/10">
                Match
              </button>
            </div>
          </div>

          {message && <p className="mt-4 text-sm text-field">{message}</p>}

          <div className="mt-6 border-t border-ink/10 pt-4">
            <h3 className="font-display text-sm font-semibold text-clay">Your orders</h3>
            {orders.length === 0 ? (
              <p className="mt-2 text-sm text-ink/50">No orders yet.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-md border border-ink/10 bg-white px-3 py-2 text-xs">
                    <span>#{o.id} · {o.quantity} units</span>
                    <StatusPill status={o.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-field">
            {isExport ? "Export-quality listings" : "Available listings"}
          </h2>
          {loading ? (
            <p className="mt-3 text-sm text-ink/50">Loading…</p>
          ) : products.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">No listings match your search.</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {products.map((p) => (
                <div key={p.id} className="rounded-lg border border-ink/10 bg-white/60 p-4">
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
                  <button onClick={() => placeOrder(p.id, p.quantity)}
                    className="focus-ring mt-3 w-full rounded-md bg-field py-1.5 text-sm font-medium text-paper hover:bg-field-light">
                    Place order
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
