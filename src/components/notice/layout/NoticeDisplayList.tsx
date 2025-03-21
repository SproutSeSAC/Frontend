import {
  useGetCloseSoonNoticeList,
  useGetInfiniteNoticeList,
  useGetThisWeekNoticeList,
} from '@/services/post/noticeQueries';

import { HasAdminRole, NoticeDisplay } from '@/types';

import TitleLinkWithRoleTag from '@/components/common/TitleLinkWithRoleTag';

type NoticeTitle = '공지사항' | 'NEW' | '마감임박';

interface NoticeInfoListProps {
  title: NoticeTitle;
  className?: string;
}

export default function NoticeDisplayList({
  title,
  className = '',
}: NoticeInfoListProps) {
  const {
    data: thisWeekNoticeList = [],
    isLoading: isInfiniteNoticListLoading,
  } = useGetThisWeekNoticeList();

  const {
    data = {
      pages: [{ notices: [] }],
    },
    isLoading: isInfiniteNoticeListLoading,
  } = useGetInfiniteNoticeList({ page: 1, size: 4 });

  const {
    data: closeSoonNoticeList = [],
    isLoading: isCloseSoonNoticeList, //
  } = useGetCloseSoonNoticeList({ size: 4, days: 7 });

  const isLoading =
    isCloseSoonNoticeList ||
    isInfiniteNoticeListLoading ||
    isInfiniteNoticListLoading;

  const noticeObj: {
    [key in NoticeTitle]: (NoticeDisplay & {
      manager?: { role: keyof HasAdminRole };
    })[];
  } = {
    공지사항: data.pages[0].notices,
    마감임박: closeSoonNoticeList,
    NEW: thisWeekNoticeList,
  };

  const noticeDisplayList = noticeObj[title];

  return (
    !isLoading &&
    (noticeDisplayList?.length !== 0 ? (
      <ul
        className={`flex h-full w-full flex-col justify-start gap-4 ${className}`}
      >
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
