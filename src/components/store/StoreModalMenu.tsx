import StoreMenuImage from '@/components/store/StoreMenuImage';

export default function StoreModalMenu() {
  return (
    <div className="flex flex-col">
      <StoreMenuImage
        width="w-[100px]"
        height="h-[100px]"
        src="/src/assets/images/food.jpg"
      />

      <h3>메뉴 이름</h3>
      <span className="font-semibold">23,000원</span>
    </div>
  );
}
