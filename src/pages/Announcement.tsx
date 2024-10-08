import { useCallback, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import AnnouncementPostCard from '@/components/announcement/AnnouncementPostCard';
import AnnouncementEditor from '@/components/announcement/editor/AnnouncementEditor';
import SquareButton from '@/components/common/button/SquareButton';
import SearchInput from '@/components/common/input/SearchInput';

const FILTER_LIST = [
  { key: '통합', value: '통합' },
  { key: '특강', value: '특강' },
  { key: '취업 꿀팁', value: '취업 꿀팁' },
];

export default function Announcement() {
  const [announcementType, setAnnouncementType] = useState('통합');
  const [searchParams] = useSearchParams();

  const ptype = searchParams.get('ptype');

  const searchRef = useRef<HTMLInputElement | null>(null);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      searchRef.current.value = e.target.value;
    }
  }, []);

  const handleSearchSubmit = useCallback(() => {
    // setFilterData(prev => ({ ...prev, keyword: searchRef.current?.value }));
  }, []);

  if (ptype === 'edit') {
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
          onChange={handleChange}
        />
        <SquareButton
          name="검색하기"
          onClick={handleSearchSubmit}
          className="w-20 whitespace-nowrap px-3.5 py-3 text-white"
        />
      </div>

      <ul className="mt-6 flex items-center gap-2.5">
        {FILTER_LIST.map(filterItem => (
          <li
            key={filterItem.key}
            className={`rounded-2xl px-4 py-2.5 ${announcementType === filterItem.value ? 'bg-oliveGreen1 text-white' : 'border border-solid border-gray4 text-gray1'}`}
          >
            <button
              type="button"
              onClick={() => {
                setAnnouncementType(filterItem.value);
              }}
            >
              {filterItem.key}
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
