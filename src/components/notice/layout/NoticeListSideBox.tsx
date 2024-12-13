import { Link } from 'react-router-dom';

import { useGetThisWeekNoticeList } from '@/services/notice/noticeQueries';

import { RolesObj } from '@/constants';
import { getColorByRole } from '@/utils';

import Title from '@/components/common/Title';
import Tag from '@/components/common/tag/Tag';

interface NoticeListSideBoxProps {
  title: '공지사항' | '이번주 공지사항';
}

export default function NoticeListSideBox({ title }: NoticeListSideBoxProps) {
  const { data: thisWeekNoticeList = [] } = useGetThisWeekNoticeList();

  return (
    <>
      <div className="mb-2 mt-6 flex items-center justify-between">
        <Title title={title} className="!pl-0 text-sm" />
        {title !== '이번주 공지사항' && (
          <Link to="/notice" className="p-1 text-xs font-semibold text-gray2">
            더보기
          </Link>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {thisWeekNoticeList.length !== 0 ? (
          thisWeekNoticeList.map(
            ({ roleType, noticeId, title: noticeTitle }) => (
              <li key={noticeId}>
                <Link
                  to={`/notice/post/${noticeId}` || `${noticeId}`}
                  className="flex h-7 w-full items-center gap-1.5"
                >
                  <Tag
                    size="big"
                    color={getColorByRole(roleType)}
                    text={RolesObj[roleType]}
                    className="!rounded-md !px-2 font-medium"
                    emphasisText
                  />
                  <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[17px]">
                    {noticeTitle}
                  </p>
                </Link>
              </li>
            ),
          )
        ) : (
          <span className="text-gray1">이번주 공지사항이 없습니다.</span>
        )}
      </ul>
    </>
  );
}
