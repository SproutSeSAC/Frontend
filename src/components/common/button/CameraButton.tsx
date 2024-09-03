import { BsCameraFill } from 'react-icons/bs';

interface CameraButtonProps {
  onClick: () => void;
  className?: string;
  iconSize?: number;
}

export default function CameraButton({
  onClick,
  className = '',
  iconSize = 4,
}: CameraButtonProps) {
  return (
    <button
      type="button"
      aria-label="프로필 이미지 수정하기"
      className={`absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-vividGreen1 p-2 ${className}`}
      onClick={onClick}
    >
      <BsCameraFill className={`text-white size-${iconSize}`} />
    </button>
  );
}
