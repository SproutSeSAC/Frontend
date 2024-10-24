import { StoreMenu } from '@/types/store/storeDto';

import StoreModalMenu from '@/components/store/modal/StoreModalMenu';

interface StoreModalMenuListProps {
  menuList: StoreMenu[];
}

export default function StoreModalMenuList({
  menuList,
}: StoreModalMenuListProps) {
  return (
    <section className="flex flex-wrap gap-9">
      {menuList.map(menu => (
        <StoreModalMenu key={menu.id} menu={menu} />
      ))}
    </section>
  );
}
