import { BsTrash } from 'react-icons/bs';

export default function TrashButton() {
  const onDeleteClick = () => {
    alert('정말로 삭제하시겠습니까?');
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
