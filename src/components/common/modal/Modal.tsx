import { ReactNode, useEffect } from 'react';

import { createPortal } from 'react-dom';

import { BsX } from 'react-icons/bs';
import { FaChevronLeft } from 'react-icons/fa6';

interface Props {
  onToggleClick: () => void;
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
  headerType?: 'title-xIcon' | 'squareBackBtn-title';
}

export default function Modal({
  onToggleClick,
  title,
  children,
  className,
  headerType = 'title-xIcon',
}: Props) {
  const el = document.getElementById('modal') as Element;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return createPortal(
    <>
      <section
        className={`fixed inset-0 z-40 m-auto h-fit max-h-[80vh] min-h-[180px] w-fit min-w-[350px] overflow-hidden rounded-2xl bg-white ${className}`}
      >
        {headerType === 'title-xIcon' && (
          <header className="flex items-start justify-between p-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              type="button"
              aria-label="모달 닫기"
              onClick={onToggleClick}
            >
              <BsX size={30} />
            </button>
          </header>
        )}

        {headerType === 'squareBackBtn-title' && (
          <header className="flex items-center justify-between p-3">
            <button
              type="button"
              aria-label="접어두기"
              className="flex aspect-square h-10 items-center justify-center rounded-lg border border-gray2 bg-white text-sm text-gray1"
              onClick={onToggleClick}
            >
              <FaChevronLeft />
            </button>
            <h2 className="mr-10 w-full text-center text-lg font-semibold">
              {title}
            </h2>
          </header>
        )}

        <div className="max-h-[58vh] overflow-scroll p-3 scrollbar-hide">
          {children}
        </div>
      </section>

      {/* 오버레이 */}
      <div
        role="presentation"
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onToggleClick();
          }
        }}
        onClick={onToggleClick}
        className="fixed inset-0 z-30 h-[100vh] w-full bg-[rgba(43,43,43,0.6)]"
      />
    </>,
    el,
  );
}
