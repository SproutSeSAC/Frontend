import { Link, useLocation } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import NoticeIcon from '@/assets/icons/notice.svg?react';
import StoreIcon from '@/assets/icons/store.svg?react';
import Logo from '@/layouts/Logo';
import { isAdmin } from '@/utils';
import { BsCalendar, BsHouse, BsPersonFillAdd } from 'react-icons/bs';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

export default function NavigationBar() {
  const { data: { role } = initialUserProfile } = useGetUserProfile();

  const { pathname } = useLocation();

  const iconStyle = 'size-6 text-gray3';

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
      icon: <StoreIcon className={`${iconStyle} size-9`} />,
    },
    {
      title: '라운지 이동',
      to: '/lounge',
      icon: <BsPersonFillAdd className={iconStyle} />,
    },
    {
      title: '공지사항 이동',
      to: '/notice',
      icon: <NoticeIcon className={`${iconStyle} `} />,
    },
  ];

  return (
    <nav className="sticky top-0 flex h-[100vh] w-[100px] flex-col items-center justify-between px-5 pb-[4%] pt-11">
      <Logo />

      <div className="mt-[70%] flex-1">
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

          {isAdmin(role) && (
            <li>
              <Link
                to="/admin"
                title="관리자 페이지 이동"
                className={`flex h-10 w-10 items-center justify-center ${pathname === '/admin' && 'rounded-xl border shadow-md [&>svg]:text-text'}`}
              >
                <MdOutlineAdminPanelSettings
                  className={`${iconStyle} size-4`}
                />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
