import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

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
        <BsBell className="mr-6 size-6 stroke-[0.2] font-bold text-gray1" />
        <UserImage className="size-[50px] p-3" />
      </aside>
    </header>
  );
}
