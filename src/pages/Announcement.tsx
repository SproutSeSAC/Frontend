import { useSearchParams } from 'react-router-dom';

import { announcementCategoryFilterList } from '@/constants/announcement';
import { useFilterData } from '@/hooks';
import { AnnouncementFilter, KeyOfAnnouncementTabKind } from '@/types';

import AnnouncementPostCard from '@/components/announcement/AnnouncementPostCard';
import AnnouncementForm from '@/components/announcement/form/AnnouncementForm';
import SquareButton from '@/components/common/button/SquareButton';
import SearchInput from '@/components/common/input/SearchInput';

const initialState: AnnouncementFilter = {
  page: 1,
  size: 20,
  announcementType: 'ALL',
};

export default function Announcement() {
  const [searchParams] = useSearchParams();
  const noticeType = searchParams.get('noticeType') as KeyOfAnnouncementTabKind;

  const {
    currFilter,
    searchRef,
    handleSearchSubmit,
    handleChangeKeyword,
    handleChangeFilter,
  } = useFilterData<AnnouncementFilter>({ initialState });

  if (noticeType === 'EDIT') return <AnnouncementForm />;

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
        {announcementCategoryFilterList.map(({ key, name }) => (
          <li
            key={key}
            className={`rounded-2xl ${currFilter.announcementType === key ? 'bg-oliveGreen1 text-white' : 'border border-solid border-gray4 text-gray1'}`}
          >
            <button
              type="button"
              onClick={() => handleChangeFilter({ announcementType: key })}
              className="px-4 py-2.5"
            >
              {name}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <AnnouncementPostCard key={index + 1} />
        ))}
      </div>
    </>
  );
}
