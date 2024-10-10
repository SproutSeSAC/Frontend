import { ReactNode } from 'react';

interface LabeledSectionProps {
  label: string | ReactNode;
  children: ReactNode;
  className?: string;
}

export default function LabeledSection({
  label,
  children,
  className,
}: LabeledSectionProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="text-lg font-medium">{label}</div>
      {children}
    </div>
  );
}
