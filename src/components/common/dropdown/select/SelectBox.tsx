import { useCallback } from 'react';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import ResetButton from '@/components/common/button/ResetButton';
import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';
import { Option } from '@/components/common/dropdown/option/SelectOption';
import ErrorMsg from '@/components/common/input/ErrorMsg';

export interface SingleSelectProps {
  selectedOptionLabel: string | undefined;
}

export interface MultiSelectProps {
  selectedOptions: Option[];
  onResetClick: () => void;
}

export type SelectBoxShape = 'inputShape' | 'buttonShape';

interface SelectBoxPropsBase {
  defaultLabel: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errorMsg?: string;
  className?: string;
  boxShape?: SelectBoxShape;
}

type SelectBoxProps<T> = SelectBoxPropsBase & T;

/**
 * SelectBoxPropsBase
 * @param boxShape - 라운지에서의 버튼 모양이거나 모집글에서의 input 모양 둘중 하나를 선택할 수 있습니다. props로 설정하지 않았을 시 기본값은 input 모양입니다.
 * @param defaultLabel - 드롭다운이 선택되지 않았을 때 버튼에 표시될 기본 레이블입니다. 기본값은 빈 문자열입니다.
 * @param children - Select의 Options을 표시합니다.
 * @param open - 현재 드롭다운의 개폐 상태값입니다.
 * @param setOpen - 드롭다운을 열고 닫기 위한 상태 변경 함수입니다.
 * @param errorMsg - 폼에 대한 에러메세지. 에러 메세지가 있을경우 에러메세지가 버튼 하단에 표시됩니다.
 * @param className - SelectBox의 스타일을 커스텀할 수 있습니다.
 *
 * SingleSelectProps
 * @param selectedOptionLabel - 단일 선택 드롭다운에서 SelectBox에 표시되는 선택한 옵션에 대한 라벨값입니다.
 *
 * MultiSelectProps
 * @param selectedOptions - 복수 선택 드롭다운에서 선택된 옵션 리스트입니다.
 * @param onResetClick - 복수 선택 드롭다운에서 옵션 선택시 나타나는 옵션 선택 초기화 버튼입니다.
 */

export default function SelectBox<
  T extends SingleSelectProps | MultiSelectProps,
>({
  defaultLabel,
  open,
  setOpen,
  className,
  children,
  errorMsg,
  boxShape = 'inputShape',
  ...rest
}: SelectBoxProps<T>) {
  const isSingleSelect = (props: unknown): props is SingleSelectProps => {
    return !('selectedOptions' in (props as SingleSelectProps));
  };

  const isMultiSelect = (props: unknown): props is MultiSelectProps => {
    return 'selectedOptions' in (props as MultiSelectProps);
  };

  const getSelectedOptionLabel = useCallback(
    (options: Option[], label: string) => {
      if (options.length) {
        return `${options[0].name} ${
          options.length > 1 ? `외 ${options.length - 1}개` : ''
        }`;
      }
      return label;
    },
    [],
  );

  const onToggleClick = () => setOpen(prev => !prev);

  const onClose = () => setOpen(false);

  const styleByBoxShape = {
    inputShape: `w-full gap-5 rounded-2xl border bg-white px-4 py-[15px] text-start text-lg ${boxShape === 'buttonShape' && 'text-gray1'}`,
    buttonShape:
      'rounded-2xl border border-gray2 bg-bg px-3 py-1 gap-4 text-gray1',
  };

  const selectBoxStyle = styleByBoxShape[boxShape];

  return (
    <OutsideClickContainer onClose={onClose} width="100%">
      <div className="relative">
        <button
          type="button"
          onClick={onToggleClick}
          className={`relative flex items-center [&>svg]:size-5 [&>svg]:text-gray1 ${selectBoxStyle} ${errorMsg && 'border-red-500'} ${className}`}
        >
          {isSingleSelect(rest) && (
            <>
              <span
                className={`w-full ${boxShape === 'inputShape' && !rest?.selectedOptionLabel && 'text-gray2'}`}
              >
                {rest?.selectedOptionLabel || defaultLabel}
              </span>
              {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </>
          )}

          {isMultiSelect(rest) && (
            <>
              <span
                className={`w-full ${boxShape === 'inputShape' && !rest.selectedOptions.length && 'text-gray2'}`}
              >
                {getSelectedOptionLabel(rest.selectedOptions, defaultLabel)}
              </span>
              {rest.selectedOptions?.length === 0 &&
                (open ? <IoIosArrowUp /> : <IoIosArrowDown />)}
            </>
          )}
        </button>

        {isMultiSelect(rest) && rest.selectedOptions?.length >= 1 && (
          <ResetButton
            onResetClick={rest.onResetClick}
            className="absolute inset-y-0 right-2"
          />
        )}
      </div>

      <article className={defaultLabel !== '기술스택' ? 'relative' : ''}>
        <ul
          className={`${open ? 'max-h-64 border border-gray4' : 'max-h-0'} w-full ${defaultLabel !== '기술스택' ? 'min-w-max' : ''} absolute z-40 mt-1 overflow-auto rounded-2xl bg-white px-2 shadow-card transition-all duration-500`}
        >
          {children}
        </ul>
      </article>

      {errorMsg && <ErrorMsg msg={errorMsg} className="ml-2" />}
    </OutsideClickContainer>
  );
}
