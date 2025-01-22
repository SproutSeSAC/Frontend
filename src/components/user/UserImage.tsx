import { ForwardedRef, ReactNode, forwardRef } from 'react';

import { BsPerson } from 'react-icons/bs';

interface UserImageProps {
  imageNameSegment?: string;
  previewUrl?: string;
  children?: ReactNode;
  className?: string;
}

function UserImage(
  { previewUrl, imageNameSegment, children, className = '' }: UserImageProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={`group relative flex aspect-square size-8 items-center justify-center rounded-full border bg-white ${className}`}
    >
      {previewUrl && (
        <img
          src={previewUrl}
          alt="프로필 이미지"
          className="aspect-square overflow-hidden rounded-full object-cover"
        />
      )}

      {!previewUrl &&
        (imageNameSegment && imageNameSegment !== 'https://aaa.com' ? (
          // NOTE: DB에서 기본값('https://aaa.com') 정리하면 수정.
          <img
            src={`${import.meta.env.VITE_SPROUT_PUBLIC_ASSET_URL}/${imageNameSegment}`}
            alt="프로필 이미지"
            className="aspect-square size-full overflow-hidden rounded-full object-cover"
          />
        ) : (
          <BsPerson className="size-[65%] text-oliveGreen1" />
        ))}

      {children}
    </div>
  );
}

export default forwardRef(UserImage);
