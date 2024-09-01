import { Link, useLocation } from 'react-router-dom';

import NavigationStoreIcon from '@/assets/icon/NavigationStoreIcon';
import Logo from '@/layouts/Logo';
import { BsCalendar, BsGear, BsHouse, BsPersonFillAdd } from 'react-icons/bs';

export default function NavigationBar() {
  const { pathname } = useLocation();

  const iconStyle = 'w-6 h-6 text-gray3';

  const menuList = [
    {
      title: '홈 이동',
      to: '/',
      icon: <BsHouse className={iconStyle} />,
    },
    {
      title: '일정관리 이동',
      to: '/schedule',
      icon: <BsCalendar className={`${iconStyle} p-0.5`} />,
    },
    {
      title: '맛집 이동',
      to: '/stores',
      icon: <NavigationStoreIcon className={iconStyle} />,
    },
    {
      title: '라운지 이동',
      to: '/lounge',
      icon: <BsPersonFillAdd className={iconStyle} />,
    },
  ];

  return (
    <nav className="sticky top-0 flex h-[100vh] w-[100px] flex-col items-center justify-between px-5 pb-[4%] pt-11">
      <Logo />

      <ul className="flex w-[60px] flex-col items-center justify-center gap-y-7 rounded-full bg-white px-4 py-8 shadow-lg">
        {menuList.map(menu => (
          <li key={menu.title}>
            <Link
              to={menu.to}
              title={menu.title}
              className={`flex h-10 w-10 items-center justify-center ${menu.to === pathname && 'rounded-xl border shadow-md [&>svg]:text-text'}`}
            >
              {menu.icon}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/mypage"
        title="마이페이지 이동"
        className="flex h-8 w-8 items-center justify-center"
      >
        <BsGear className="size-6 text-gray1" />
      </Link>
    </nav>
  );
}
