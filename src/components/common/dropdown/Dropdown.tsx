import { useCallback, useState } from 'react';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';

interface Option {
  id: number;
  name: string;
}

interface DropdownProps {
  label: string;
  selectedOptionId: number | undefined;
  options: Option[];
  onChangeValue: (value: Option[]) => void;
  onSelectBoxClick?: () => boolean;
  selectBoxClassName?: string;
  selectOptionBoxClassName?: string;
  selectOptionClassName?: string;
}

export default function Dropdown({
  label,
  selectedOptionId,
  options,
  onChangeValue,
  onSelectBoxClick,
  selectBoxClassName = '',
  selectOptionBoxClassName = '',
  selectOptionClassName = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const handleChangeValue = useCallback(
    (option: Option) => {
      onChangeValue([option]);
      setOpen(false);
    },
    [onChangeValue],
  );

  const onClick = () => {
    if (onSelectBoxClick) {
      onSelectBoxClick();
      if (onSelectBoxClick()) return;
    }
    setOpen(prev => !prev);
  };

  const selectedOptionLabel =
    options.find(({ id }) => id === selectedOptionId)?.name || label;

  return (
    <OutsideClickContainer onClose={setOpen} width="100%">
      {/* SelectBox */}
      <button
        type="button"
        onClick={onClick}
        className={`relative flex h-[50px] w-full items-center gap-5 rounded-2xl border border-gray4 p-4 text-start ${selectBoxClassName}`}
      >
        <span className="w-full">{selectedOptionLabel}</span>
        {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      {/* Options */}
      <article className="relative z-20 w-full">
        <ul
          className={`${open ? 'max-h-72 border-gray3 py-1.5' : 'max-h-0 border-white'} absolute mt-1 flex w-full flex-col overflow-hidden rounded-lg border bg-white shadow-card transition-all duration-500 ${selectOptionBoxClassName}`}
        >
          {options.map(option => (
            <li
              key={option.id}
              className={`w-full cursor-pointer hover:rounded-lg hover:bg-gray4 ${selectOptionClassName}`}
            >
              <button
                type="button"
                className="w-full px-3 py-2 text-start"
                onClick={() => handleChangeValue(option)}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      </article>
    </OutsideClickContainer>
  );
}
