import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HarvestIllustration } from "../components/illustrations";

const tickerCrops = [
  { crop: "Carrot", district: "Nuwara Eliya", price: "Rs 210/kg", trend: "up" },
  { crop: "Tomato", district: "Matale", price: "Rs 185/kg", trend: "down" },
  { crop: "Beans", district: "Badulla", price: "Rs 260/kg", trend: "up" },
  { crop: "Cabbage", district: "Nuwara Eliya", price: "Rs 95/kg", trend: "down" },
  { crop: "Brinjal", district: "Anuradhapura", price: "Rs 140/kg", trend: "up" },
  { crop: "Okra", district: "Jaffna", price: "Rs 220/kg", trend: "up" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

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

function RoleCard({ title, points, to, index }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link
        to={to}
        className="focus-ring group flex h-full flex-col rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm transition-colors hover:border-field hover:bg-white hover:shadow-md"
      >
        <h3 className="font-display text-lg font-semibold text-field">{title}</h3>
        <ul className="mt-3 space-y-1 text-sm text-ink/70">
          {points.map((p) => (
            <li key={p}>· {p}</li>
          ))}
        </ul>
        <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-clay transition-transform group-hover:translate-x-1 group-hover:text-field">
          Get started →
        </span>
      </Link>
    </motion.div>
  );
}

export default function Landing() {
  const doubled = [...tickerCrops, ...tickerCrops];

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero with exchange-board ticker */}
      <section className="bg-field">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-16 pt-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <motion.p
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="font-mono text-xs uppercase tracking-widest text-harvest"
            >
              A digital exchange for Sri Lankan agriculture
            </motion.p>
            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="mt-3 max-w-2xl font-display text-5xl font-semibold leading-tight text-paper"
            >
              Every harvest, priced and matched in real time.
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="mt-4 max-w-xl text-paper/70"
            >
              AgriTrade Hub connects farmers directly with wholesale buyers and export
              centers — replacing guesswork and middlemen with transparent listings,
              smart matching, and district-level price data.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="mt-8 flex gap-3"
            >
              <Link
                to="/register"
                className="focus-ring rounded-md bg-harvest px-5 py-2.5 font-medium text-ink transition-all hover:bg-harvest-light hover:shadow-lg active:scale-95"
              >
                Create an account
              </Link>
              <Link
                to="/login"
                className="focus-ring rounded-md border border-paper/30 px-5 py-2.5 font-medium text-paper transition-all hover:bg-paper/10 active:scale-95"
              >
                Log in
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <HarvestIllustration className="w-full max-w-md" />
          </motion.div>
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
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl font-semibold text-ink"
        >
          One platform, four roles
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-2 max-w-2xl text-ink/60"
        >
          Each portal is built around what that role actually needs to do — list a
          harvest, fulfil an order, or keep the marketplace trustworthy.
        </motion.p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <RoleCard
            index={0}
            title="Farmer"
            points={["List your harvest", "Set your own price", "Track incoming orders"]}
            to="/register"
          />
          <RoleCard
            index={1}
            title="Wholesale Center"
            points={["Search by district & crop", "Request quantities", "Track deliveries"]}
            to="/register"
          />
          <RoleCard
            index={2}
            title="Export Center"
            points={["Browse export-grade lots", "Manage export orders", "Verified suppliers only"]}
            to="/register"
          />
          <RoleCard
            index={3}
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
