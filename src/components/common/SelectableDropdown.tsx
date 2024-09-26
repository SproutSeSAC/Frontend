import { useCallback, useEffect, useRef, useState } from 'react';

import OutsideClickContainer from './OutsideClickContainer';

import { FilterType } from '@/types';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface SingleOption {
  id: number;
  name: string;
  key?: string;
}

interface SelectableDropdownProps {
  label: string;
  options: FilterType[];
  onChangeValue: (value: SingleOption[]) => void;
  width?: string;
  selectBoxClassName?: string;
  selectOptionBoxClassName?: string;
  selectOptionClassName?: string;
  isCheckBox?: boolean;
}

function SelectableDropdown({
  label,
  options,
  width,
  selectBoxClassName,
  selectOptionBoxClassName,
  selectOptionClassName,
  isCheckBox,
  onChangeValue,
}: SelectableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [visibilityAnimation, setVisibilityAnimation] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCheckboxChange = useCallback(
    (option: { id: number; name: string }) => {
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
    (option: { id: number; name: string }) => {
      // TODO :numberype error로 인한 [] 수정필요함
      onChangeValue([option]);
      setOpen(false);
      setSelectedLabel(option.name);
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
        className={`relative flex w-full items-center gap-5 text-start ${selectBoxClassName}`}
      >
        <span className="w-full">
          {selectedOptions.length > 1 &&
            `${selectedOptions[0].name} 외 ${selectedOptions.length - 1}개`}
          {selectedOptions.length === 1 && selectedOptions[0].name}
          {selectedOptions.length === 0 && (selectedLabel || label)}
        </span>
        {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>
      <article
        className={`relative left-0 ${open ? 'block' : 'none'} z-20 w-full`}
      >
        {visibilityAnimation && (
          <ul
            className={`absolute mt-1 w-full list-none ${open ? 'animate-slide-fade-in-dropdown overflow-auto' : 'animate-slide-fade-out-dropdown overflow-hidden'} flex max-h-72 flex-col gap-2 rounded-lg bg-white shadow-card ${selectOptionBoxClassName}`}
          >
            {options.map(option => (
              <li
                key={option.key}
                className={`w-full cursor-pointer ${selectOptionClassName}`}
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
                    {option.name}
                  </label>
                ) : (
                  <button
                    type="button"
                    className="w-full text-start"
                    onClick={() => handleChangeValue(option)}
                  >
                    {option.name}
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
