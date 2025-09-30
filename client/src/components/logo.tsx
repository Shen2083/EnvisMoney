export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Outer circle representing family unity */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          opacity="0.2"
        />
        
        {/* Upward arrow/growth path */}
        <path
          d="M12 28 L20 12 L28 20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
        
        {/* AI/Intelligence dot at top */}
        <circle
          cx="20"
          cy="12"
          r="3"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Supporting dots representing family members */}
        <circle
          cx="12"
          cy="28"
          r="2"
          fill="currentColor"
          className="text-primary"
          opacity="0.6"
        />
        <circle
          cx="28"
          cy="20"
          r="2"
          fill="currentColor"
          className="text-primary"
          opacity="0.6"
        />
      </svg>
      <span className="text-2xl font-bold text-primary">Envis</span>
    </div>
  );
}
