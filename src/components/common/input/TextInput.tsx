import { ChangeEvent, ForwardedRef, forwardRef } from 'react';

interface FormStateProps {
  errorMsg?: string;
}

export interface TextInputProps extends FormStateProps {
  name: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleFocus?: (isFocus: boolean) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function Input(
  {
    name,
    value,
    placeholder,
    onChange,
    toggleFocus,
    onEnter,
    className,
    errorMsg,
  }: TextInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <>
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
        className={`mr-2 h-[45px] w-full rounded-xl border p-2 outline-none hover:placeholder-black ${className}`}
      />
      {errorMsg && (
        <span className="ml-4 mt-1.5 inline-block text-sm text-[#FF3939]">
          {errorMsg}
        </span>
      )}
    </>
  );
});

export default TextInput;
