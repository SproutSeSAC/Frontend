import { Link, useLocation } from 'react-router-dom';

import LoungeIcon from '@/assets/icons/bi_person-fill-add.svg?react';
import ContentsManagementIcon from '@/assets/icons/contents-management.svg?react';
import CourseManagementIcon from '@/assets/icons/course-management.svg?react';
import StoreIcon from '@/assets/icons/fluent_food-20-filled.svg?react';
import NoticeIcon from '@/assets/icons/icon-park-solid-volume-notice.svg?react';
import CalendarIcon from '@/assets/icons/majesticons-calendar.svg?react';
import HomeIcon from '@/assets/icons/material-symbols-light-home.svg?react';
import NoticeManagementIcon from '@/assets/icons/notice-management.svg?react';
import UserManagementIcon from '@/assets/icons/user-management.svg?react';
import Logo from '@/layouts/Logo';

interface NavigationBarProps {
  type: 'admin' | 'trainee';
}

export default function NavigationBar({ type }: NavigationBarProps) {
  const { pathname } = useLocation();

  const iconStyle = 'size-10';

  const traineeMenuList = [
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

  const adminMenuList = [
    {
      title: '홈 이동',
      to: '/admin',
      icon: (
        <HomeIcon
          className={`${iconStyle} ${pathname === '/admin' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '사용자 관리 이동',
      to: '/admin/user',
      icon: (
        <UserManagementIcon
          className={`${iconStyle} p-0.5 ${pathname === '/admin/user' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '교육과정 관리 이동',
      to: '/admin/course',
      icon: (
        <CourseManagementIcon
          className={`${iconStyle} p-0.5 ${pathname === '/admin/course' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },

    {
      title: '콘텐츠 관리 이동',
      to: '/admin/content',
      icon: (
        <ContentsManagementIcon
          className={`${iconStyle} p-0.5 ${pathname === '/admin/content' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '특강 / 행사 신청 현황 이동',
      to: '/admin/applicants-status',
      icon: (
        <NoticeManagementIcon
          className={`${iconStyle} ${pathname.includes('/admin/applicants-status') ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
  ];

  const menuList = {
    admin: adminMenuList,
    trainee: traineeMenuList,
  };

  const linkTo = {
    admin: '/admin',
    trainee: '/',
  };

  return (
    <nav className="sticky top-[60px] flex h-fit min-w-[130px] flex-col items-center justify-between px-5">
      <ul className="flex w-[62px] flex-col items-center justify-center gap-y-[5vh] rounded-[20px] bg-white px-4 pb-20 pt-5 shadow-lg">
        <Link to={linkTo[type]} title="홈 이동">
          <Logo size="small" />
        </Link>
        {menuList[type].map(menu => (
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
