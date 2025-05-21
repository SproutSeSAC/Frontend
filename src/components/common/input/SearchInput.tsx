import { forwardRef, useState } from 'react';

import { BsX } from 'react-icons/bs';
import { FaMagnifyingGlass } from 'react-icons/fa6';

import TextInput, { InputProps } from '@/components/common/input/TextInput';

interface SearchInputProps
  extends Pick<InputProps, 'name' | 'placeholder' | 'onChange' | 'value'> {
  onEnter?: () => void;
  resetChange?: () => void;
  inputStyle?: 'rounded' | 'square';
  className?: string;
}

/**
 * @param name - input의 이름
 * @param placeholder - 플레이스 홀더
 * @param onChange - 입력값 변경시 호출되는 함수
 * @param onEnter - 엔터키 입력(검색)시 호출되는 함수 (optional)
 * @param className - 클래스네임 커스텀
 */

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      name,
      value,
      placeholder,
      inputStyle = 'rounded',
      onChange,
      onEnter,
      resetChange,
      className,
    }: SearchInputProps,
    ref,
  ) {
    const [isFocus, setIsFocus] = useState(false);

    const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnter) {
        onEnter();
      }
    };

    const onToggleFocus = (focus: boolean) => setIsFocus(focus);

    return (
      <label
        className={`flex h-12 w-[422px] items-center justify-between bg-white hover:text-black hover:outline hover:outline-1 hover:outline-gray-300 ${inputStyle === 'rounded' ? 'rounded-full' : 'rounded-xl'} px-4 ${!isFocus && 'text-gray-400'} ${className}`}
        htmlFor={name}
      >
        {!isFocus && <FaMagnifyingGlass />}
        <TextInput
          ref={ref}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          toggleFocus={onToggleFocus}
          onEnter={handlePressEnter}
          className="ml-2 border-none px-0"
        />
        {value && value !== '' && (
          <button type="button" onClick={resetChange}>
            <BsX className="size-7 text-darkGray-active" />
          </button>
        )}
      </label>
    );
  },
);

export default SearchInput;
