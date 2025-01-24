import { BsX } from 'react-icons/bs';

interface TagProps {
  text: string;
  color?: 'black' | 'green' | 'gray' | 'blue' | 'yellow' | 'purple' | 'pink';
  size?: 'small' | 'medium' | 'big';
  onDeleteClick?: () => void;
  className?: string;
  emphasisText?: boolean;
  storeTag?: boolean;
}

export default function Tag({
  text,
  color = 'black',
  size = 'small',
  onDeleteClick,
  className,
  emphasisText,
  storeTag = false,
}: TagProps) {
  const styleBySize = {
    small: 'text-xs px-1.5 rounded',
    medium: 'text-sm px-2.5 rounded-md',
    big: 'px-3.5 rounded-lg font-semibold',
  };

  const styleByColor = {
    green: 'bg-mainGreen text-white ',
    black: 'bg-black text-mainGray',
    gray: 'bg-lightGrey-hover text-black',
    blue: emphasisText
      ? 'bg-[#E8EFFE] text-[#332FD0]'
      : 'bg-mainBlue text-white',
    yellow: emphasisText
      ? 'bg-[#FEFAE0] text-[#FF6D28]'
      : 'bg-[#FFE450] text-white',
    pink: emphasisText
      ? 'bg-[#FFF3F4] text-[#F5004F]'
      : 'bg-[#E94159] text-white',
    purple: emphasisText
      ? 'text-[#6B5FFD] bg-[#eae8ff]'
      : 'bg-[#6B5FFD] text-white',
  };

  const storeTagStyle = `whitespace-nowrap h-[29px] justify-start items-center gap-[11px] inline-flex px-3.5 py-1.5 bg-[#f5f5f7] rounded-lg justify-center items-center gap-2.5 text-[#2a2a2a] text-sm font-normal font-['Pretendard Variable']`;

  const tagStyle = styleBySize[size];
  const colorStyle = styleByColor[color];

  return (
    <div
      className={`${
        storeTag
          ? storeTagStyle
          : `flex min-w-fit items-center py-0.5 ${tagStyle} ${colorStyle}`
      } ${className}`}
    >
      <span>{text}</span>
      {onDeleteClick && (
        <button
          type="button"
          onClick={onDeleteClick}
          aria-label={`${text} 태그 삭제하기`}
          className={storeTag ? 'text-[#2a2a2a]' : '-mr-1 ml-1'}
        >
          <BsX size={22} className={`text-${styleByColor[color]}`} />
        </button>
      )}
    </div>
  );
}
