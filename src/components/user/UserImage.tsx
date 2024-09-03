import { ReactNode } from 'react';

import { BsPerson } from 'react-icons/bs';

interface UserImageProps {
  children?: ReactNode;
  className?: string;
}

export default function UserImage({
  children,
  className = '',
}: UserImageProps) {
  return (
    <div
      className={`group relative flex flex-col items-center justify-center rounded-full border bg-oliveGreen3 ${className}`}
    >
      <BsPerson className="h-full w-full text-oliveGreen1" />
      {children}
    </div>
  );
}
