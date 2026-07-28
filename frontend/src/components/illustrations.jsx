// Original illustrations — no external assets, no stock imagery.
// Colors reference the site's CSS custom properties directly.

export function HarvestIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of harvest crates with vegetables"
    >
      {/* ground shadow */}
      <ellipse cx="240" cy="330" rx="190" ry="14" fill="#24291F" opacity="0.06" />

      {/* back crate */}
      <g transform="translate(60,160)">
        <rect x="0" y="30" width="130" height="90" rx="6" fill="#8C5A3B" opacity="0.85" />
        <rect x="0" y="30" width="130" height="14" rx="4" fill="#8C5A3B" />
        <line x1="10" y1="30" x2="10" y2="120" stroke="#F7F2E7" strokeWidth="3" opacity="0.4" />
        <line x1="120" y1="30" x2="120" y2="120" stroke="#F7F2E7" strokeWidth="3" opacity="0.4" />
        {/* leafy tops */}
        <circle cx="30" cy="20" r="16" fill="#2E6B57" />
        <circle cx="55" cy="10" r="18" fill="#1F4A3D" />
        <circle cx="85" cy="16" r="15" fill="#2E6B57" />
        <circle cx="105" cy="8" r="12" fill="#1F4A3D" />
      </g>

      {/* front crate with carrots */}
      <g transform="translate(230,140)">
        <rect x="0" y="40" width="170" height="110" rx="8" fill="#E0A72E" />
        <rect x="0" y="40" width="170" height="16" rx="5" fill="#F0C563" />
        <line x1="14" y1="40" x2="14" y2="150" stroke="#8C5A3B" strokeWidth="3" opacity="0.35" />
        <line x1="156" y1="40" x2="156" y2="150" stroke="#8C5A3B" strokeWidth="3" opacity="0.35" />
        <line x1="0" y1="95" x2="170" y2="95" stroke="#8C5A3B" strokeWidth="3" opacity="0.25" />

        {/* carrots poking out */}
        <g transform="translate(20,-28)">
          <path d="M0 40 L10 -6 L20 40 Z" fill="#C1442D" />
          <path d="M6 -6 q4 -10 -2 -14" stroke="#1F4A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M12 -6 q6 -8 0 -16" stroke="#2E6B57" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(60,-20)">
          <path d="M0 32 L9 -4 L18 32 Z" fill="#C1442D" opacity="0.9" />
          <path d="M5 -4 q3 -8 -2 -12" stroke="#1F4A3D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(100,-30)">
          <circle cx="14" cy="4" r="16" fill="#2E6B57" />
          <circle cx="0" cy="-2" r="12" fill="#1F4A3D" />
        </g>
        <g transform="translate(128,-22)">
          <path d="M0 34 L9 -4 L18 34 Z" fill="#C1442D" />
          <path d="M5 -4 q4 -9 -1 -13" stroke="#2E6B57" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* small basket */}
      <g transform="translate(340,220)">
        <path d="M0 20 L60 20 L52 55 L8 55 Z" fill="#8C5A3B" opacity="0.8" />
        <path d="M8 20 Q30 -10 52 20" stroke="#8C5A3B" strokeWidth="4" fill="none" />
        <circle cx="20" cy="30" r="7" fill="#E0A72E" />
        <circle cx="34" cy="26" r="8" fill="#C1442D" />
        <circle cx="46" cy="32" r="6" fill="#2E6B57" />
      </g>
    </svg>
  );
}

export function EmptyBasketIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of an empty basket"
    >
      <ellipse cx="100" cy="140" rx="70" ry="8" fill="#24291F" opacity="0.05" />
      <path d="M35 70 L165 70 L150 130 L50 130 Z" fill="none" stroke="#8C5A3B" strokeWidth="4" opacity="0.5" />
      <path d="M35 70 Q100 40 165 70" stroke="#8C5A3B" strokeWidth="4" fill="none" opacity="0.5" />
      <line x1="60" y1="70" x2="55" y2="130" stroke="#8C5A3B" strokeWidth="3" opacity="0.3" />
      <line x1="100" y1="70" x2="100" y2="130" stroke="#8C5A3B" strokeWidth="3" opacity="0.3" />
      <line x1="140" y1="70" x2="145" y2="130" stroke="#8C5A3B" strokeWidth="3" opacity="0.3" />
      <circle cx="100" cy="45" r="3" fill="#E0A72E" opacity="0.6" />
      <circle cx="80" cy="35" r="2.5" fill="#2E6B57" opacity="0.6" />
      <circle cx="120" cy="35" r="2.5" fill="#2E6B57" opacity="0.6" />
    </svg>
  );
}

export function TruckIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a delivery truck"
    >
      <ellipse cx="100" cy="105" rx="80" ry="6" fill="#24291F" opacity="0.06" />
      <rect x="20" y="45" width="80" height="45" rx="4" fill="#1F4A3D" />
      <rect x="100" y="60" width="45" height="30" rx="4" fill="#2E6B57" />
      <path d="M100 60 L120 60 L145 78 L145 90 L100 90 Z" fill="#2E6B57" />
      <rect x="112" y="66" width="16" height="14" rx="2" fill="#F7F2E7" opacity="0.7" />
      <circle cx="55" cy="92" r="12" fill="#24291F" opacity="0.75" />
      <circle cx="55" cy="92" r="5" fill="#F7F2E7" opacity="0.9" />
      <circle cx="125" cy="92" r="12" fill="#24291F" opacity="0.75" />
      <circle cx="125" cy="92" r="5" fill="#F7F2E7" opacity="0.9" />
      <rect x="30" y="55" width="60" height="8" rx="2" fill="#E0A72E" opacity="0.8" />
    </svg>
  );
}
