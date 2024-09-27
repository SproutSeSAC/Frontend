import { BsHeart, BsHeartFill } from 'react-icons/bs';

interface FavoriteButtonProps {
  size?: number | string;
  isFavorite: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
}: FavoriteButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      {isFavorite ? (
        <BsHeartFill size={size} className="cursor-pointer text-oliveGreen1" />
      ) : (
        <BsHeart size={size} className="cursor-pointer text-oliveGreen1" />
      )}
    </button>
  );
}
