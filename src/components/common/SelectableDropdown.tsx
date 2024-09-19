import { useCallback, useEffect, useRef, useState } from 'react';

import OutsideClickContainer from './OutsideClickContainer';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface SingleOption<T extends string> {
  key: T;
  value: string;
}

interface SelectableDropdownProps<T extends string> {
  label: string;
  options: { key: T; value: string }[];
  onChangeValue: (value: SingleOption<T>[]) => void;
  width?: string;
  className?: string;
  isCheckBox?: boolean;
}

function SelectableDropdown<T extends string>({
  label,
  options,
  width,
  className,
  isCheckBox,
  onChangeValue,
}: SelectableDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [visibilityAnimation, setVisibilityAnimation] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<
    { key: T; value: string }[]
  >([]);
  const [selectedLabel, setSelectedLabel] = useState<T | string>('');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCheckboxChange = useCallback(
    (option: { key: T; value: string }) => {
      setSelectedOptions(prevSelectedOptions => {
        const updatedOptions = prevSelectedOptions.includes(option)
          ? prevSelectedOptions.filter(item => item !== option)
          : [...prevSelectedOptions, option];

        onChangeValue(updatedOptions);
        return updatedOptions;
      });
    },
    [onChangeValue],
  );

  const handleChangeValue = useCallback(
    (option: { key: T; value: string }) => {
      // TODO : type error로 인한 [] 수정필요함
      onChangeValue([option]);
      setOpen(false);
      setSelectedLabel(option.value);
    },
    [onChangeValue],
  );

  useEffect(() => {
    if (open) {
      setVisibilityAnimation(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        setVisibilityAnimation(false);
      }, 300);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open]);

  return (
    <OutsideClickContainer onClose={setOpen} width={width}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`relative flex w-full items-center gap-5 text-start ${className}`}
      >
        <span className="w-full">
          {selectedOptions.length > 1 &&
            `${selectedOptions[0].value} 외 ${selectedOptions.length - 1}개`}
          {selectedOptions.length === 1 && selectedOptions[0].value}
          {selectedOptions.length === 0 && (selectedLabel || label)}
        </span>
        {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>
      <article
        className={`relative left-0 ${open ? 'block' : 'none'} z-20 w-full`}
      >
        {visibilityAnimation && (
          <ul
            className={`absolute mt-1 w-full list-none ${open ? 'animate-slide-fade-in-dropdown overflow-auto' : 'animate-slide-fade-out-dropdown overflow-hidden'} flex max-h-72 flex-col gap-2 rounded-lg bg-white px-1.5 py-2.5 shadow-card`}
          >
            {options.map(option => (
              <li
                key={option.key}
                className="w-full cursor-pointer hover:rounded-sm hover:bg-gray3"
              >
                {/* TODO:isCheckBox모드 삭제될수도있음 */}
                {isCheckBox ? (
                  <label className="flex w-full items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {option.value}
                  </label>
                ) : (
                  <button
                    type="button"
                    className="w-full text-start"
                    onClick={() => handleChangeValue(option)}
                  >
                    {option.value}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </article>
    </OutsideClickContainer>
  );
}

export default SelectableDropdown;
