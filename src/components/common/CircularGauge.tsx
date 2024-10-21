import { useEffect, useState } from 'react';

interface CircularGaugeProps {
  gauge: number;
  size?: number;
  trackColor?: string;
  gaugeColor?: string;
}

export default function CircularGauge({
  gauge,
  size = 180,
  trackColor = '#d9d9d9',
  gaugeColor = '#6fa235',
}: CircularGaugeProps) {
  const [progress, setProgress] = useState(0);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const dashOffset = circumference - (circumference * progress) / 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(gauge);
    }, 200);

    return () => clearTimeout(timer);
  }, [gauge]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="relative"
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        strokeWidth="11"
        fill="none"
        stroke={trackColor}
        className="stroke-gray5"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        stroke={gaugeColor}
        className="transition-all duration-[2s] ease-out"
        transform="rotate(90 50 50)"
      />
    </svg>
  );
}
