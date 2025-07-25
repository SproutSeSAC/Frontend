import { memo, useCallback, useMemo, useState } from 'react';

import { Option, TechStackTab } from '@/types';

import TabNavigation from '@/components/common/TabNavigation';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import TechStackOption from '@/components/common/dropdown/option/TechStackOption';
import SelectBox, {
  MultiSelectProps,
  SelectBoxShape,
} from '@/components/common/dropdown/select/SelectBox';

export interface OptionItem {
  id: number;
  name: string;
  iconImageUrl?: string;
  type?: string;
}

interface MultiSelectDropdownProps {
  value: number[];
  options: OptionItem[];
  onChangeValue: (value: OptionItem[]) => void;
  defaultTabValue?: string;
  defaultLabel?: string;
  errorMsg?: string;
  isMarkTechStackList?: boolean;
  boxShape?: SelectBoxShape;
  selectBoxClassName?: string;
  hasUnlimitOption?: boolean;
}

/**
 * MultiSelectDropdown 컴포넌트는 여러 옵션을 선택할 수 있는 드롭다운 메뉴입니다.
 *
 * @param options - 드롭다운에 표시할 옵션 목록. 각 옵션은 { id: number, name: string, iconImageUrl?: string, type: string } 형식을 가져야 합니다.
 * @param onChangeValue - 선택한 옵션 목록을 제어하는 함수. 선택이 변경될 때 호출되며, 현재 선택된 옵션 목록을 전달합니다.
 * @param defaultTabValue? - 드롭다운 열릴 때 기본 선택 탭 값. 초기 탭 상태를 설정합니다. 기본값은 빈 문자열입니다.
 * @param defaultLabel? - 드롭다운이 선택되지 않았을 때 버튼에 표시될 기본 레이블입니다. 기본값은 빈 문자열입니다.
 * @param errorMsg? - 에러메세지. 에러 메세지가 있을경우 에러메세지가 버튼 하단에 표시됩니다.
 * @param initialSelectedOptions? - 이미 선택된 옵션들
 * @param isMarkTechStackList? - 선택한 옵션을 위에 표시할지 여부입니다.
 * @param boxShape - 라운지에서의 버튼 모양이거나 모집글에서의 input 모양 둘중 하나를 선택할 수 있습니다. props로 설정하지 않았을 시 기본값은 input 모양입니다.
 * @param selectBoxClassName - 셀렉트 박스 스타일 커스텀, 현재 기본 스타일에서 변경 가능합니다.
 */

const TechStackDropdown = memo(function TechStackDropdown({
  value,
  options,
  onChangeValue,
  defaultTabValue = '',
  defaultLabel = '',
  errorMsg,
  isMarkTechStackList = false,
  boxShape = 'inputShape',
  selectBoxClassName = '',
  hasUnlimitOption,
}: MultiSelectDropdownProps) {
  const [tabValue, setTabValue] = useState(defaultTabValue);
  const [open, setOpen] = useState(false);

  const selectedOptions = options.filter(({ id }) => value?.includes(id));

  const checkIsSelected = useCallback(
    (option: Option) => {
      return selectedOptions.some(({ name }) => name === option.name);
    },
    [selectedOptions],
  );

  const handleSelectOptionChange = useCallback(
    (option: OptionItem) => {
      const isSelected = checkIsSelected(option);

      const updatedOptions = isSelected
        ? selectedOptions.filter(({ name }) => name !== option.name)
        : [...selectedOptions, option];

      onChangeValue(updatedOptions);
    },
    [checkIsSelected, onChangeValue, selectedOptions],
  );

  const handleTabValue = useCallback((tabState: TechStackTab) => {
    setTabValue(tabState);
  }, []);

  const onResetClick = useCallback(() => {
    onChangeValue([]);
  }, [onChangeValue]);

  const tabList = useMemo(
    () =>
      Array.from(
        options
          .filter(({ type }) => type)
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

  const filteredOptionsByTab = useMemo(
    () => options.filter(option => option.type === tabValue),
    [options, tabValue],
  );

  const onClose = () => setOpen(false);

  const handleSelectBoxClick = () => setOpen(prev => !prev);

  const unlimitOption = { id: 0, name: '제한 없음' };

  return (
    <>
      {isMarkTechStackList && value.length !== 0 && (
        <ScrollContainer className="gap-4" isBlurRight>
          {selectedOptions?.map(option => (
            <li
              key={option.id}
              className="relative mb-3 flex size-8 flex-shrink-0 items-center justify-center"
            >
              <img
                src={option.iconImageUrl}
                alt={option.name}
                className="size-8 rounded-lg"
              />
            </li>
          ))}
        </ScrollContainer>
      )}

      <SelectBox<MultiSelectProps>
        defaultLabel={defaultLabel}
        selectedOptions={selectedOptions}
        onClose={onClose}
        onSelectBoxClick={handleSelectBoxClick}
        open={open}
        errorMsg={errorMsg}
        onResetClick={onResetClick}
        boxShape={boxShape}
        className={selectBoxClassName}
      >
        <TabNavigation
          tabList={tabList}
          onChangeValue={handleTabValue}
          selectValue={tabValue}
          tabClassName="pb-[7px] px-3"
          className="px-5"
        />

        <ul className="flex flex-wrap gap-2.5 p-4">
          {filteredOptionsByTab.map(option => (
            <TechStackOption
              key={option.id}
              option={option}
              onChangeValue={handleSelectOptionChange}
              isSelected={checkIsSelected(option)}
            />
          ))}
        </ul>

        {hasUnlimitOption && (
          <label className="mb-4 ml-5 flex w-fit cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={checkIsSelected(unlimitOption)}
              onChange={() => handleSelectOptionChange(unlimitOption)}
              className="size-4 rounded border-darkGray"
            />
            <span>제한 없음</span>
          </label>
        )}
      </SelectBox>
    </>
  );
});

export default TechStackDropdown;
