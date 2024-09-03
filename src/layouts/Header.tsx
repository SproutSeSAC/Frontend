import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import HeaderMenu from '@/layouts/HeaderMenu';
import { BsBell } from 'react-icons/bs';

import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

interface Props {
  title: string;
  highlight?: string;
  children?: ReactNode;
}

export default function Header({ title, highlight, children }: Props) {
  const { pathname } = useLocation();

  const homePathname = pathname === '/';

  return (
    <header className="mb-6 flex h-[52px] items-center justify-between">
      <section>
        <Title as="h1" title={title} highlight={highlight} />
        {homePathname && (
          <h2 className="font-semibold text-oliveGreen2">
            Seoul Software Academy
          </h2>
        )}
      </section>

      {/* 인풋 */}
      <section>{children}</section>

      <aside className="flex items-center">
        <div className="relative mr-6 p-1">
          <BsBell className="size-6 stroke-[0.2] font-bold text-gray1" />
          {/* 새로운 알림 시 표시 */}
          <div className="absolute right-0 top-0 size-2 rounded-full border bg-red-500" />
        </div>

        <UserImage className="size-[50px] p-3">
          <HeaderMenu />
        </UserImage>
      </aside>
    </header>
  );
}
