import { ReactNode } from 'react';

interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
  isBlurRight?: boolean;
}

export default function ScrollContainer({
  children,
  className,
  isBlurRight = false,
}: ScrollContainerProps) {
  return (
    <div className="relative">
      <div className="overflow-x-scroll scrollbar-hide [&>ul>*]:flex-shrink-0">
        <ul className={`inline-flex max-w-0 ${className}`}>
          {children}
          <div className="w-10" />
        </ul>
      </div>

      {/* 끝 흐림처리 */}
      {isBlurRight && (
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-white to-70% opacity-90" />
      )}
    </div>
  );
}
