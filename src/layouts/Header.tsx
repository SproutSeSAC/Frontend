import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import { BsBell, BsPerson } from 'react-icons/bs';

interface Props {
  title: string;
  highlight?: string;
  children?: ReactNode;
}

const TitleWithHighlight = ({
  title,
  highlight,
}: {
  title: string;
  highlight: string;
}) => {
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = title.split(regex);

  return parts.map((part: string) =>
    part.toLowerCase() === highlight?.toLowerCase() ? (
      <span key={part} className="text-oliveGreen1">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default function Header({ title, highlight, children }: Props) {
  const { pathname } = useLocation();

  const homePathname = pathname === '/';

  return (
    <header className="mb-6 flex h-[52px] items-center justify-between">
      <section>
        <h1 className="text-2xl font-semibold">
          {highlight ? (
            <TitleWithHighlight title={title} highlight={highlight} />
          ) : (
            title
          )}
        </h1>
        {homePathname && (
          <h2 className="font-semibold text-vividGreen1">
            Seoul Software Academy
          </h2>
        )}
      </section>

      {/* 인풋 */}
      <section>{children}</section>

      <aside className="flex items-center">
        <BsBell className="mr-6 size-6 font-bold text-text" />
        <div className="flex aspect-square w-[50px] items-center justify-center rounded-full border bg-white">
          <BsPerson className="size-7 text-gray2" />
        </div>
      </aside>
    </header>
  );
}
