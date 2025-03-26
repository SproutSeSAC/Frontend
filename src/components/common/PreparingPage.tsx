import { useNavigate } from 'react-router-dom';

import Warning from '@/assets/icons/warning.svg?react';

import SquareButton from '@/components/common/button/SquareButton';

export default function PreparingPage({ className }: { className?: string }) {
  const navigate = useNavigate();

  const onGoHomeClick = () => navigate('/');

  return (
    <div
      className={`flex size-full flex-col items-center justify-center rounded-[80px] bg-white shadow-card ${className}`}
    >
      <Warning className="mb-[1%] h-[50%] max-h-[117px] max-w-[131px] object-cover" />

      <h2 className="mb-[1%] text-[40px] font-semibold">준비중입니다.</h2>

      <SquareButton
        name="홈으로"
        onClick={onGoHomeClick}
        className="mt-[2%] px-8 text-lg font-bold"
      />
    </div>
  );
}
