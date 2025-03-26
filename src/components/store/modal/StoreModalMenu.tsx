import { StoreMenu } from '@/types/store/storeDto';

interface StoreModalMenuProps {
  menu: StoreMenu;
}

export default function StoreModalMenu({ menu }: StoreModalMenuProps) {
  return (
    <li className="flex items-center justify-between">
      <h3 className="">{menu.name}</h3>
      <span className="font-semibold tracking-tight">
        {menu.price.toLocaleString()}원
      </span>
    </li>
  );
}
