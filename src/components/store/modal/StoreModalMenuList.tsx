import { StoreMenu } from '@/types/store/storeDto';

import EmptyContent from '@/components/common/EmptyContent';
import StoreModalMenu from '@/components/store/modal/StoreModalMenu';

interface StoreModalMenuListProps {
  menuList: StoreMenu[];
}

export default function StoreModalMenuList({
  menuList,
}: StoreModalMenuListProps) {
  return menuList.length === 0 ? (
    <EmptyContent
      message="메뉴 데이터가 없습니다."
      size="sm"
      className="mt-12 flex w-full justify-center tracking-tight"
    />
  ) : (
    <ul className="flex flex-col gap-5 px-1">
      {menuList.map(menu => (
        <StoreModalMenu key={menu.id} menu={menu} />
      ))}
    </ul>
  );
}
