import { ReactNode } from 'react';

import { createPortal } from 'react-dom';

export interface AlertProps {
  children: ReactNode;
  text: string;
  subText?: string;
  className?: string;
}

export default function Alert({
  className,
  children,
  text,
  subText,
}: AlertProps) {
  const el = document.getElementById('modal') as Element;

  return createPortal(
    <>
      <section
        className={`fixed inset-0 z-40 m-auto flex h-fit w-fit min-w-[300px] flex-col items-center justify-between rounded-2xl bg-white p-8 shadow-card ${className}`}
      >
        <p className="text-center text-lg font-semibold">{text}</p>
        <p className="text-center text-sm text-gray2">{subText}</p>
        <div className="flex items-center gap-2">{children}</div>
      </section>

      {/* 오버레이 */}
      <div
        role="presentation"
        className="fixed inset-0 z-30 h-[100vh] w-full"
      />
    </>,
    el,
  );
}
