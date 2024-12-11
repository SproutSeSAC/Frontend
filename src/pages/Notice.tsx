import { useCallback, useMemo, useRef } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useGetInfiniteNoticeList } from '@/services/notice/noticeQueries';

import { noticeCategoryList } from '@/constants';
import { useFilterData, useObserver } from '@/hooks';
import { NoticeDisplay, NoticeFilter, NoticeTabDisplayKey } from '@/types';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import SquareButton from '@/components/common/button/SquareButton';
import SearchInput from '@/components/common/input/SearchInput';
import NoticePostCard from '@/components/notice/NoticePostCard';
import NoticeForm from '@/components/notice/form/NoticeForm';

const initialState: NoticeFilter = {
  page: 1,
  size: 20,
  noticeType: 'ALL',
};

export default function Notice() {
  const [searchParams] = useSearchParams();
  const roleType = searchParams.get('roleType') as NoticeTabDisplayKey;

  const {
    currFilter,
    searchRef,
    handleSearchSubmit,
    handleChangeKeyword,
    handleChangeFilter,
  } = useFilterData<NoticeFilter>({ initialState });

  const observeRef = useRef(null);

  const {
    data = { pages: [{ notices: [], totalPages: 0 }], pageParams: [] },
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useGetInfiniteNoticeList(currFilter);

  const noticeList = useMemo(() => {
    return data?.pages
      .map(item => item.notices)
      ?.reduce<Array<NoticeDisplay>>((acc, arr) => {
        arr?.forEach((obj: NoticeDisplay) => {
          acc.push(obj);
        });

        return acc;
      }, []);
  }, [data?.pages]);

  const onIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        if (hasNextPage) fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );

  useObserver({ onIntersect, target: observeRef, threshold: 0.1 });

  if (roleType === 'EDIT') return <NoticeForm />;
  return (
    <>
      <div className="mt-6 flex items-center gap-10">
        <SearchInput
          name="search"
          ref={searchRef}
          placeholder="찾으시는 공지사항 내용을 입력해 주세요"
          width="w-full"
          height="h-12"
          onChange={handleChangeKeyword}
        />
        <SquareButton
          name="검색하기"
          onClick={handleSearchSubmit}
          className="h-full whitespace-nowrap font-medium"
        />
      </div>

      <ul className="mt-6 flex items-center gap-2.5">
        {noticeCategoryList.map(({ key, name }) => (
          <li
            key={key}
            className={`rounded-2xl ${currFilter.noticeType === key ? 'bg-oliveGreen1 text-white' : 'border border-solid border-gray4 text-gray1'}`}
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

      <div className="pt-32">
        {noticeList.length === 0 && (
          <EmptyContent message="등록된 공지사항이 없습니다." />
        )}
        {isLoading && (
          <div className="flex w-full justify-center py-10">
            <LoopLoading />
          </div>
        )}
      </div>
    </>
  );
}
