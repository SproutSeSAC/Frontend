import { Link } from 'react-router-dom';

import {
  useGetInfiniteNoticeList,
  useGetThisWeekNoticeList,
} from '@/services/notice/noticeQueries';

import { rolesObj } from '@/constants';
import { NoticeDisplay } from '@/types';
import { getColorByRole } from '@/utils';

import Title from '@/components/common/Title';
import Tag from '@/components/common/tag/Tag';

interface NoticeListSideBoxProps {
  title: '공지사항' | '이번주 공지사항';
}

export default function NoticeListSideBox({ title }: NoticeListSideBoxProps) {
  const { data: thisWeekNoticeList = [] } = useGetThisWeekNoticeList();

  const {
    data = {
      pages: [{ notices: [] }],
    },
  } = useGetInfiniteNoticeList({ page: 1, size: 6 });

  const noticeList: NoticeDisplay[] =
    title === '공지사항' ? data.pages[0].notices : thisWeekNoticeList;

  return (
    <>
      <div className="mb-2 mt-6 flex items-center justify-between">
        <Title title={title} className="!pl-0 text-sm" />
        {title !== '이번주 공지사항' && (
          <Link
            to="/notice"
            className="p-1 text-xs font-semibold text-mainGray"
          >
            더보기
          </Link>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {noticeList?.length !== 0 ? (
          noticeList?.map(({ roleType, noticeId, title: noticeTitle }) => (
            <li key={noticeId}>
              <Link
                to={`/notice/post/${noticeId}` || `${noticeId}`}
                className="flex h-7 w-full items-center gap-1.5"
              >
                <Tag
                  size="big"
                  color={getColorByRole(roleType)}
                  text={rolesObj[roleType]}
                  className="!rounded-md !px-2 font-medium"
                  emphasisText
                />
                <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[17px]">
                  {noticeTitle}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <span className="text-darkGray-active">{title}이 없습니다.</span>
        )}
      </ul>
    </>
  );
}
