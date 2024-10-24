import { useCallback, useEffect, useState } from 'react';

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
 */

export default function MultiSelectDropdown({
  defaultLabel,
  options,
  onChangeValue,
  errorMsg,
  boxShape,
  initialSelectedOptions,
  selectBoxClassName = '',
  optionClassName = '',
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  // 여기 버그.......!!!!!!!
  // 뒤로 돌아오면 초기화되는 버그. 뭐 때문일까?

  const checkIsSelected = useCallback(
    (option: Option) => {
      return selectedOptions.some(({ name }) => name === option.name);
    },
    [selectedOptions],
  );

  const handleCheckboxChange = useCallback(
    (option: Option) => {
      const updatedOptions = checkIsSelected(option)
        ? selectedOptions.filter(item => item !== option)
        : [...selectedOptions, option];

      setSelectedOptions(updatedOptions);
      onChangeValue(updatedOptions);
    },
    [checkIsSelected, onChangeValue, selectedOptions],
  );

  const onResetClick = useCallback(() => {
    setSelectedOptions([]);
    onChangeValue([]);
  }, [onChangeValue]);

  useEffect(() => {
    if (initialSelectedOptions) {
      setSelectedOptions(initialSelectedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => setOpen(false);

  const handlSelectBoxClick = () => {
    if (options.length) {
      setOpen(prev => !prev);
    }
  };

  return (
    <OutsideClickContainer onClose={setOpen} width="100%">
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
        {options.map(option => (
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
