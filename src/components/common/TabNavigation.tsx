import { ReactNode } from 'react';

interface TabNavigationProps {
  tabList: { text: string; type: string }[];
  onChangeValue: (value: string) => void;
  selectValue: string;
  children?: ReactNode;
  tabClassName?: string;
}

export default function TabNavigation({
  tabList,
  children,
  selectValue,
  onChangeValue,
  tabClassName,
}: TabNavigationProps) {
  return (
    <nav className="flex justify-between border-b border-solid border-b-gray4 text-lg">
      <ul className="flex flex-1 justify-between gap-2">
        {tabList.map(({ text, type }) => (
          <li
            key={type}
            className={`box-border flex cursor-pointer items-center justify-center whitespace-nowrap ${selectValue === type ? 'border-b-2 border-text' : 'text-gray2'} ${tabClassName}`}
          >
            <button
              type="button"
              className="w-fit px-4 pb-2 pt-3"
              onClick={() => {
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
