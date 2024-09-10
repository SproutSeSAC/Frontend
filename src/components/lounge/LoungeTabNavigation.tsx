import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const TAB_LIST = [
  { text: '전체', type: 'all' },
  { text: '프로젝트', type: 'project' },
  { text: '스터디', type: 'study' },
  { text: '찜 모아보기', type: 'like' },
];

export default function LoungeTabNavigation() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  return (
    <nav className="mb-6 mt-10 flex justify-between border-b border-solid border-b-gray4 text-lg font-semibold">
      <ul className="flex w-[368px] justify-between">
        {TAB_LIST.map(({ text, type }) => (
          <li
            key={type}
            className={`box-border flex flex-1 cursor-pointer justify-center whitespace-nowrap ${tab === type && 'border-b-2 border-text'}`}
          >
            <button
              type="button"
              className="px-2 pb-[19px]"
              onClick={() => {
                setTab(type);

                navigate('/lounge', {
                  replace: true,
                  state: type,
                });
              }}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
      <div
        className={`box-border w-20 cursor-pointer justify-center pb-[19px] ${tab === 'edit' && 'border-b-2 border-text'}`}
      >
        <button
          type="button"
          onClick={() => {
            setTab('edit');
            navigate('/lounge', {
              replace: true,
              state: 'edit',
            });
          }}
        >
          모집하기
        </button>
      </div>
    </nav>
  );
}
