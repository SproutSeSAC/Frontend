import emptyImage from '@/assets/images/empty-image.png';

interface FoodImageProps {
  src: string;
  className?: string;
}

export default function StoreMenuImage({ src, className }: FoodImageProps) {
  return (
    <img
      src={src || emptyImage}
      alt="식당 대표 메뉴 사진"
      className={`overflow-hidden rounded-xl object-cover ${className}`}
    />
  );
}
