import { forwardRef, useState } from 'react';

import { FaMagnifyingGlass } from 'react-icons/fa6';

import TextInput, { TextInputProps } from '@/components/common/input/TextInput';

interface SearchInputProps
  extends Pick<TextInputProps, 'name' | 'placeholder' | 'onChange' | 'value'> {
  width: string;
  height: string;
  onEnter?: () => void;
}

/**
 * @param name - input의 이름
 * @param placeholder - 플레이스 홀더
 * @param onChange - 입력값 변경시 호출되는 함수
 * @param onEnter - 엔터키 입력(검색)시 호출되는 함수 (optional)
 */

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      name,
      placeholder,
      width = 'w-[422px]',
      height = 'h-[40px]',
      onChange,
      onEnter,
      value,
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
        className={`flex items-center justify-between rounded-full bg-white hover:text-black hover:outline hover:outline-1 hover:outline-gray-300 ${width} ${height} px-4 ${!isFocus && 'text-gray-400'}`}
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
      </label>
    );
  },
);

export default SearchInput;
