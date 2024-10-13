import { ReactNode } from 'react';

interface SquareButtonProps {
  name: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  color?: 'gray' | 'oliveGreen' | 'vividGreen';
  children?: ReactNode;
}

export default function SquareButton({
  name,
  onClick,
  className = '',
  type = 'button',
  color = 'oliveGreen',
  children,
}: SquareButtonProps) {
  const styleByColor = {
    oliveGreen: 'bg-oliveGreen1 text-white',
    gray: 'bg-gray2 text-text',
    vividGreen: 'bg-vividGreen1 text-white',
  };

  const colorStyle = styleByColor[color];

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={`rounded-lg ${colorStyle} px-4 py-2 tracking-tight text-white ${className}`}
      onClick={onClick}
    >
      {children}
      {name}
    </button>
  );
}
