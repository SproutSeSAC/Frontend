type TabType = 'menu' | 'review' | 'storyTelling';

const TAB_LIST = [
  { text: '메뉴', type: 'menu' },
  { text: '새싹후기', type: 'review' },
  { text: '스토리텔링', type: 'storyTelling' },
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
      <ul className="flex justify-between font-semibold">
        {TAB_LIST.map(({ text, type }) => (
          <li
            key={type}
            className={`box-border flex w-[70px] cursor-pointer justify-center ${tab === type && 'border-b-2 border-gray2'}`}
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
