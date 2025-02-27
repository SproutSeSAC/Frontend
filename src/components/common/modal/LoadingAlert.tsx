import { ReactNode } from 'react';

import { createPortal } from 'react-dom';

import LoopLoading from '@/components/common/LoopLoading';

export interface LoadingAlertProps {
  text: string;
  className?: string;
  children?: ReactNode;
}

export default function LoadingAlert({
  text,
  className,
  children,
}: LoadingAlertProps) {
  const el = document.getElementById('modal') as Element;

  return createPortal(
    <section
      className={`e fixed inset-0 z-[1000] m-auto flex h-fit w-fit min-w-[300px] max-w-[800px] flex-col items-center justify-between ${className}`}
    >
      <LoopLoading />
      <p className="mt-6 rounded-full bg-lightGray-active px-5 py-2 text-lg font-medium shadow-card">
        {text}
      </p>

      {children}
    </section>,
    el,
  );
}
