import { ChangeEvent, ForwardedRef, forwardRef } from 'react';

import ErrorMsg from '@/components/common/input/ErrorMsg';

export interface FormStateProps {
  errorMsg?: string;
}

export interface InputProps extends FormStateProps {
  name: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleFocus?: (isFocus: boolean) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
}

const TextInput = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    name,
    value,
    placeholder,
    onChange,
    toggleFocus,
    onEnter,
    className,
    errorMsg,
    disabled,
    minLength,
    maxLength,
    ...props
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        ref={ref}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => toggleFocus && toggleFocus(true)}
        onBlur={() => toggleFocus && toggleFocus(false)}
        onKeyDown={onEnter}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        className={`mr-2 h-[45px] w-full rounded-xl border p-2 outline-none hover:placeholder-black ${errorMsg ? 'border-red-600' : 'border-mainGray-active'} ${className}`}
        {...props}
      />

      {errorMsg && <ErrorMsg msg={errorMsg} className="pl-2" />}
    </div>
  );
});

export default TextInput;
