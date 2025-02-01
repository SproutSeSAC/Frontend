import { useDialogContext } from '@/hooks';
import { BsTrash } from 'react-icons/bs';

import SquareButton from '@/components/common/button/SquareButton';

interface TrashButtonProps {
  disabled?: boolean;
  className?: string;
  onConfirmClick?: () => void;
}

export default function TrashButton({
  disabled,
  className,
  onConfirmClick,
}: TrashButtonProps) {
  const { hideDialog, alert } = useDialogContext();

  const onDeleteClick = () => {
    alert({
      text: '정말로 삭제하시곘습니까?',
      children: (
        <>
          <SquareButton
            name="취소"
            onClick={hideDialog}
            color="gray"
            type="button"
          />
          <SquareButton
            name="확인"
            onClick={() => {
              if (onConfirmClick) {
                onConfirmClick();
              }
              hideDialog();
            }}
            type="button"
          />
        </>
      ),
    });
  };

  return (
    <button
      type="button"
      aria-label="삭제"
      className={`${disabled ? '' : 'cursor-pointer'} text-darkGray ${className}`}
      onClick={onDeleteClick}
      disabled={disabled}
    >
      <BsTrash className="h-full w-full" />
    </button>
  );
}
