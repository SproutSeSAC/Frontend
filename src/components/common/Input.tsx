import { ChangeEvent, useState } from 'react';

import { FaMagnifyingGlass } from 'react-icons/fa6';

const textSizes = {
  small: 'text-xs',
  medium: '',
};

const marginSizes = {
  small: 'mr-2',
  medium: 'mr-6',
};

const paddingSizes = {
  small: 'px-[10px]',
  medium: 'px-4',
};

interface InputProps {
  name: string;
  size?: 'small' | 'medium';
  width: string;
  height: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
}

/**
 * @param name - input의 이름
 * @param size - input의 사이즈 (optional)
 * @param width - 너비 (tailwind class)
 * @param height - 높이 (tailwind class)
 * @param placeholder - 플레이스 홀더
 * @param onChange - 입력값 변경시 호출되는 함수
 * @param onEnter - 엔터키 입력(검색)시 호출되는 함수 (optional)
 */
export default function Input({
  name,
  size = 'medium',
  width,
  height,
  placeholder,
  onChange,
  onEnter,
}: InputProps) {
  const [isFocus, setIsFocus] = useState(false);

  const textSize = textSizes[size];
  const placeholderSize = `placeholder:${textSizes[size]}`;
  const marginSize = marginSizes[size];
  const paddingSize = paddingSizes[size];

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <label
      className={`flex items-center justify-between rounded-full bg-white hover:text-black hover:outline hover:outline-1 hover:outline-gray-300 ${width} ${height} ${textSize} ${paddingSize} ${!isFocus && 'text-gray-400'}`}
      htmlFor={name}
    >
      {!isFocus && <FaMagnifyingGlass className={marginSize} />}
      <input
        id={name}
        name={name}
        type="text"
        className={`h-full w-full outline-none hover:placeholder-black ${placeholderSize}`}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onKeyDown={e => handlePressEnter(e)}
      />
    </label>
  );
}
