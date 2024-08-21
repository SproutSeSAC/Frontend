import { BsHeart, BsHeartFill } from 'react-icons/bs';

interface HeartButtonProps {
  size: number | string;
  isFavorite: boolean;
  onClick: () => void;
}

/**
 * @param size - 버튼의 크기
 * @param isFavorite - 현재 찜한 상태. true면 채워진 하트, false면 빈 하트를 표시
 * @param onClick - 버튼 클릭 시 실행될 콜백 함수
 */
export default function FavoriteButton({
  size,
  isFavorite,
  onClick,
}: HeartButtonProps) {
  return isFavorite ? (
    <BsHeartFill
      size={size}
      color="#6FA235"
      className="cursor-pointer"
      onClick={onClick}
    />
  ) : (
    <BsHeart
      size={size}
      color="#6FA235"
      className="cursor-pointer"
      onClick={onClick}
    />
  );
}
