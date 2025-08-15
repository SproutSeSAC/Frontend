import { useState } from 'react';

import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';
import SelectBox, {
  SingleSelectProps,
} from '@/components/common/dropdown/select/SelectBox';

export default function MealRecruitDateSelectBox({
  dateOptions,
  errorMsg,
  onChange,
}: {
  dateOptions: {
    id: string;
    name: JSX.Element;
    value: Date;
  }[];
  errorMsg: string;
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
    <OutsideClickContainer onClose={setOpen}>
      <SelectBox<SingleSelectProps>
        defaultLabel="날짜를 선택해주세요"
        open={open}
        onClose={() => setOpen(false)}
        onSelectBoxClick={() => setOpen(prev => !prev)}
        errorMsg={errorMsg}
        selectedOptionLabel={selectedOptions?.id}
        boxShape="buttonShape"
        selectBoxClassName={`${errorMsg ? 'border-red-500' : ''} relative flex w-full h-[50px] items-center gap-5 text-start ${selectedOptions ? '!text-black' : 'text-mainGray-hover'} rounded-xl border border-solid border-mainGray bg-white px-4 py-[9px] text-lg`}
      >
        {dateOptions.map((option, idx) => (
          <li
            key={option.id}
            className={`mx-1 cursor-pointer px-4 py-[5px] hover:rounded-lg hover:bg-lightGreen-hover ${idx === 0 && 'mt-4'} ${idx + 1 === dateOptions.length ? 'mb-4' : 'mb-[9px]'}`}
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
      </SelectBox>
    </OutsideClickContainer>
  );
}
