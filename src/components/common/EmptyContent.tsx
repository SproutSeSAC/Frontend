interface EmptyContentProps {
  message?: string;
  className?: string;
}

export default function EmptyContent({
  message = '검색 결과가 없습니다.',
  className,
}: EmptyContentProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img
        src="src/assets/images/sprout-logo2.png"
        className="w-24"
        alt="새싹 로고"
      />
      <div className="mt-6 text-lg">{message}</div>
    </div>
  );
}
