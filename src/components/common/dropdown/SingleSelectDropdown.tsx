import { useCallback, useState } from 'react';

import SelectOption, {
  Option,
} from '@/components/common/dropdown/option/SelectOption';
import SelectBox, {
  SelectBoxShape,
  SingleSelectProps,
} from '@/components/common/dropdown/select/SelectBox';

interface SingleSelectDropdownProps {
  defaultLabel: string;
  options: Option[];
  selectedOption?: Option;
  selectedOptions?: Option[];
  onSelectBoxClick?: () => void;
  onChangeValue: (value: Option[]) => void;
  errorMsg?: string;
  boxShape?: SelectBoxShape;
  selectBoxClassName?: string;
  optionClassName?: string;
}

/**
 * @param defaultLabel - 옵션에서 선택한 값이 없을 때 보여지는 디폴트 라벨입니다. (ex 관심 직무)
 * @param options - 드롭다운 옵션 리스트입니다.
 * @param selectedOption - 드롭다운에서 방금 선택한 옵션입니다.
 * @param selectedOptions - 이전에 선택완료한 옵션들입니다. 드롭다운은 한번에 한가지만 선택할 수 있지만 여러번 선택하는 경우입니다.
 * @param onSelectBoxClick - 만약 드롭다운을 열고 닫는 것 이외에도 다른 로직의 함수가 필요하다면 이 props를 이용합니다.
 * @param onChangeValue - 옵션 변경 함수입니다.
 * @param errorMsg - 폼 관련 에러 메시지입니다.
 * @param boxShape - 라운지에서의 버튼 모양이거나 모집글에서의 input 모양 둘중 하나를 선택할 수 있습니다. props로 설정하지 않았을 시 기본값은 input 모양입니다.
 * @param selectBoxClassName - 셀렉트 박스 스타일 커스텀, 현재 기본 스타일에서 변경 가능합니다.
 * @param optionClassName - 옵션 리스트 박스가 아닌 하나의 옵션 스타일 커스텀, 현재 기본 스타일에서 변경 가능합니다.
 */

export default function SingleSelectDropdown({
  defaultLabel,
  selectedOption,
  selectedOptions,
  options,
  onSelectBoxClick,
  onChangeValue,
  errorMsg,
  boxShape = 'inputShape',
  selectBoxClassName = '',
  optionClassName = '',
}: SingleSelectDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleChangeValue = useCallback(
    (option: Option) => {
      onChangeValue([option]);
      setOpen(prev => !prev);
    },
    [onChangeValue],
  );

  const isSelected = ({ name }: Option) => {
    return selectedOptions?.length !== 0
      ? !!selectedOptions?.some(option => name === option.name)
      : selectedOption?.name === name;
  };

  const handleSelectBoxClick = () => {
    if (onSelectBoxClick) {
      onSelectBoxClick();
    }
    // 옵션이 있는 경우에만 열고 닫기 가능
    if (options.length) {
      setOpen(prev => !prev);
    }
  };

  const onSelectBoxClose = () => setOpen(false);

  return (
    <SelectBox<SingleSelectProps>
      defaultLabel={defaultLabel}
      open={open}
      onClose={onSelectBoxClose}
      onSelectBoxClick={handleSelectBoxClick}
      errorMsg={errorMsg}
      selectedOptionLabel={selectedOption?.name}
      boxShape={boxShape}
      className={selectBoxClassName}
    >
      {options.map(option => (
        <SelectOption
          key={option.id}
          option={option}
          isSelected={isSelected(option)}
          onOptionClick={handleChangeValue}
          className={optionClassName}
        />
      ))}
    </SelectBox>
  );
}
