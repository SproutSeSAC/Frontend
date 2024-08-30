import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import { BsBell, BsPerson } from 'react-icons/bs';

import Title from '@/components/common/Title';

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
        <BsBell className="mr-6 size-6 stroke-[0.5px] font-bold text-gray1" />
        <div className="flex aspect-square w-[50px] items-center justify-center rounded-full border bg-white">
          <BsPerson className="size-7 text-gray2" />
        </div>
      </aside>
    </header>
  );
}
