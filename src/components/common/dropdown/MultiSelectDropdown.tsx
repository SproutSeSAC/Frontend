import { useCallback, useEffect, useMemo, useState } from 'react';

import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';
import SelectOption, {
  Option,
} from '@/components/common/dropdown/option/SelectOption';
import SelectBox, {
  MultiSelectProps,
  SelectBoxShape,
} from '@/components/common/dropdown/select/SelectBox';

interface MultiSelectDropdownProps {
  defaultLabel: string;
  options: Option[];
  onChangeValue: (value: Option[]) => void;
  errorMsg?: string;
  boxShape?: SelectBoxShape;
  initialSelectedOptions?: Option[];
  selectBoxClassName?: string;
  optionClassName?: string;
  hasFullCheck?: boolean;
  onSelectBoxClick?: () => void;
}

/**
 * @param defaultLabel - 옵션에서 선택한 값이 없을 때 보여지는 디폴트 라벨입니다. (ex 관심 직무)
 * @param options - 드롭다운 옵션 리스트입니다.
 * @param onChangeValue - 옵션 변경 함수입니다.
 * @param errorMsg - 폼 관련 에러 메시지입니다.
 * @param boxShape - 라운지에서의 버튼 모양이거나 모집글에서의 input 모양 둘중 하나를 선택할 수 있습니다. props로 설정하지 않았을 시 기본값은 input 모양입니다.
 * @param initialSelectedOptions - 이전에 선택완료한 옵션들입니다. 드롭다운은 한번에 한가지만 선택할 수 있지만 여러번 선택하는 경우입니다.
 * @param selectBoxClassName - 셀렉트 박스 스타일 커스텀, 현재 기본 스타일에서 변경 가능합니다.
 * @param optionClassName - 옵션 리스트 박스가 아닌 하나의 옵션 스타일 커스텀, 현재 기본 스타일에서 변경 가능합니다.
 * @param hasFullCheck - 전체 선택 버튼
 * @param onSelectBoxClick - 셀렉트 박스를 클릭했을 때 발생해야하는 이벤트
 */

const fullCheckOption = {
  id: 0,
  name: '전체',
};

export default function MultiSelectDropdown({
  defaultLabel,
  options,
  onChangeValue,
  errorMsg,
  boxShape,
  initialSelectedOptions,
  selectBoxClassName = '',
  optionClassName = '',
  hasFullCheck = false,
  onSelectBoxClick,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const multiOptions = useMemo(() => {
    return hasFullCheck ? [fullCheckOption, ...options] : options;
  }, [hasFullCheck, options]);

  const checkIsSelected = useCallback(
    (option: Option) => {
      return selectedOptions.some(({ name }) => name === option.name);
    },
    [selectedOptions],
  );

  const handleCheckboxChange = useCallback(
    (option: Option) => {
      /*
        로직
        1. 전체 버튼을 클릭하면 전체가 선택된다. 반대로 해체하면 전체 버튼이 해제된다.
        2. 옵션 리스트 중 하나라도 해제되면 전체 버튼도 같이 해제된다.
        3. 만약 옵션 리스트를 수동 조작으로 다 선택했다면 전체 버튼도 같이 선택된다.
      */

      if (option.name === '전체') {
        const updatedOptions = checkIsSelected(option) ? [] : [...multiOptions];
        setSelectedOptions(updatedOptions);
        return onChangeValue(updatedOptions);
      }

      const addedOption = [...selectedOptions, option];
      const isFullChecked = addedOption.length === options.length;

      const addOption =
        isFullChecked && hasFullCheck
          ? [fullCheckOption, ...addedOption]
          : addedOption;

      const filteredOption = selectedOptions.filter(
        ({ id }) => id !== option.id,
      );
      const isNotFullChecked = filteredOption.length === options.length;

      const filterOption = isNotFullChecked
        ? filteredOption.filter(item => item.name !== '전체')
        : filteredOption;

      const updatedOptions = checkIsSelected(option) ? filterOption : addOption;

      setSelectedOptions(updatedOptions);
      return onChangeValue(updatedOptions);
    },
    [
      selectedOptions,
      options.length,
      hasFullCheck,
      checkIsSelected,
      onChangeValue,
      multiOptions,
    ],
  );

  const onResetClick = useCallback(() => {
    setSelectedOptions([]);
    onChangeValue([]);
  }, [onChangeValue]);

  useEffect(() => {
    if (initialSelectedOptions) {
      setSelectedOptions(initialSelectedOptions);
    }
  }, [initialSelectedOptions]);

  const onClose = () => setOpen(false);

  const handlSelectBoxClick = () => {
    if (onSelectBoxClick) {
      onSelectBoxClick();
    }
    if (multiOptions.length) {
      setOpen(prev => !prev);
    }
  };

  return (
    <OutsideClickContainer onClose={setOpen}>
      <SelectBox<MultiSelectProps>
        defaultLabel={defaultLabel}
        open={open}
        onClose={onClose}
        onSelectBoxClick={handlSelectBoxClick}
        selectedOptions={selectedOptions}
        errorMsg={errorMsg}
        boxShape={boxShape}
        onResetClick={onResetClick}
        className={selectBoxClassName}
      >
        {multiOptions.map(option => (
          <SelectOption
            key={option.id}
            option={option}
            isSelected={checkIsSelected(option)}
            onOptionClick={handleCheckboxChange}
            isMultiSelectOption
            className={optionClassName}
          />
        ))}
      </SelectBox>
    </OutsideClickContainer>
  );
}
