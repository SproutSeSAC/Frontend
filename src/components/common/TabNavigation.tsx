import { ReactNode } from 'react';

interface TabNavigationProps {
  tabList: { text: string; type: string }[];
  onChangeValue: (
    value: string,
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
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
    <nav className="mb-6 flex justify-between border-b border-solid border-b-gray4 text-lg font-semibold">
      <ul className="flex justify-between gap-4">
        {tabList.map(({ text, type }) => (
          <li
            key={type}
            className={`box-border flex flex-1 cursor-pointer justify-center whitespace-nowrap ${selectValue === type ? 'border-b-2 border-text' : 'text-gray2'} ${tabClassName}`}
          >
            <button
              type="button"
              className="px-2 pb-[19px]"
              onClick={e => {
                onChangeValue(type, e);
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
