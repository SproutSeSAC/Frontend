import { ReactNode, useEffect } from 'react';

import { createPortal } from 'react-dom';

import { BsX } from 'react-icons/bs';

interface Props {
  onToggleClick: () => void;
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  onToggleClick,
  title,
  children,
  className,
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
        className={`fixed inset-0 z-20 m-auto h-fit max-h-[80vh] min-h-[180px] w-fit min-w-[350px] overflow-hidden rounded-2xl bg-white p-8 ${className}`}
      >
        <header className="mb-3 flex items-start justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button type="button" aria-label="모달 닫기" onClick={onToggleClick}>
            <BsX size={30} />
          </button>
        </header>

        <div className="max-h-[58vh] overflow-scroll pt-2 scrollbar-hide">
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
        className="fixed inset-0 z-10 h-[100vh] w-full bg-[rgba(43,43,43,0.6)]"
      />
    </>,
    el,
  );
}
