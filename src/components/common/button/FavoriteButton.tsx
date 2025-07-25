import { BsHeart, BsHeartFill } from 'react-icons/bs';

interface FavoriteButtonProps {
  size?: number | string;
  isFavorite: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

/**
 * @param size - 버튼의 크기
 * @param isFavorite - 현재 찜한 상태. true면 채워진 하트, false면 빈 하트를 표시
 * @param onClick - 버튼 클릭 시 실행될 콜백 함수
 */
export default function FavoriteButton({
  size = 26,
  isFavorite,
  onClick,
  disabled,
}: FavoriteButtonProps) {
  const iconClassName = 'cursor-pointer mt-0.5 text-mainGreen';

  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {isFavorite ? (
        <BsHeartFill size={size} className={iconClassName} />
      ) : (
        <BsHeart size={size} className={iconClassName} />
      )}
    </button>
  );
}
