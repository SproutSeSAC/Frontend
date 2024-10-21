interface LabelProps {
  htmlFor: string;
  className?: string;
}

export default function Label({ htmlFor, className = '' }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
      {htmlFor}
    </label>
  );
}
