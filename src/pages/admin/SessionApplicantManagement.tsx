import { useMemo, useRef } from 'react';

import { useGetInfiniteSessionNoticeList } from '@/services/post/noticeQueries';

import { useFilterData, useHandleTabNavigation, useObserver } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { NoticeDisplay, NoticeFilter } from '@/types';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import TabNavigation from '@/components/common/TabNavigation';
import SquareButton from '@/components/common/button/SquareButton';
import SearchInput from '@/components/common/input/SearchInput';
import ManagingSessionCardList from '@/components/session/ManagingSessionCardList';

const initialState = {
  page: 1,
  size: 5,
  keyword: '',
};

export default function SessionApplicantManagement() {
  const observeRef = useRef(null);

  const { currFilter, handleChangeKeyword, handleResetKeyword } =
    useFilterData<NoticeFilter>({ initialState });

  const {
    data = {
      pages: [{ notices: [] }],
    },
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteSessionNoticeList(currFilter);

  const runFucAtIntersect = () => {
    if (hasNextPage) fetchNextPage();
  };

  useObserver({ runFucAtIntersect, target: observeRef, threshold: 0.1 });

  const specialLectureNoticeList: NoticeDisplay[] = useMemo(() => {
    return data.pages.map(({ notices }) => notices).flat();
  }, [data?.pages]);

  const { tabName, handleChangeTab } = useHandleTabNavigation();

  const tabList = [
    { text: '전체', type: 'ALL' },
    { text: '모집 중', type: 'ACTIVE' },
    { text: '모집 종료', type: 'END' },
  ];

  return (
    <MainView className="mb-32">
      <Header title="특강 / 행사 신청 현황" />

      <div className="mb-14 flex items-end justify-between">
        <TabNavigation
          tabList={tabList}
          selectValue={tabName ?? 'ALL'}
          onChangeValue={handleChangeTab}
          tabClassName="!pb-3 "
        />

        <div className="flex flex-1 items-center justify-end gap-5">
          <SearchInput
            name="search"
            value={currFilter.keyword}
            placeholder="찾으시는 특강/행사의 내용을 입력해 주세요"
            inputStyle="square"
            onChange={handleChangeKeyword}
            onEnter={() => {}}
            resetChange={handleResetKeyword}
            className="w-[40vw]"
          />
          <SquareButton
            name="검색하기"
            onClick={() => {}}
            className="h-12 font-medium"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <LoopLoading />
        </div>
      )}

      {!isLoading &&
        (specialLectureNoticeList?.length === 0 ? (
          <EmptyContent
            message="공지사항이 없습니다."
            className="h-full pb-20"
          />
        ) : (
          <>
            <ul className="grid grid-cols-3 gap-8">
              {specialLectureNoticeList?.map(notice => (
                <ManagingSessionCardList
                  key={notice.noticeId}
                  notice={notice}
                />
              ))}
            </ul>
            <div ref={observeRef} />
          </>
        ))}
    </MainView>
  );
}
