export default function RacketAccent({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
      </defs>
      {/* Head oval */}
      <ellipse cx="50" cy="46" rx="30" ry="38" stroke="url(#gm-grad)" strokeWidth="3.5" />
      {/* String verticals */}
      {[32, 40, 50, 60, 68].map((x) => (
        <line key={`v${x}`} x1={x} y1={46 - 36} x2={x} y2={46 + 36} stroke="#3a3a3a" strokeWidth="0.8" opacity="0.7" />
      ))}
      {/* String horizontals */}
      {[18, 28, 38, 46, 54, 62, 72].map((y) => (
        <line key={`h${y}`} x1={22} y1={y} x2={78} y2={y} stroke="#3a3a3a" strokeWidth="0.8" opacity="0.7" />
      ))}
      {/* Shaft */}
      <rect x="46" y="82" width="8" height="30" rx="2" fill="#1a1a1a" />
      {/* Grip wrap lines */}
      {[88, 94, 100, 106].map((y) => (
        <line key={`g${y}`} x1="44" y1={y} x2="56" y2={y} stroke="#333" strokeWidth="1" />
      ))}
    </svg>
  );
}
