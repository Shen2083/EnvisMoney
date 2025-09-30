export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Stylized "E" that forms a protective shelter/house shape */}
        <path
          d="M6 30V6H30M6 18H26M6 30H26"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
        
        {/* AI intelligence indicator - subtle dot accent */}
        <circle
          cx="30"
          cy="6"
          r="2.5"
          fill="currentColor"
          className="text-primary opacity-70"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight" style={{ 
        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Envis
      </span>
    </div>
  );
}
