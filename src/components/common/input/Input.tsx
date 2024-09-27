import { ChangeEvent, forwardRef } from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password';
  name: string;
  width?: string;
  height?: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleFocus?: (isFocus: boolean) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = 'text',
    name,
    value,
    placeholder,
    width = 'w-[422px]',
    height = 'h-[40px]',
    onChange,
    toggleFocus,
    onEnter,
    className,
  }: InputProps,
  ref,
) {
  return (
    <input
      type={type}
      id={name}
      ref={ref}
      value={value}
      name={name}
      className={`${width} ${height} mr-2 h-full w-full rounded-xl border p-2 outline-none hover:placeholder-black ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={() => toggleFocus && toggleFocus(true)}
      onBlur={() => toggleFocus && toggleFocus(false)}
      onKeyDown={onEnter}
    />
  );
});

export default Input;
