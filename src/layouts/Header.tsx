import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { notificationOpenAtom } from '@/atoms/notificationAtom';

import HeaderMenu from '@/layouts/HeaderMenu';
import { useAtom } from 'jotai';
import { BsBell } from 'react-icons/bs';

import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

interface Props {
  title: string;
  highlight?: string;
  children?: ReactNode;
}

export default function Header({ title, highlight, children }: Props) {
  const { pathname } = useLocation();
  const [, setIsNotificationOpenOpen] = useAtom(notificationOpenAtom);

  const homePathname = pathname === '/';

  const { data: { profileImageUrl } = initialUserProfile } =
    useGetUserProfile();

  return (
    <header className="mb-6 flex h-[52px] items-center justify-between">
      <section>
        <Title as="h1" title={title} highlight={highlight} />
        {homePathname && (
          <h2 className="mt-2 font-semibold text-lightGreen-active">
            Seoul Software Academy
          </h2>
        )}
      </section>

      <section className="flex items-center gap-7">
        <section>{children}</section>

        <aside className="flex items-center">
          <button
            className="relative mr-6 p-1"
            onClick={() => setIsNotificationOpenOpen(prev => !prev)}
          >
            <BsBell className="size-6 stroke-[0.2] font-bold text-darkGray-active" />
            {/* 새로운 알림 시 표시 */}
            <div className="absolute right-0 top-0 size-2 rounded-full border bg-red-500" />
          </button>

          <UserImage className="size-[50px]" imageNameSegment={profileImageUrl}>
            <HeaderMenu />
          </UserImage>
        </aside>
      </section>
    </header>
  );
}
