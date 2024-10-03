interface SquareButtonProps {
  name: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  type?: 'button' | 'submit';
  color?: 'gray' | 'oliveGreen';
}

export default function SquareButton({
  name,
  onClick,
  className = '',
  type = 'button',
  color = 'oliveGreen',
}: SquareButtonProps) {
  const styleByColor = {
    oliveGreen: 'bg-oliveGreen1 text-white ',
    gray: 'bg-gray2 text-text',
  };

  const colorStyle = styleByColor[color];

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={`rounded-lg ${colorStyle} px-4 py-2 tracking-tight text-white ${className}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
