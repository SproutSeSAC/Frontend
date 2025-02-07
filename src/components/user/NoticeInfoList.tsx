import {
  useGetInfiniteNoticeList,
  useGetThisWeekNoticeList,
} from '@/services/notice/noticeQueries';

import { NoticeDisplay } from '@/types';

import TitleLinkWithRoleTag from '@/components/common/TitleLinkWithRoleTag';

type NoticeTitle = '공지사항' | 'NEW' | '마감임박';

interface NoticeInfoListProps {
  title: NoticeTitle;
  className?: string;
}

export default function NoticeInfoList({
  title,
  className = '',
}: NoticeInfoListProps) {
  const { data: thisWeekNoticeList = [] } = useGetThisWeekNoticeList();

  const { data = { pages: [{ notices: [] }] } } = useGetInfiniteNoticeList({
    page: 1,
    size: 3,
  });

  const noticeObj: { [key in NoticeTitle]: NoticeDisplay[] } = {
    공지사항: data.pages[0].notices,
    마감임박: [],
    NEW: thisWeekNoticeList,
  };

  const notice = noticeObj[title];

  return notice?.length !== 0 ? (
    <ul
      className={`flex h-full w-full flex-col justify-center gap-4 ${className}`}
    >
      {notice?.map(({ roleType, noticeId, title: noticeTitle }) => (
        <li key={noticeId}>
          <TitleLinkWithRoleTag
            to={`/notice/post/${noticeId}` || `${noticeId}`}
            roleType={roleType}
            title={noticeTitle}
          />
        </li>
      ))}
    </ul>
  ) : (
    <span className="text-mainGray-active">{title} 공지사항이 없습니다.</span>
  );
}
