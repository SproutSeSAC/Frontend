interface LabelProps {
  htmlFor: string;
  className?: string;
}

export default function Label({ htmlFor, className = '' }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1.5 text-sm font-medium ${className}`}
    >
      {htmlFor}
    </label>
  );
}
