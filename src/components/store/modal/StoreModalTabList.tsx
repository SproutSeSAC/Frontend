type TabType = 'menu' | 'review' | 'directionsInfo' | 'storyTelling';

const TAB_LIST = [
  { text: '메뉴', type: 'menu' },
  { text: '새싹정보', type: 'directionsInfo' },
  { text: '댓글후기', type: 'review' },
];

interface StoreModalTabListProps {
  tab: string;
  setTab: (tab: string) => void;
}

export default function StoreModalTabList({
  tab,
  setTab,
}: StoreModalTabListProps) {
  return (
    <nav className="mb-8 mt-10">
      <ul className="flex justify-around font-semibold">
        {TAB_LIST.map(({ text, type }) => (
          <li
            key={type}
            className={`box-border flex w-full cursor-pointer justify-center ${tab === type && 'border-b-2 border-gray2'}`}
          >
            <button type="button" onClick={() => setTab(type as TabType)}>
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
