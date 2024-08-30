interface FoodImageProps {
  src: string;
}

export default function StoreMenuImage({ src }: FoodImageProps) {
  return (
    <img
      src={src}
      alt="식당 대표 메뉴 사진"
      className="size-[300px] rounded object-cover"
    />
  );
}
