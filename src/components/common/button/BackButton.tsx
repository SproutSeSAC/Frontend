import { useNavigate } from 'react-router-dom';

import Icon from '@/components/common/Icon';

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const onBackClick = () => {
    return onClick ? onClick() : navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={onBackClick}
      className="flex size-10 h-[38px] w-[38px] items-center justify-center rounded bg-darkGreen-hover text-white"
    >
      <Icon name="ChevronLeft" />
    </button>
  );
}
