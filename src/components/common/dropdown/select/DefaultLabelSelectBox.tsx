import { Option } from '@/types';

import Icon from '@/components/common/Icon';
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

interface SelectBoxProps {
  defaultLabel: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSelectBoxClick: () => void;
  errorMsg?: string;
  className?: string;
}

/**
 * SelectBoxPropsBase
 * @param defaultLabel - 드롭다운이 선택되지 않았을 때 버튼에 표시될 기본 레이블입니다. 기본값은 빈 문자열입니다.
 * @param children - Select의 Options을 표시합니다.
 * @param open - 현재 드롭다운의 개폐 상태값입니다.
 * @param onClose - 드롭다운을 열고 닫기 위한 상태 변경 함수입니다.
 * @param onSelectBoxClick - 만약 드롭다운을 열고 닫는 것 이외에도 다른 로직의 함수가 필요하다면 이 props를 이용합니다.
 * @param errorMsg - 폼에 대한 에러메세지. 에러 메세지가 있을경우 에러메세지가 버튼 하단에 표시됩니다.
 * @param className - SelectBox의 스타일을 커스텀할 수 있습니다.
 */

export default function DefaultLabelSelectBox({
  defaultLabel,
  open,
  onClose,
  onSelectBoxClick,
  className,
  children,
  errorMsg,
}: SelectBoxProps) {
  return (
    <OutsideClickContainer onClose={onClose}>
      <div className="relative">
        <button
          type="button"
          onClick={onSelectBoxClick}
          className={`relative flex w-full items-center gap-2 rounded-2xl border [&>svg]:size-6 [&>svg]:min-w-[20px] [&>svg]:text-darkGray ${className} ${errorMsg ? 'border-red-500' : ''} ${className}`}
        >
          <span className="inline-block w-full truncate whitespace-pre">
            {defaultLabel}
          </span>
          {open ? <Icon name="ChevronUp" /> : <Icon name="ChevronDown" />}
        </button>
      </div>

      <article className={defaultLabel === '기술스택' ? '' : 'relative'}>
        <ul
          className={`${open ? 'max-h-64 border border-lightGray' : 'max-h-0'} absolute z-40 mt-1 min-w-full max-w-max overflow-auto rounded-2xl bg-white px-2 shadow-card transition-all duration-500 scrollbar-hide`}
        >
          {children}
        </ul>
      </article>

      {errorMsg && <ErrorMsg msg={errorMsg} className="absolute ml-2" />}
    </OutsideClickContainer>
  );
}
