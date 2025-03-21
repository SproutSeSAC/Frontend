import { StoreMenu } from '@/types/store/storeDto';

import EmptyContent from '@/components/common/EmptyContent';
import StoreModalMenu from '@/components/store/modal/StoreModalMenu';

interface StoreModalMenuListProps {
  menuList: StoreMenu[];
}

export default function StoreModalMenuList({
  menuList,
}: StoreModalMenuListProps) {
  return (
    <section className="grid grid-cols-3 gap-6">
      {menuList.length === 0 && (
        <EmptyContent
          message="메뉴 데이터가 없습니다."
          size="sm"
          className="mt-8 flex w-full justify-center tracking-tight"
        />
      )}
      {menuList.map(menu => (
        <StoreModalMenu key={menu.id} menu={menu} />
      ))}
    </section>
  );
}
