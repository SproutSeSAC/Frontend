import { Link, useLocation } from 'react-router-dom';

import LoungeIcon from '@/assets/icons/bi_person-fill-add.svg?react';
import StoreIcon from '@/assets/icons/fluent_food-20-filled.svg?react';
import NoticeIcon from '@/assets/icons/icon-park-solid-volume-notice.svg?react';
import CalendarIcon from '@/assets/icons/majesticons-calendar.svg?react';
import HomeIcon from '@/assets/icons/material-symbols-light-home.svg?react';
import Logo from '@/layouts/Logo';

export default function NavigationBar() {
  const { pathname } = useLocation();

  const iconStyle = 'size-10';

  const menuList = [
    {
      title: '홈 이동',
      to: '/',
      icon: (
        <HomeIcon
          className={`${iconStyle} ${pathname === '/' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '일정관리 이동',
      to: '/schedule',
      icon: (
        <CalendarIcon
          className={`${iconStyle} ${pathname === '/schedule' ? 'stroke-mainGreen [&>path:first-child]:fill-mainGreen' : 'stroke-mainGray [&>path:first-child]:fill-mainGray'}`}
        />
      ),
    },
    {
      title: '맛집 이동',
      to: '/stores',
      icon: (
        <StoreIcon
          className={`${iconStyle} ${pathname === '/stores' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '라운지 이동',
      to: '/lounge',
      icon: (
        <LoungeIcon
          className={`${iconStyle} ${pathname === '/lounge' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '공지사항 이동',
      to: '/notice',
      icon: (
        <NoticeIcon
          className={`${iconStyle} size-9 ${pathname === '/notice' ? 'stroke-mainGreen [&>path:first-child]:fill-mainGreen' : 'stroke-mainGray [&>path:first-child]:fill-mainGray'}`}
        />
      ),
    },
  ];

  return (
    <nav className="sticky top-[60px] flex h-fit min-w-[130px] flex-col items-center justify-between px-5">
      <ul className="flex w-[62px] flex-col items-center justify-center gap-y-[5vh] rounded-[20px] bg-white px-4 pb-20 pt-5 shadow-lg">
        <Logo size="small" />
        {menuList.map(menu => (
          <li key={menu.title}>
            <Link
              to={menu.to}
              title={menu.title}
              className="flex size-10 items-center justify-center"
            >
              {menu.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
