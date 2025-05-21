import { useDialogContext } from '@/hooks';
import { FaRegTrashAlt } from 'react-icons/fa';

import SquareButton from '@/components/common/button/SquareButton';

interface TrashButtonProps {
  buttonText?: string;
  disabled?: boolean;
  className?: string;
  text?: string;
  subText?: string;
  onClick?: () => void;
  onConfirmClick?: () => void;
}

export default function TrashButton({
  disabled,
  className,
  onConfirmClick,
  buttonText = '',
  text,
  subText,
  onClick,
}: TrashButtonProps) {
  const { hideDialog, alert } = useDialogContext();

  const onDeleteClick = () => {
    alert({
      text: text || '정말로 삭제하시곘습니까?',
      subText,
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
      onClick={onClick || onDeleteClick}
      disabled={disabled}
    >
      {buttonText || <FaRegTrashAlt className="h-full w-full" />}
    </button>
  );
}
