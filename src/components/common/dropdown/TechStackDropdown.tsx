import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import TabNavigation from '../TabNavigation';

import XButton from '@/components/common/button/XButton';
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
  type: string;
}

interface MultiSelectDropdownProps {
  options: OptionItem[];
  onChangeValue: (value: OptionItem[]) => void;
  defaultTabValue?: string;
  defaultLabel?: string;
  errorMsg?: string;
  initialSelectedOptions?: OptionItem[];
  isMarkTechStackList?: boolean;
  boxShape?: SelectBoxShape;
  selectBoxClassName?: string;
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
  options,
  onChangeValue,
  defaultTabValue = '',
  defaultLabel = '',
  errorMsg,
  initialSelectedOptions,
  isMarkTechStackList = false,
  boxShape = 'inputShape',
  selectBoxClassName = '',
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(defaultTabValue);
  const [selectedOptions, setSelectedOptions] = useState<OptionItem[]>([]);

  const checkIsSelected = useCallback(
    (option: OptionItem) => {
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

      setSelectedOptions(updatedOptions);
      onChangeValue(updatedOptions);
    },
    [checkIsSelected, onChangeValue, selectedOptions],
  );

  const handleTabValue = useCallback((tabState: string) => {
    setTabValue(tabState);
  }, []);

  const onResetClick = useCallback(() => {
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

  const filteredOptionsByTab = useMemo(
    () => options.filter(option => option.type === tabValue),
    [options, tabValue],
  );

  useEffect(() => {
    if (initialSelectedOptions) {
      setSelectedOptions(initialSelectedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => setOpen(false);

  const handleSelectBoxClick = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      {isMarkTechStackList && (
        <ScrollContainer gap={3}>
          {selectedOptions?.map(option => (
            <li
              key={option.id}
              className="relative mb-1.5 size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
            >
              <img src={option.iconImageUrl} alt={option.name} />
              <XButton
                className="absolute -right-1 -top-1 rounded-full bg-black"
                onDeleteClick={() => handleSelectOptionChange(option)}
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
          tabClassName="pb-[7px]"
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
      </SelectBox>
    </>
  );
});

export default TechStackDropdown;
