import { ReactNode, memo, useCallback, useMemo, useState } from 'react';

import TabNavigation from '../TabNavigation';
import ErrorMsg from '../input/ErrorMsg';

import { BsArrowCounterclockwise } from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';

interface OptionItem {
  id: number;
  name: string;
  iconImageUrl?: string;
  type: string;
}

interface MultiSelectDropdownProps {
  options: OptionItem[];
  onChangeValue: (value: OptionItem[]) => void;
  defaultValue?: string;
  width?: string;
  label?: string;
  buttonContent?: string | ReactNode;
  buttonClassName?: string;
  contentClassName?: string;
  isLoading?: boolean;
  errorMsg?: string;
}

/**
 * MultiSelectDropdown 컴포넌트는 여러 옵션을 선택할 수 있는 드롭다운 메뉴입니다.
 *
 * @param options - 드롭다운에 표시할 옵션 목록. 각 옵션은 { id: number, name: string, iconImageUrl?: string, type: string } 형식을 가져야 합니다.
 * @param onChangeValue - 선택한 옵션 목록을 제어하는 함수. 선택이 변경될 때 호출되며, 현재 선택된 옵션 목록을 전달합니다.
 * @param defaultValue? - 드롭다운 열릴 때 기본 선택 탭 값. 초기 탭 상태를 설정합니다. 기본값은 빈 문자열입니다.
 * @param width? - MultiSelectDropdown의 전체 너비. CSS 단위로 설정할 수 있습니다 (예: px, %).
 * @param label? - 드롭다운이 선택되지 않았을 때 버튼에 표시될 기본 레이블입니다. 기본값은 빈 문자열입니다.
 * @param buttonContent? - 커스텀 버튼 콘텐츠. 문자열 또는 ReactNode 형식으로 제공할 수 있습니다.
 * @param buttonClassName? - 버튼 영역의 CSS 클래스. 버튼 스타일을 커스터마이즈합니다.
 * @param contentClassName? - 드롭다운 옵션 목록의 CSS 클래스. 드롭다운 내용의 스타일을 설정합니다.
 * @param isLoading? - 로딩 상태를 나타내는 부울 값. true일 경우 버튼에 로딩 UI가 표시됩니다.
 * @param errorMsg? - 에러메세지. 에러 메세지가 있을경우 에러메세지가 버튼 하단에 표시됩니다.
 */

const MultiSelectDropdown = memo(function MultiSelectDropdown({
  options,
  onChangeValue,
  defaultValue = '',
  width,
  label = '',
  buttonContent,
  buttonClassName,
  contentClassName,
  isLoading,
  errorMsg,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(defaultValue);
  const [selectedOptions, setSelectedOptions] = useState<OptionItem[]>([]);

  const handleSelectOptionChange = useCallback(
    (option: OptionItem) => {
      const isSelected = selectedOptions.some(item => item.id === option.id);
      const updatedOptions = isSelected
        ? selectedOptions.filter(item => item.id !== option.id)
        : [...selectedOptions, option];

      setSelectedOptions(updatedOptions);
      onChangeValue(updatedOptions);
    },
    [onChangeValue, selectedOptions],
  );

  const handleOptions = useCallback((tabState: string) => {
    setTabValue(tabState);
  }, []);

  const handleChangeTag = useCallback(() => {
    setSelectedOptions([]);
    onChangeValue([]);
  }, [onChangeValue]);

  const tabList = useMemo(
    () =>
      Array.from(
        options
          .reduce((acc, curr) => {
            if (!acc.has(curr.type)) {
              acc.set(curr.type, { text: curr.type, type: curr.type });
            }
            return acc;
          }, new Map())
          .values(),
      ),
    [options],
  );

  const filteredOptions = useMemo(
    () => options.filter(option => option.type === tabValue),
    [options, tabValue],
  );

  const buttonDisplayContent = useMemo(() => {
    if (selectedOptions.length > 1) {
      return `${selectedOptions[0].name} 외 ${selectedOptions.length - 1}개`;
    }
    return selectedOptions.length === 1 ? selectedOptions[0].name : label;
  }, [selectedOptions, label]);

  return (
    <OutsideClickContainer onClose={setOpen} width={width}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`flex w-full items-center justify-between gap-5 rounded-2xl border border-solid border-gray2 text-start ${selectedOptions.length > 0 ? 'text-text' : 'text-[#9ca3af]'} ${buttonClassName}`}
      >
        {isLoading && <div>Loading...</div>}
        {!isLoading &&
          (buttonContent || (
            <>
              <span className="w-full">{buttonDisplayContent}</span>

              {selectedOptions.length === 0 &&
                (open ? <IoIosArrowUp /> : <IoIosArrowDown />)}
            </>
          ))}
        {selectedOptions.length > 0 && (
          <button
            type="button"
            aria-label="태그 초기화"
            onClick={() => handleChangeTag()}
            className="flex min-w-fit items-center"
          >
            <BsArrowCounterclockwise />
          </button>
        )}
      </button>
      {open && (
        <article className="absolute z-20 mt-1 flex w-full list-none flex-col gap-2 rounded-lg bg-white px-4 py-[15px] shadow-card">
          <TabNavigation
            tabList={tabList}
            onChangeValue={handleOptions}
            selectValue={tabValue}
            tabClassName="pb-[7px]"
          />
          <ul className={`flex flex-wrap gap-2.5 ${contentClassName}`}>
            {filteredOptions.map(option => (
              <li
                key={option.id}
                className={`w-fit cursor-pointer rounded-lg border border-solid ${selectedOptions.some(selected => selected.id === option.id) ? 'border-gray1' : 'border-gray4'}`}
              >
                <label className="flex w-full items-center gap-2 py-[5px] pl-[5px] pr-2.5">
                  {/* TODO: image url 정상적으로 등록되면 주석 해제 예정 */}
                  {/* {option.iconImageUrl ? (
                    <img src={option.iconImageUrl} alt={option.name} />
                  ) : ( */}
                  <div className="h-5 w-5 bg-gray3" />
                  {/* )} */}
                  <input
                    type="checkbox"
                    checked={selectedOptions.some(
                      selected => selected.id === option.id,
                    )}
                    onChange={() => handleSelectOptionChange(option)}
                    className="hidden"
                  />
                  {option.name}
                </label>
              </li>
            ))}
          </ul>
        </article>
      )}
      {errorMsg && <ErrorMsg msg={errorMsg} className="ml-2" />}
    </OutsideClickContainer>
  );
});

export default MultiSelectDropdown;
