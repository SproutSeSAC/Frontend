import { ChangeEvent } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password';
  name: string;
  width?: string;
  height?: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleFocus?: (isFocus: boolean) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Input({
  type = 'text',
  name,
  placeholder,
  width = 'w-[422px]',
  height = 'h-[40px]',
  onChange,
  toggleFocus,
  onEnter,
  className,
}: InputProps) {
  return (
    <input
      type={type}
      id={name}
      name={name}
      className={`${width} ${height} mr-2 h-full w-full rounded-xl border p-2 outline-none hover:placeholder-black ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={() => toggleFocus && toggleFocus(true)}
      onBlur={() => toggleFocus && toggleFocus(false)}
      onKeyDown={onEnter}
    />
  );
}
