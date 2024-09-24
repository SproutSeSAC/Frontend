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
        className="w-[70%] flex-1 object-cover"
      />

      <section className="flex w-[30%] min-w-[300px] flex-col overflow-auto px-[3.5%] py-[6%] scrollbar-hide">
        {children}
      </section>
    </div>
  );
}
