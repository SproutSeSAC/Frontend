import { postTypeObj } from '@/constants';
import { AppliedSessionStatusKey, RoleKey, SessionStatusKey } from '@/types';
import { BsX } from 'react-icons/bs';

export type PostType = typeof postTypeObj;

export type TagColor =
  | 'black'
  | 'green'
  | 'lightGreen'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'gray'
  | 'grayLight';

export type StatusKey = AppliedSessionStatusKey | SessionStatusKey;

interface TagProps {
  text: string;
  roleKey?: RoleKey;
  postKey?: keyof PostType;
  statusKey?: StatusKey;
  color?: TagColor;
  size?: 'small' | 'medium' | 'big';
  onDeleteClick?: () => void;
  className?: string;
}

export default function Tag({
  text,
  roleKey,
  postKey,
  statusKey,
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
  const tagSize = styleBySize[size];

  // 기본 태그 색상
  const styleByColor = {
    green: 'bg-mainGreen text-white',
    lightGreen: 'bg-lightGreen text-mainGreen-active',
    black: 'bg-black text-mainGray',
    gray: 'bg-[#e9e9e9] text-darkGray-active',
    grayLight: 'bg-bg text-black',
    blue: 'bg-mainBlue text-white',
    yellow: 'bg-[#FFE450] text-white',
    pink: 'bg-[#E94159] text-white',
    purple: 'bg-[#6B5FFD] text-white',
  };

  // 롤별 색상
  const styleByRole: { [key in RoleKey]: string } = {
    CAMPUS_LEADER: 'bg-[#FFF3F4] text-[#F5004F]',
    OPERATION_MANAGER: 'bg-[#67B5CC33] text-[#2B768C]',
    EDU_MANAGER: 'bg-[#E8EFFE] text-[#332FD0]',
    INSTRUCTOR: 'bg-[#34D02F33] text-[#1BA416]',
    JOB_COORDINATOR: 'bg-[#FEFAE0] text-[#FF6D28]',
    TRAINEE: 'text-[#678771] bg-[#e0f8df]',
    SUPER_ADMIN: 'text-[#6B5FFD] bg-[#eae8ff]',
  };

  // 포스트별 색상
  const styleByPost: { [key in keyof PostType]: string } = {
    MEAL: 'bg-[#FFC3E0] text-white',
    NOTICE: 'bg-[#00AC49] text-white',
    PROJECT: 'bg-[#6FA235] text-white',
    STORE: 'bg-[#FFC3E0] text-white',
    STUDY: 'bg-[#67B5CC] text-white',
  };

  // 상태별 색상
  const styleByStatus: { [key in StatusKey]: string } = {
    ACTIVE: 'bg-red-400/15 !text-red-400',
    INACTIVE: 'bg-darkGray/20 !text-darkGray-hover',
    END: 'bg-darkGray/20 !text-darkGray-hover',
    WAIT: 'bg-red-400/15 !text-red-400',
    PARTICIPANT: 'bg-mainGreen/20 !text-darkGreen',
    REJECT: '!bg-mainBlue/30 !text-mainBlue-active',
    UNKNOWN: 'bg-darkGray/20 !text-darkGray-hover',
  };

  const roleStyle = roleKey ? styleByRole[roleKey] : '';
  const postTypeStyle = postKey ? styleByPost[postKey] : '';
  const statusStyle = statusKey ? styleByStatus[statusKey] : '';
  const colorStyle = color ? styleByColor[color] : '';

  return (
    <div
      className={`flex min-w-fit items-center ${colorStyle} ${tagSize} ${postTypeStyle} ${roleStyle} ${statusStyle} ${className}`}
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
