interface SubmitButtonProps {
  name: string;
  onClick: () => void;
  className?: string;
}

export default function SubmitButton({
  name,
  onClick,
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-xl bg-oliveGreen1 px-4 py-2 tracking-tight text-white ${className}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
