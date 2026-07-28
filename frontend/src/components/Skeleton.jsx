export function SkeletonLine({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-ink/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/60 p-4">
      <div className="flex items-center justify-between">
        <SkeletonLine className="h-5 w-24" />
        <SkeletonLine className="h-4 w-14 rounded-full" />
      </div>
      <SkeletonLine className="mt-3 h-3 w-32" />
      <SkeletonLine className="mt-2 h-3 w-40" />
      <SkeletonLine className="mt-4 h-8 w-full rounded-md" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between rounded-md border border-ink/10 bg-white/60 px-4 py-3">
      <SkeletonLine className="h-4 w-40" />
      <SkeletonLine className="h-4 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonList({ count = 3, Row = SkeletonRow }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Row key={i} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
