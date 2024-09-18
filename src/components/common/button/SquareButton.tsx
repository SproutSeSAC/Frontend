interface SquareButtonProps {
  type?: 'button' | 'submit';
  name: string;
  onClick?: () => void;
  className?: string;
}

export default function SquareButton({
  type = 'button',
  name,
  onClick,
  className = '',
}: SquareButtonProps) {
  const buttonStyle =
    'rounded-lg bg-oliveGreen1 px-4 py-2 tracking-tight text-white';

  return (
    <>
      {type === 'button' && (
        <button
          type="button"
          className={`${buttonStyle} ${className}`}
          onClick={onClick}
        >
          {name}
        </button>
      )}

      {type === 'submit' && (
        <button type="submit" className={`${buttonStyle} ${className}`}>
          {name}
        </button>
      )}
    </>
  );
}
