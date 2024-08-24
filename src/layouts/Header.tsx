import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import { BsBell, BsPerson } from 'react-icons/bs';

interface Props {
  title: string;
  highlight?: string;
  children?: ReactNode;
}

const TitleWithHighlight = ({
  parts,
  highlight,
}: {
  parts: string[];
  highlight: string;
}) => {
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

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = title.split(regex);

  return (
    <header className="mb-6 flex h-[52px] items-center justify-between">
      <section>
        <h1 className="text-2xl font-semibold">
          {highlight ? (
            <TitleWithHighlight parts={parts} highlight={highlight} />
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
        <BsBell className="mr-6 h-6 w-6 font-bold text-text" />
        <div className="flex aspect-square w-[50px] items-center justify-center rounded-full border bg-white">
          <BsPerson className="h-7 w-7 text-gray2" />
        </div>
      </aside>
    </header>
  );
}
