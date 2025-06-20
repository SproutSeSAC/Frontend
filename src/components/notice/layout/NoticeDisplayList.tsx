import {
  useGetCloseSoonNoticeList,
  useGetThisWeekNoticeList,
} from '@/services/post/noticeQueries';

import { HasAdminRole, NoticeDisplay } from '@/types';

import TitleLinkWithRoleTag from '@/components/common/TitleLinkWithRoleTag';

type NoticeTitle = 'NEW' | '마감임박';

interface NoticeInfoListProps {
  title: NoticeTitle;
  className?: string;
}

export default function NoticeDisplayList({
  title,
  className = '',
}: NoticeInfoListProps) {
  const {
    data: closeSoonNoticeList = [],
    isLoading: isCloseSoonNoticeList, //
  } = useGetCloseSoonNoticeList({ size: 4, days: 7 });

  const {
    data: thisWeekNoticeList = [],
    isLoading: isInfiniteNoticListLoading,
  } = useGetThisWeekNoticeList();

  const noticeObj: {
    [key in NoticeTitle]: (NoticeDisplay & {
      manager?: { role: keyof HasAdminRole };
    })[];
  } = {
    마감임박: closeSoonNoticeList,
    NEW: thisWeekNoticeList,
  };

  const noticeDisplayList = noticeObj[title];

  const isLoading = isCloseSoonNoticeList || isInfiniteNoticListLoading;

  return (
    !isLoading &&
    (noticeDisplayList?.length !== 0 ? (
      <ul className={`flex h-full flex-col justify-start gap-4 ${className}`}>
        {noticeDisplayList
          ?.slice(0, 4)
          ?.map(
            ({ roleType, manager, noticeId, postId, title: noticeTitle }) => (
              <li key={noticeId}>
                <TitleLinkWithRoleTag
                  to={`/notice/post/${postId}`}
                  roleType={
                    title === '마감임박' && manager ? manager.role : roleType
                  }
                  title={noticeTitle}
                />
              </li>
            ),
          )}
      </ul>
    ) : (
      <span className="mt-14 flex items-center justify-center text-center text-mainGray-hover">
        곧 새로운 소식이 올라올 예정이에요!
      </span>
    ))
  );
}
