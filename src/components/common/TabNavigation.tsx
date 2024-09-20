import { ReactNode, useState } from 'react';

interface TabNavigationProps {
  tabList: { text: string; type: string }[];
  onChangeValue: (value: string) => void;
  children?: ReactNode;
  defaultValue?: string;
}

export default function TabNavigation({
  tabList,
  children,
  defaultValue,
  onChangeValue,
}: TabNavigationProps) {
  const [tab, setTab] = useState(defaultValue || 'all');

  return (
    <nav className="mb-6 flex justify-between border-b border-solid border-b-gray4 text-lg font-semibold">
      <ul className="flex w-[368px] justify-between">
        {tabList.map(({ text, type }) => (
          <li
            key={type}
            className={`box-border flex flex-1 cursor-pointer justify-center whitespace-nowrap ${tab === type ? 'border-b-2 border-text' : 'text-gray2'}`}
          >
            <button
              type="button"
              className="px-2 pb-[19px]"
              onClick={() => {
                setTab(type);
                onChangeValue(type);
              }}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
      {children && children}
    </nav>
  );
}
