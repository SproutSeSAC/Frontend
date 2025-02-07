import { ReactNode } from 'react';

interface ScrollContainerProps {
  children: ReactNode;
  gap?: number;
  isBlurRight?: boolean;
}

export default function ScrollContainer({
  children,
  gap = 4,
  isBlurRight = false,
}: ScrollContainerProps) {
  return (
    <div className="relative">
      <div className="-my-2.5 overflow-x-scroll py-2.5 scrollbar-hide [&>ul>*]:flex-shrink-0">
        <ul className={`flex max-w-0 flex-1 gap-${gap}`}>{children}</ul>
      </div>

      {/* 끝 흐림처리 */}
      {isBlurRight && (
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-white to-70% opacity-90" />
      )}
    </div>
  );
}
