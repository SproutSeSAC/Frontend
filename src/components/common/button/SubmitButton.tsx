interface SubmitButtonProps {
  name: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export default function SubmitButton({
  name,
  onClick,
  className = '',
  type = 'button',
}: SubmitButtonProps) {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={`rounded-lg bg-oliveGreen1 px-4 py-2 tracking-tight text-white ${className}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
