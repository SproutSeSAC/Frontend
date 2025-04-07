import { StoreMenu } from '@/types/store/storeDto';

import EmptyContent from '@/components/common/EmptyContent';

interface StoreMenuListProps {
  menuList: StoreMenu[];
}

export default function StoreMenuList({ menuList }: StoreMenuListProps) {
  return menuList.length === 0 ? (
    <EmptyContent
      message="메뉴 데이터가 없습니다."
      size="sm"
      className="mt-12 flex w-full justify-center tracking-tight"
    />
  ) : (
    <ul className="flex flex-col gap-5 px-1">
      {menuList.map(menu => (
        <li key={menu.id} className="flex items-center justify-between">
          <h3 className="">{menu.name}</h3>
          <span className="font-semibold tracking-tight">
            {menu.price.toLocaleString()}원
          </span>
        </li>
      ))}
    </ul>
  );
}
