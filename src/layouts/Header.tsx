import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import { BsBell } from 'react-icons/bs';

interface Props {
  title: string;
  children?: ReactNode;
}

export default function Header({ title, children }: Props) {
  const { pathname } = useLocation();

  const homePathname = pathname === '/';

  return (
    <header className="mb-6 flex h-[52px] items-center justify-between">
      <section>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {homePathname && (
          <h2 className="font-[roboto] font-bold text-lime-500">
            Seoul Software Academy
          </h2>
        )}
      </section>

      {/* 인풋 */}
      <section>{children}</section>

      <aside className="flex items-center">
        <BsBell className="mr-6 h-6 w-6 font-bold text-[#2B2B2B]" />
        <div className="aspect-square w-[50px] rounded-full border bg-black" />
      </aside>
    </header>
  );
}
