import { Link, useLocation } from 'react-router-dom';

import Logo from '@/layouts/Logo';
import {
  BsCalendar,
  BsGear,
  BsHouse,
  BsPencilSquare,
  BsPersonFillAdd,
} from 'react-icons/bs';
import { PiForkKnifeBold } from 'react-icons/pi';

export default function NavigationBar() {
  const { pathname } = useLocation();

  const iconStyle = 'w-6 h-6 text-[#bebebe]';

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
      to: '/restaurants',
      icon: <PiForkKnifeBold className={iconStyle} />,
    },
    {
      title: '취업게시판 이동',
      to: '',
      icon: <BsPencilSquare className={iconStyle} />,
    },
    {
      title: '라운지 이동',
      to: '',
      icon: <BsPersonFillAdd className={iconStyle} />,
    },
  ];

  return (
    <nav className="flex w-[100px] flex-col items-center bg-[#F5F5F7] px-5 pb-24 pt-8">
      <Logo />

      <ul className="mb-[40px] mt-[120%] flex w-[60px] flex-col items-center justify-center gap-y-7 rounded-full bg-[#fff] px-4 py-8 shadow-lg">
        {menuList.map(menu => (
          <li key={menu.title}>
            <Link
              to={menu.to}
              title={menu.title}
              className={`flex h-10 w-10 items-center justify-center ${menu.to === pathname && 'rounded-xl border shadow-md [&>svg]:text-[#2B2B2B]'}`}
            >
              {menu.icon}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/mypage"
        title="마이페이지 이동"
        className="mt-auto flex h-8 w-8 items-center justify-center"
      >
        <BsGear className={`${iconStyle} text-[#8C8C8C]`} />
      </Link>
    </nav>
  );
}
