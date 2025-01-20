import { useFormContext } from 'react-hook-form';
import { BsCameraFill } from 'react-icons/bs';

interface CameraButtonProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  iconSize?: number;
}

export default function CameraInput({
  onChange,
  className = '',
  iconSize = 4,
}: CameraButtonProps) {
  const { register } = useFormContext();
  return (
    <>
      <input
        type="file"
        id="avatar"
        accept="image/png, image/jpeg, image/ipg"
        className="hidden"
        {...register('profileImageFiles', { onChange })}
      />

      <label
        htmlFor="avatar"
        aria-label="프로필 이미지 수정하기"
        className={`absolute bottom-0 right-0 flex cursor-pointer items-center justify-center rounded-full bg-darkGreen p-2.5 ${className}`}
      >
        <BsCameraFill className={`text-white size-${iconSize}`} />
      </label>
    </>
  );
}
