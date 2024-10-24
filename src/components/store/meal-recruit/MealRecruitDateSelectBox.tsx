import { useState } from 'react';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';
import ErrorMsg from '@/components/common/input/ErrorMsg';

export default function MealRecruitDateSelectBox({
  dateOptions,
  errorMas,
  onChange,
}: {
  dateOptions: {
    id: string;
    name: JSX.Element;
    value: Date;
  }[];
  errorMas: string;
  onChange: (...event: (Date | null)[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    id: string;
    name: JSX.Element;
  }>();

  const handleChangeValue = (option: {
    id: string;
    name: JSX.Element;
    value: Date;
  }) => {
    setOpen(false);
    setSelectedOptions(option);
    onChange(option.value);
  };

  return (
    <OutsideClickContainer onClose={setOpen} width="100%">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`${errorMas && 'border-red-500'} relative flex w-full items-center gap-5 text-start ${selectedOptions ? 'text-text' : 'text-[#9ca3af]'} rounded-xl border border-solid border-gray2 px-6 py-[13px] text-lg`}
      >
        <span className="w-full">
          {selectedOptions?.id || '날짜를 선택해주세요'}
        </span>
        {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      <article className="relative">
        <ul
          className={`absolute mt-1 w-full list-none ${open ? 'max-h-64 py-[15px]' : 'max-h-0 border-none py-0'} flex flex-col gap-[14px] overflow-auto rounded-2xl bg-white shadow-card transition-all duration-500`}
        >
          {dateOptions.map(option => (
            <li
              key={option.id}
              className="cursor-pointer px-7 py-[5px] hover:rounded-lg hover:bg-vividGreen3"
            >
              <button
                type="button"
                className="w-full text-start"
                onClick={() => handleChangeValue(option)}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      </article>

      {errorMas && <ErrorMsg msg={errorMas || ''} className="ml-2" />}
    </OutsideClickContainer>
  );
}
