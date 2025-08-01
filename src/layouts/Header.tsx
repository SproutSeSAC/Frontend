import { ReactNode, useState } from 'react';

import { useLocation } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { useGetUnReadNotificationList } from '@/services/notification/notificationQueries';

import {
  notificationOpenAtom,
  notificationServerSentEventAtom,
} from '@/atoms/notificationAtom';

import HeaderMenu from '@/layouts/HeaderMenu';
import { useAtom } from 'jotai';
import { BsBell } from 'react-icons/bs';

import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

interface Props {
  title: string;
  highlight?: string;
  children?: ReactNode;
  subTitleChildren?: ReactNode;
}

export default function Header({
  title,
  highlight,
  children,
  subTitleChildren,
}: Props) {
  const { pathname } = useLocation();
  const [, setIsNotificationOpenOpen] = useAtom(notificationOpenAtom);
  const [isNotificationServerSentEvent, setIsNotificationServerSentEventData] =
    useAtom(notificationServerSentEventAtom);

  const homePathname = pathname === '/' || pathname === '/admin';

  const { data: { profileImageUrl } = initialUserProfile } =
    useGetUserProfile();
  const { data: notificationList } = useGetUnReadNotificationList();
  const [hasEverOpened, setHasEverOpened] = useState(false);

  const openNotificationListTab = () => {
    setHasEverOpened(true);
    setIsNotificationServerSentEventData(false);
    setIsNotificationOpenOpen(prev => !prev);
  };

  const showRedDot =
    isNotificationServerSentEvent ||
    (!hasEverOpened && notificationList?.length !== 0);

  return (
    <header className="mb-10 flex items-start justify-between gap-4">
      <section>
        <Title
          as="h1"
          title={title}
          highlight={highlight}
          className="mb-3 min-w-fit"
        />
        {homePathname && (
          <h2 className="text-lg font-semibold text-[#A2C27D]">
            Seoul Software Academy
          </h2>
        )}

        {subTitleChildren && subTitleChildren}
      </section>

      <section className="flex flex-1 items-center justify-end gap-7">
        {children}

        <aside className="flex items-center">
          <button
            className="relative mr-6 p-1"
            onClick={() => openNotificationListTab()}
          >
            <BsBell className="size-[26px] stroke-[0.3] font-bold text-darkGray-hover" />
            {showRedDot && (
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
