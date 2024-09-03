import { BsX } from 'react-icons/bs';

interface TagProps {
  text: string;
  color?: 'black' | 'green' | 'gray';
  size?: 'small' | 'medium' | 'big';
  onDeleteClick?: () => void;
}

export default function Tag({
  text,
  color = 'black',
  size = 'small',
  onDeleteClick,
}: TagProps) {
  const styleBySize = {
    small: 'text-xs px-1.5 rounded',
    medium: 'text-sm px-2.5 rounded-md',
    big: 'px-3.5 rounded-lg font-semibold',
  };

  const styleByColor = {
    green: 'bg-oliveGreen1 text-white',
    black: 'bg-text text-gray3',
    gray: 'bg-gray4 text-text',
  };

  const tagStyle = styleBySize[size];

  const colorStyle = styleByColor[color];

  return (
    <div className={`flex items-center py-0.5 ${tagStyle} ${colorStyle}`}>
      <span>{text}</span>

      {onDeleteClick && (
        <button
          type="button"
          onClick={() => {}}
          aria-label={`${text} 태그 삭제하기`}
          className="-mr-1 ml-1"
        >
          <BsX size={22} className="text-oliveGreen2" />
        </button>
      )}
    </div>
  );
}
