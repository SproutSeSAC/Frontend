import { ReactNode } from 'react';

export type ButtonColor = 'gray' | 'mainGreen' | 'lightGreen';

interface SquareButtonProps {
  name: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  color?: ButtonColor;
  children?: ReactNode;
  disabled?: boolean;
}

export default function SquareButton({
  name,
  onClick,
  className = '',
  type = 'button',
  color = 'mainGreen',
  children,
  disabled = false,
}: SquareButtonProps) {
  const styleByColor = {
    mainGreen: 'bg-mainGreen text-white',
    gray: 'bg-mainGray text-black',
    lightGreen: 'bg-lightGreen-active text-text',
  };

  const colorStyle = styleByColor[color];

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={`rounded-lg ${colorStyle} px-4 py-2 tracking-tight ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {name}
    </button>
  );
}
