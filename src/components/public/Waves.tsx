/** Motivo de olas inspirado en el pie del menú físico */
export default function Waves({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,20 C60,5 120,35 180,20 C240,5 300,35 360,20 C420,5 480,35 540,20 C600,5 660,35 720,20 C780,5 840,35 900,20 C960,5 1020,35 1080,20 C1140,5 1200,35 1200,20 L1200,40 L0,40 Z"
        fill="currentColor"
      />
      <path
        d="M0,30 C80,18 160,42 240,30 C320,18 400,42 480,30 C560,18 640,42 720,30 C800,18 880,42 960,30 C1040,18 1120,42 1200,30 L1200,40 L0,40 Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
