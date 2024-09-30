import { ReactNode } from 'react';

interface ScrollContainerProps {
  children: ReactNode;
  gap?: number;
}

export default function ScrollContainer({
  children,
  gap = 4,
}: ScrollContainerProps) {
  return (
    <div className="-my-2.5 overflow-x-scroll py-2.5 scrollbar-hide [&>ul>*]:flex-shrink-0">
      <ul className={`flex max-w-0 flex-1 gap-${gap}`}>{children}</ul>
    </div>
  );
}
