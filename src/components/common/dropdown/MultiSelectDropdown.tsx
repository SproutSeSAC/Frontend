import { Fragment, useCallback, useEffect, useState } from 'react';

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

  const checkIsSelected = useCallback(
    (option: Option) => {
      return selectedOptions.some(({ name }) => name === option.name);
    },
    [selectedOptions],
  );

  const handleCheckboxChange = useCallback(
    (option: Option) => {
      const addedOption = [...selectedOptions, option];
      const filteredOption = selectedOptions.filter(
        ({ id }) => id !== option.id,
      );
      const updatedOptions = checkIsSelected(option)
        ? filteredOption
        : addedOption;

      setSelectedOptions(updatedOptions);
      return onChangeValue(updatedOptions);
    },
    [selectedOptions, checkIsSelected, onChangeValue],
  );

  const handleFullCheck = useCallback(() => {
    const updatedOptions =
      selectedOptions.length !== options.length ? options : [];
    setSelectedOptions(updatedOptions);
    return onChangeValue(updatedOptions);
  }, [onChangeValue, options, selectedOptions.length]);

  const onResetClick = useCallback(() => {
    setSelectedOptions([]);
    onChangeValue([]);
  }, [onChangeValue]);

  useEffect(() => {
    if (!hasFullCheck && initialSelectedOptions) {
      setSelectedOptions(initialSelectedOptions);
    }
  }, [hasFullCheck, initialSelectedOptions]);

  const onClose = () => setOpen(false);

  const handlSelectBoxClick = () => {
    if (onSelectBoxClick) {
      onSelectBoxClick();
    }
    if (options.length) {
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
        {hasFullCheck && (
          <label
            className={`mt-2 flex cursor-pointer items-center rounded-lg px-3 py-1.5 hover:bg-gray4 ${selectedOptions.length === options.length ? 'text-gray2' : 'text-text'} ${optionClassName}`}
          >
            <input
              type="checkbox"
              checked={selectedOptions.length === options.length}
              onChange={handleFullCheck}
              className="mr-3 size-4 rounded border-gray-300"
            />
            <span>전체선택</span>
          </label>
        )}
        {options.map(option => (
          <Fragment key={option.id}>
            <SelectOption
              option={option}
              isSelected={checkIsSelected(option)}
              onOptionClick={handleCheckboxChange}
              isMultiSelectOption
              className={optionClassName}
            />
          </Fragment>
        ))}
      </SelectBox>
    </OutsideClickContainer>
  );
}
