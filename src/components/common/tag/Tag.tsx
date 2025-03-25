import { PostType } from '@/constants/serviceConstant';
import { RoleKey } from '@/types';
import { BsX } from 'react-icons/bs';

interface TagProps {
  text: string;
  roleType?: RoleKey;
  postType?: keyof PostType;
  color?:
    | 'black'
    | 'green'
    | 'blue'
    | 'yellow'
    | 'purple'
    | 'pink'
    | 'gray'
    | 'grayLight';
  size?: 'small' | 'medium' | 'big';
  onDeleteClick?: () => void;
  className?: string;
}

export default function Tag({
  text,
  roleType,
  postType,
  color,
  size = 'small',
  onDeleteClick,
  className,
}: TagProps) {
  const styleBySize = {
    small: 'text-xs px-1.5 rounded',
    medium: 'text-sm px-2.5 py-1 rounded-md',
    big: 'text-base rounded-lg py-1.5 px-[14px]',
  };

  const colorByRole: { [key in RoleKey]: string } = {
    CAMPUS_LEADER: 'bg-[#FFF3F4] text-[#F5004F]',
    OPERATION_MANAGER: 'bg-[#67B5CC33] text-[#2B768C]',
    EDU_MANAGER: 'bg-[#E8EFFE] text-[#332FD0]',
    INSTRUCTOR: 'bg-[#34D02F33] text-[#1BA416]',
    JOB_COORDINATOR: 'bg-[#FEFAE0] text-[#FF6D28]',
    TRAINEE: '',
    SUPER_ADMIN: 'text-[#6B5FFD] bg-[#eae8ff]',
  };

  const postTypeRole: { [key in keyof PostType]: string } = {
    MEAL: 'bg-[#FFC3E0] text-white',
    NOTICE: 'bg-[#00AC49] text-white',
    PROJECT: 'bg-[#6FA235] text-white',
    STORE: 'bg-[#FFC3E0] text-white',
    STUDY: 'bg-[#67B5CC] text-white',
  };

  const styleByColor = {
    green: 'bg-mainGreen text-white',
    black: 'bg-black text-mainGray',
    gray: 'bg-[#e9e9e9] text-darkGray-active',
    grayLight: 'bg-bg text-black',
    blue: 'bg-mainBlue text-white',
    yellow: 'bg-[#FFE450] text-white',
    pink: 'bg-[#E94159] text-white',
    purple: 'bg-[#6B5FFD] text-white',
  };

  const roleColor = roleType ? colorByRole[roleType] : '';

  const postTypeColor = postType ? postTypeRole[postType] : '';

  const tagColor = color ? styleByColor[color] : '';

  const tagStyle = styleBySize[size];

  return (
    <div
      className={`flex min-w-fit items-center ${tagStyle} ${tagColor} ${postTypeColor} ${roleColor} ${className}`}
    >
      <span className="tracking-tight">{text}</span>

      {onDeleteClick && (
        <button
          type="button"
          onClick={onDeleteClick}
          aria-label={`${text} 태그 삭제하기`}
          className="-mr-1 ml-1"
        >
          <BsX size={22} className={`text-${styleByColor[color || 'black']}`} />
        </button>
      )}
    </div>
  );
}
