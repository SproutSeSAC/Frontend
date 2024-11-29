import { useSearchParams } from 'react-router-dom';

import { noticeCategoryFilterList } from '@/constants';
import { useFilterData } from '@/hooks';
import { KeyOfNoticeTabKind, NoticeFilter } from '@/types';

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
  const noticeType = searchParams.get('noticeType') as KeyOfNoticeTabKind;

  const {
    currFilter,
    searchRef,
    handleSearchSubmit,
    handleChangeKeyword,
    handleChangeFilter,
  } = useFilterData<NoticeFilter>({ initialState });

  if (noticeType === 'EDIT') return <NoticeForm />;

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
        {noticeCategoryFilterList.map(({ key, name }) => (
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
        {Array.from({ length: 5 }, (_, index) => (
          <NoticePostCard key={index + 1} />
        ))}
      </div>
    </>
  );
}
