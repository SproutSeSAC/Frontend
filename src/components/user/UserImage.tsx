import { ForwardedRef, ReactNode, forwardRef } from 'react';

import { BsPerson } from 'react-icons/bs';

interface UserImageProps {
  profileImageUrl?: string;
  children?: ReactNode;
  className?: string;
}

function UserImage(
  { profileImageUrl, children, className = '' }: UserImageProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={`group relative flex flex-col items-center justify-center rounded-full border bg-oliveGreen3 ${className}`}
    >
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="프로필 이미지" className="" />
      ) : (
        <BsPerson className="h-full w-full text-oliveGreen1" />
      )}
      {children}
    </div>
  );
}

export default forwardRef(UserImage);
