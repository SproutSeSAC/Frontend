import { BsX } from 'react-icons/bs';

interface TagProps {
  text: string;
  color?:
    | 'black'
    | 'green'
    | 'gray'
    | 'olivegreen'
    | 'blue'
    | 'yellow'
    | 'purple'
    | 'pink';
  size?: 'small' | 'medium' | 'big';
  onDeleteClick?: () => void;
  className?: string;
}

export default function Tag({
  text,
  color = 'black',
  size = 'small',
  onDeleteClick,
  className,
}: TagProps) {
  const styleBySize = {
    small: 'text-xs px-1.5 rounded',
    medium: 'text-sm px-2.5 rounded-md',
    big: 'px-3.5 rounded-lg font-semibold',
  };

  const styleByColor = {
    green: 'bg-vividGreen1 text-gray4 ',
    olivegreen: 'bg-oliveGreen1 text-white',
    black: 'bg-text text-gray3',
    gray: 'bg-gray4 text-text',
    blue: 'bg-skyBlue1 text-white',
    yellow: 'bg-[#FFE450] text-white',
    pink: 'bg-[#E94159] text-white',
    purple: 'bg-[#6B5FFD] text-white',
  };

  const tagStyle = styleBySize[size];

  const colorStyle = styleByColor[color];

  return (
    <div
      className={`flex min-w-fit items-center py-0.5 ${tagStyle} ${colorStyle} ${className}`}
    >
      <span>{text}</span>

      {onDeleteClick && (
        <button
          type="button"
          onClick={onDeleteClick}
          aria-label={`${text} 태그 삭제하기`}
          className="-mr-1 ml-1"
        >
          <BsX size={22} className={`text-${styleByColor[color]}`} />
        </button>
      )}
    </div>
  );
}
