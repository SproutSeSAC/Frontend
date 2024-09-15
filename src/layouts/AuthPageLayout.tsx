import { ReactNode } from 'react';

import loginBgUrl from '@/assets/images/login-bg.png';

interface Props {
  children: ReactNode;
}

export default function AuthPageLayout({ children }: Props) {
  return (
    <div className="flex h-[100vh]">
      <img
        src={loginBgUrl}
        alt="로그인 화면 배경 이미지"
        className="w-[70%] flex-1 object-cover"
      />

      <section className="h-full w-[30%] min-w-[300px] overflow-auto border border-black px-[3%] py-[6%]">
        <img
          src="/sprout_logo.png"
          alt="sprout 로고"
          className="mb-[15%] h-10 w-10"
        />

        {children}
      </section>
    </div>
  );
}
