import { useCallback, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { announcementCategoryFilterList } from '@/constants/announcement';
import { AnnouncementCategoryKey, KeyOfAnnouncementTabKind } from '@/types';

import AnnouncementPostCard from '@/components/announcement/AnnouncementPostCard';
import AnnouncementEditor from '@/components/announcement/editor/AnnouncementEditor';
import SquareButton from '@/components/common/button/SquareButton';
import SearchInput from '@/components/common/input/SearchInput';

export default function Announcement() {
  const [announcementType, setAnnouncementType] =
    useState<AnnouncementCategoryKey>('ALL');

  const [searchParams] = useSearchParams();

  const ptype = searchParams.get('ptype') as KeyOfAnnouncementTabKind;

  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (searchRef.current) {
        searchRef.current.value = value;
      }
    },
    [],
  );

  const handleSearchSubmit = useCallback(() => {
    // setFilterData(prev => ({ ...prev, keyword: searchRef.current?.value }));
  }, []);

  if (ptype === 'EDIT') {
    return <AnnouncementEditor />;
  }

  return (
    <div>
      <div className="mt-6 flex items-center gap-10">
        <SearchInput
          name="search"
          ref={searchRef}
          placeholder="찾으시는 공지사항 내용을 입력해 주세요"
          width="w-full"
          height="h-12"
          onChange={handleSearchChange}
        />
        <SquareButton
          name="검색하기"
          onClick={handleSearchSubmit}
          className="w-20 whitespace-nowrap px-3.5 py-3 text-white"
        />
      </div>

      <ul className="mt-6 flex items-center gap-2.5">
        {announcementCategoryFilterList.map(({ key, name }) => (
          <li
            key={key}
            className={`rounded-2xl ${announcementType === key ? 'bg-oliveGreen1 text-white' : 'border border-solid border-gray4 text-gray1'}`}
          >
            <button
              type="button"
              onClick={() => setAnnouncementType(key)}
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
    </div>
  );
}
