import { useCallback, useState } from 'react';

import OutsideClickContainer from './OutsideClickContainer';
import TabNavigation from './TabNavigation';

import { BsArrowCounterclockwise, BsX } from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface MultiSelectDropdownProps<T extends string> {
  label: string;
  options: { key: T; value: string; type?: string }[];
  onChangeValue: (value: { key: T; value: string; type?: string }[]) => void;
  tabList: { text: string; type: string }[];
  width?: string;
  className?: string;
  defaultValue?: string;
}

function MultiSelectDropdown<T extends string>({
  label,
  options,
  width,
  tabList,
  defaultValue,
  className,
  onChangeValue,
}: MultiSelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const [tabOptions, setTabOptions] = useState<
    { key: T; value: string; type?: string }[]
  >(defaultValue ? options.filter(option => option.type === defaultValue) : []);

  const [selectedOptions, setSelectedOptions] = useState<
    { key: T; value: string }[]
  >([]);

  const handleSelectOptionChange = useCallback(
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

  const handleOptions = useCallback(
    (tabState: string) => {
      const newOption = options.filter(option => option.type === tabState);

      setTabOptions(tabState === 'all' ? options : newOption);
    },
    [options],
  );

  const handleChangeTag = useCallback(
    (value: string) => {
      if (value) {
        setSelectedOptions(prevSelectedOptions => {
          const updatedOptions = prevSelectedOptions.filter(
            selectItem => selectItem.value !== value,
          );
          onChangeValue(updatedOptions);
          return updatedOptions;
        });
      }
      setSelectedOptions([]);
      onChangeValue([]);
    },
    [onChangeValue],
  );

  return (
    <OutsideClickContainer onClose={setOpen} width={width}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`flex w-full items-center gap-5 text-start ${className}`}
      >
        <span className="w-full">
          {selectedOptions.length > 1 &&
            `${selectedOptions[0].value} 외 ${selectedOptions.length - 1}개`}
          {selectedOptions.length === 1 && selectedOptions[0].value}
          {selectedOptions.length === 0 && label}
        </span>
        {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>
      <article
        className={`absolute z-20 mt-1 w-full list-none ${open ? 'block overflow-auto' : 'hidden overflow-hidden'} flex max-h-72 flex-col gap-2 rounded-lg bg-white px-1.5 py-2.5 shadow-card`}
      >
        <TabNavigation
          tabList={tabList}
          onChangeValue={value => handleOptions(value)}
          defaultValue={defaultValue}
        />
        <ul
          className={`flex flex-wrap gap-2 ${selectedOptions.length === 0 && 'mb-[72px]'}`}
        >
          {tabOptions.map(option => (
            <li
              key={option.key}
              className={`w-fit cursor-pointer rounded-3xl border border-solid px-4 py-2 ${selectedOptions.includes(option) ? 'border-gray1' : 'border-gray4'}`}
            >
              <label className="flex w-full items-center gap-2">
                <input
                  type="checkbox"
                  onChange={() => handleSelectOptionChange(option)}
                  className="hidden"
                />
                {option.value}
              </label>
            </li>
          ))}
        </ul>

        {selectedOptions.length > 0 && (
          <div className="mx-1 mb-4 mt-6 flex items-center gap-3">
            <ul className="flex gap-2">
              {selectedOptions.map(selectItem => (
                <li
                  key={selectItem.key}
                  className="flex items-center gap-2 rounded-md bg-gray4 px-2 py-1"
                >
                  {selectItem.value}
                  <button
                    type="button"
                    aria-label={`${selectItem.value}태그 삭제`}
                    onClick={() => handleChangeTag(selectItem.value)}
                  >
                    <BsX size={20} />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              aria-label="태그 초기화"
              onClick={() => handleChangeTag('')}
              className="flex items-center gap-1"
            >
              <BsArrowCounterclockwise size={20} />
              <span>초기화</span>
            </button>
          </div>
        )}
      </article>
    </OutsideClickContainer>
  );
}

export default MultiSelectDropdown;
