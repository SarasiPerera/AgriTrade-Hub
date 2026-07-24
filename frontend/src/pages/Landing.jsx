import { Link } from "react-router-dom";

const tickerCrops = [
  { crop: "Carrot", district: "Nuwara Eliya", price: "Rs 210/kg", trend: "up" },
  { crop: "Tomato", district: "Matale", price: "Rs 185/kg", trend: "down" },
  { crop: "Beans", district: "Badulla", price: "Rs 260/kg", trend: "up" },
  { crop: "Cabbage", district: "Nuwara Eliya", price: "Rs 95/kg", trend: "down" },
  { crop: "Brinjal", district: "Anuradhapura", price: "Rs 140/kg", trend: "up" },
  { crop: "Okra", district: "Jaffna", price: "Rs 220/kg", trend: "up" },
];

function TickerItem({ crop, district, price, trend }) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap border-r border-paper/10 px-6 py-3 font-mono text-sm text-paper">
      <span className={trend === "up" ? "text-harvest" : "text-chili"}>
        {trend === "up" ? "▲" : "▼"}
      </span>
      <span className="font-medium">{crop}</span>
      <span className="text-paper/50">{district}</span>
      <span>{price}</span>
    </div>
  );
}

function RoleCard({ title, points, to }) {
  return (
    <Link
      to={to}
      className="focus-ring group flex flex-col rounded-lg border border-ink/10 bg-white/60 p-6 transition hover:border-field hover:bg-white"
    >
      <h3 className="font-display text-lg font-semibold text-field">{title}</h3>
      <ul className="mt-3 space-y-1 text-sm text-ink/70">
        {points.map((p) => (
          <li key={p}>· {p}</li>
        ))}
      </ul>
      <span className="mt-4 font-mono text-xs uppercase tracking-wide text-clay group-hover:text-field">
        Get started →
      </span>
    </Link>
  );
}

export default function Landing() {
  const doubled = [...tickerCrops, ...tickerCrops];

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero with exchange-board ticker */}
      <section className="bg-field">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-10">
          <p className="font-mono text-xs uppercase tracking-widest text-harvest">
            A digital exchange for Sri Lankan agriculture
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl font-semibold leading-tight text-paper">
            Every harvest, priced and matched in real time.
          </h1>
          <p className="mt-4 max-w-xl text-paper/70">
            AgriTrade Hub connects farmers directly with wholesale buyers and export
            centers — replacing guesswork and middlemen with transparent listings,
            smart matching, and district-level price data.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/register"
              className="focus-ring rounded-md bg-harvest px-5 py-2.5 font-medium text-ink transition hover:bg-harvest-light"
            >
              Create an account
            </Link>
            <Link
              to="/login"
              className="focus-ring rounded-md border border-paper/30 px-5 py-2.5 font-medium text-paper transition hover:bg-paper/10"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Ticker strip */}
        <div className="overflow-hidden border-t border-paper/10 bg-field-dark">
          <div className="ticker-track">
            {doubled.map((item, i) => (
              <TickerItem key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Role selection */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink">
          One platform, four roles
        </h2>
        <p className="mt-2 max-w-2xl text-ink/60">
          Each portal is built around what that role actually needs to do — list a
          harvest, fulfil an order, or keep the marketplace trustworthy.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <RoleCard
            title="Farmer"
            points={["List your harvest", "Set your own price", "Track incoming orders"]}
            to="/register"
          />
          <RoleCard
            title="Wholesale Center"
            points={["Search by district & crop", "Request quantities", "Track deliveries"]}
            to="/register"
          />
          <RoleCard
            title="Export Center"
            points={["Browse export-grade lots", "Manage export orders", "Verified suppliers only"]}
            to="/register"
          />
          <RoleCard
            title="Administrator"
            points={["Verify farmers & buyers", "Approve listings", "Monitor marketplace health"]}
            to="/login"
          />
        </div>
      </section>

      <footer className="border-t border-ink/10 py-8 text-center font-mono text-xs text-ink/40">
        AgriTrade Hub — built for Sri Lankan agriculture
      </footer>
    </div>
  );
}
