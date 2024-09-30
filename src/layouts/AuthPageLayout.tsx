import { ReactNode } from 'react';

import loginBgUrl from '@/assets/images/login-bg.png';

interface Props {
  children: ReactNode;
}

export default function AuthPageLayout({ children }: Props) {
  return (
    <div className="flex h-[100vh] bg-white">
      <img
        src={loginBgUrl}
        alt="로그인 화면 배경 이미지"
        className="w-[68%] object-cover"
      />

      <section className="flex w-[32%] flex-col justify-between overflow-auto px-[3%] py-[8%] scrollbar-hide">
        {children}
      </section>
    </div>
  );
}
