import { ForwardedRef, ReactNode, forwardRef } from 'react';

import { BsPerson } from 'react-icons/bs';

interface UserImageProps {
  imgUrl?: string;
  children?: ReactNode;
  className?: string;
}

function UserImage(
  { imgUrl, children, className = '' }: UserImageProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={`group relative flex aspect-square size-8 items-center justify-center rounded-full bg-oliveGreen3 ${className}`}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="프로필 이미지"
          className="aspect-square overflow-hidden rounded-full object-cover"
        />
      ) : (
        <BsPerson className="size-[65%] text-oliveGreen1" />
      )}
      {children}
    </div>
  );
}

export default forwardRef(UserImage);
