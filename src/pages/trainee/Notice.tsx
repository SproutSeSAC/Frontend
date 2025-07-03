import { useMemo, useRef } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useGetInfiniteNoticeList } from '@/services/post/noticeQueries';

import { noticeCategoryList } from '@/constants';
import { useFilterData, useObserver } from '@/hooks';
import { NoticeDisplay, NoticeFilter, NoticeTabDisplayKey } from '@/types';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import SearchInput from '@/components/common/input/SearchInput';
import NoticePostCard from '@/components/notice/NoticePostCard';
import NoticeForm from '@/components/notice/form/NoticeForm';

const initialFilter: NoticeFilter = {
  page: 1,
  size: 10,
  noticeType: 'ALL',
};

export const NOTICE_SEARCH_PARAMS = 'tab';

export default function Notice() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get(NOTICE_SEARCH_PARAMS) as NoticeTabDisplayKey;

  const {
    debouncedFilter,
    currFilter,
    handleChangeKeyword,
    handleChangeFilter,
    handleResetKeyword,
  } = useFilterData<NoticeFilter>({ initialFilter });

  const observeRef = useRef(null);

  const {
    data = {
      pages: [{ notices: [], totalPages: 0 }],
      pageParams: [],
    },
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useGetInfiniteNoticeList(debouncedFilter);

  const noticeList: NoticeDisplay[] = useMemo(() => {
    return data.pages.map(({ notices }) => notices).flat();
  }, [data?.pages]);

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  useObserver({ runFucAtIntersect, target: observeRef, threshold: 0.1 });

  if (tab === 'EDIT') return <NoticeForm />;

  return (
    <>
      <SearchInput
        name="search"
        value={currFilter.keyword}
        placeholder="찾으시는 공지사항 내용을 입력해 주세요"
        onChange={handleChangeKeyword}
        resetChange={handleResetKeyword}
        inputStyle="square"
        className="mt-6 w-full"
      />

      <ul className="mt-6 flex items-center gap-2.5">
        {noticeCategoryList.map(({ key, name }) => (
          <li
            key={key}
            className={`rounded-2xl ${currFilter.noticeType === key ? 'bg-mainGreen text-white' : 'border border-solid border-lightGray bg-lightGray text-darkGray-active'}`}
          >
            <button
              type="button"
              onClick={() => handleChangeFilter({ noticeType: key })}
              className="px-4 py-2.5"
            >
              {name}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4">
        {(noticeList || []).map(notice => {
          return <NoticePostCard key={notice.noticeId} notice={notice} />;
        })}
        <div ref={observeRef} />
      </div>

      {isLoading && (
        <div className="flex w-full justify-center py-10">
          <LoopLoading />
        </div>
      )}

      {noticeList.length === 0 && !isLoading && (
        <EmptyContent
          message={`${tab === 'BOOKMARK' ? '북마크한' : '등록된'} 공지사항이 없습니다.`}
          className="mt-16"
        />
      )}
    </>
  );
}
