import emptyImage from '@/assets/images/empty-image.png';

interface FoodImageProps {
  width: string;
  height: string;
  src: string;
}

export default function StoreMenuImage({ width, height, src }: FoodImageProps) {
  return (
    <img
      src={src || emptyImage}
      alt="식당 대표 메뉴 사진"
      className={`${width} ${height} overflow-hidden rounded-xl object-cover`}
    />
  );
}
