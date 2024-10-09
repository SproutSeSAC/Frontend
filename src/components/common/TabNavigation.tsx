/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { ReactNode } from 'react';

interface TabNavigationProps {
  tabList: { text: string; type: string }[];
  onChangeValue: (
    value: string,
    e?:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>,
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
    <nav className="flex justify-between border-b border-solid border-b-gray4 text-lg font-semibold">
      <ul className="flex flex-wrap justify-start gap-4">
        {tabList.map(({ text, type }) => (
          <li
            key={type}
            className={`box-border flex cursor-pointer justify-center whitespace-nowrap px-2 pb-[19px] ${selectValue === type ? 'border-b-2 border-text' : 'text-gray2'} ${tabClassName}`}
            onClick={e => {
              onChangeValue(type, e);
            }}
            onKeyDown={e => {
              if (e.key === 'Escape' || e.key === ' ') {
                onChangeValue(type, e);
              }
            }}
          >
            {text}
          </li>
        ))}
      </ul>
      {children && children}
    </nav>
  );
}
