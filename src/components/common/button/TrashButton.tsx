import { useDialogContext } from '@/hooks';
import { BsTrash } from 'react-icons/bs';

import SquareButton from '@/components/common/button/SquareButton';

export default function TrashButton() {
  const { hideDialog, alert } = useDialogContext();

  const onDeleteClick = () => {
    alert({
      showDim: true,
      className: 'z-30',
      text: '정말로 삭제하시곘습니까?',
      children: (
        <SquareButton
          name="나가기"
          onClick={hideDialog}
          type="button"
          className="mt-5"
        />
      ),
    });
  };

  return (
    <button
      type="button"
      aria-label="삭제"
      className="cursor-pointer items-end px-1.5 py-2"
      onClick={onDeleteClick}
    >
      <BsTrash className="mt-1 size-5 text-gray2" />
    </button>
  );
}
