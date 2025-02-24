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
      <div className="overflow-x-scroll scrollbar-hide [&>ul>*]:flex-shrink-0">
        <ul className={`inline-flex gap-${gap}`}>{children}</ul>
      </div>

      {/* 끝 흐림처리 */}
      {isBlurRight && (
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-white to-70% opacity-90" />
      )}
    </div>
  );
}
