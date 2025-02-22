import { useCallback } from 'react';

import { Option } from '@/types';

import Icon from '@/components/common/Icon';
import ResetButton from '@/components/common/button/ResetButton';
import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';
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
  onClose: () => void;
  onSelectBoxClick: () => void;
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
 * @param onClose - 드롭다운을 열고 닫기 위한 상태 변경 함수입니다.
 * @param onSelectBoxClick - 만약 드롭다운을 열고 닫는 것 이외에도 다른 로직의 함수가 필요하다면 이 props를 이용합니다.
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
  onClose,
  onSelectBoxClick,
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
      const filteredFullCheckOptions = options.filter(
        option => option.name !== '전체',
      );
      if (filteredFullCheckOptions.length) {
        return (
          <div className="flex w-full gap-1 overflow-hidden">
            <span className="inline-block truncate">
              {filteredFullCheckOptions[0].name}
            </span>
            {filteredFullCheckOptions.length > 1 ? (
              <span className="text-darkGray">
                외 {filteredFullCheckOptions.length - 1}개
              </span>
            ) : (
              ''
            )}
          </div>
        );
      }
      return label;
    },
    [],
  );

  const styleByBoxShape = {
    inputShape: `w-full rounded-2xl bg-white px-4 py-[15px] text-start text-lg`,
    buttonShape:
      'rounded-2xl border border-mainGray bg-bg px-3 py-1 text-darkGray-active',
  };

  const selectBoxStyle = styleByBoxShape[boxShape];

  return (
    <OutsideClickContainer onClose={onClose}>
      <div className="relative">
        <button
          type="button"
          onClick={onSelectBoxClick}
          className={`relative flex w-full items-center gap-4 rounded-2xl border [&>svg]:size-6 [&>svg]:min-w-[20px] [&>svg]:text-darkGray ${selectBoxStyle} ${errorMsg ? 'border-red-500' : ''} ${className}`}
        >
          {isSingleSelect(rest) && (
            <>
              <span
                className={`inline-block w-full truncate whitespace-pre ${boxShape === 'inputShape' && !rest?.selectedOptionLabel && 'text-darkGray'}`}
              >
                {rest?.selectedOptionLabel || defaultLabel}
              </span>
              {open ? <Icon name="ChevronUp" /> : <Icon name="ChevronDown" />}
            </>
          )}

          {isMultiSelect(rest) && (
            <>
              <span
                className={`inline-block w-full truncate whitespace-pre ${boxShape === 'inputShape' && !rest.selectedOptions.length && 'text-mainGray'} ${rest.selectedOptions?.length >= 1 && 'pr-6'}`}
              >
                {getSelectedOptionLabel(rest.selectedOptions, defaultLabel)}
              </span>
              {rest.selectedOptions?.length === 0 &&
                (open ? (
                  <Icon name="ChevronUp" />
                ) : (
                  <Icon name="ChevronDown" />
                ))}
            </>
          )}
        </button>

        {isMultiSelect(rest) && rest.selectedOptions?.length >= 1 && (
          <ResetButton
            onResetClick={rest.onResetClick}
            className={`absolute inset-y-0 ${boxShape === 'inputShape' ? 'right-2' : 'right-1'}`}
          />
        )}
      </div>

      <article className={defaultLabel === '기술스택' ? '' : 'relative'}>
        <ul
          className={`${open ? 'border-lightGrey max-h-64 border' : 'max-h-0'} absolute z-40 mt-1 min-w-full max-w-max overflow-auto rounded-2xl bg-white px-2 shadow-card transition-all duration-500 scrollbar-hide`}
        >
          {children}
        </ul>
      </article>

      {errorMsg && <ErrorMsg msg={errorMsg} className="absolute ml-2" />}
    </OutsideClickContainer>
  );
}
