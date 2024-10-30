import { StoreMenu } from '@/types/store/storeDto';

import StoreMenuImage from '@/components/store/StoreMenuImage';

interface StoreModalMenuProps {
  menu: StoreMenu;
}

export default function StoreModalMenu({ menu }: StoreModalMenuProps) {
  return (
    <div className="flex flex-col">
      {menu.imageUrl ? (
        <StoreMenuImage
          width="w-[100px]"
          height="h-[100px]"
          src={menu.imageUrl}
        />
      ) : (
        <div className="h-[100px] w-[100px] rounded-lg bg-gray5" />
      )}

      <h3 className="mt-2">{menu.name}</h3>
      <span className="font-semibold">{menu.price.toLocaleString()}원</span>
    </div>
  );
}
