import { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { useGetUnReadNotificationList } from '@/services/notification/notificationQueries';

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
  const { data: notificationList } = useGetUnReadNotificationList();

  return (
    <header className="mb-10 flex items-center justify-between">
      <section>
        <Title as="h1" title={title} highlight={highlight} className="mb-3" />
        {homePathname && (
          <h2 className="text-lg font-semibold text-[#A2C27D]">
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
            <BsBell className="size-[26px] stroke-[0.3] font-bold text-darkGray-hover" />
            {notificationList?.length !== 0 && (
              <div className="absolute right-0 top-0.5 size-2 rounded-full border bg-red-500" />
            )}
          </button>

          <UserImage className="size-[50px]" imageNameSegment={profileImageUrl}>
            <HeaderMenu />
          </UserImage>
        </aside>
      </section>
    </header>
  );
}
