interface FoodImageProps {
  width: string;
  height: string;
  src: string;
}

export default function StoreMenuImage({ width, height, src }: FoodImageProps) {
  return (
    <img
      src={src}
      alt="식당 대표 메뉴 사진"
      className={`${width} ${height} rounded-lg object-cover`}
    />
  );
}
