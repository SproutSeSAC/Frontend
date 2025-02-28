import {
  useGetInfiniteNoticeList,
  useGetThisWeekNoticeList,
} from '@/services/post/noticeQueries';

import { NoticeDisplay } from '@/types';

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
  const { data: thisWeekNoticeList = [] } = useGetThisWeekNoticeList();

  const { data = { pages: [{ notices: [] }] } } = useGetInfiniteNoticeList({
    page: 1,
    size: 20,
  });

  // const { data: closeSoonNoticeList, isLoading: isCloseSoonNoticeList } =
  //   useGetCloseSoonNoticeList();

  const noticeObj: { [key in NoticeTitle]: NoticeDisplay[] } = {
    공지사항: data.pages[0].notices.slice(0, 4),
    마감임박: [],
    NEW: thisWeekNoticeList,
  }; // NOTE: 데이터 작업 예정

  const noticeDisplayList = noticeObj[title];

  return noticeDisplayList?.length !== 0 ? (
    <ul
      className={`flex h-full w-full flex-col justify-start gap-4 ${className}`}
    >
      {noticeDisplayList
        ?.slice(0, 3)
        ?.map(({ roleType, postId, title: noticeTitle }) => (
          <li key={postId}>
            <TitleLinkWithRoleTag
              to={`/notice/post/${postId}`}
              roleType={roleType}
              title={noticeTitle}
            />
          </li>
        ))}
    </ul>
  ) : (
    <span className="mt-20 flex items-center justify-center text-center text-mainGray-hover">
      곧 새로운 소식이 올라올 예정이에요!
    </span>
  );
}
