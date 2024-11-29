import sproutLogo from '@/assets/images/sprout-logo2.png';

interface EmptyContentProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function EmptyContent({
  message = '검색 결과가 없습니다.',
  className,
  size = 'lg',
}: EmptyContentProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img
        src={sproutLogo}
        className={`${size === 'lg' && 'w-24'} ${size === 'md' && 'w-20'} ${size === 'sm' && 'w-16'}`}
        alt="새싹 로고"
      />
      <div
        className={`mt-6 ${(size === 'lg' || size === 'md') && 'text-lg'} ${size === 'sm' && 'text-base'}`}
      >
        {message}
      </div>
    </div>
  );
}
