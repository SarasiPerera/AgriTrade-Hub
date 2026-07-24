import Navbar from "./Navbar";

export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {title && (
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
