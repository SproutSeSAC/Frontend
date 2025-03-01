import { ForwardedRef, forwardRef } from 'react';

import ErrorMsg from '@/components/common/input/ErrorMsg';
import { InputProps } from '@/components/common/input/TextInput';

// type NumberValue = {  };

interface NumberInputProps extends Omit<InputProps, 'value'> {
  value?: number; // 새롭게 정의한 value (number)
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function Input(
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
    }: NumberInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) {
    return (
      <>
        <input
          type="number"
          ref={ref}
          id={name}
          min={1}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => toggleFocus && toggleFocus(true)}
          onBlur={() => toggleFocus && toggleFocus(false)}
          onKeyDown={onEnter}
          disabled={disabled}
          className={`h-[45px] w-full rounded-l-xl border p-2 outline-none disabled:rounded-l-none disabled:bg-[#eee] disabled:text-[#eee] ${className}`}
        />

        {errorMsg && <ErrorMsg msg={errorMsg} className="pl-2" />}
      </>
    );
  },
);

export default NumberInput;
