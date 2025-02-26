import { ReactNode } from 'react';

interface TabNavigationProps<T> {
  tabList: { text: string; type: T }[];
  onChangeValue: (
    value: T,
    e?:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>,
  ) => void;
  selectValue: string;
  children?: ReactNode;
  tabClassName?: string;
}

export default function TabNavigation<T>({
  tabList,
  children,
  selectValue,
  onChangeValue,
  tabClassName,
}: TabNavigationProps<T>) {
  return (
    <nav className="flex items-end justify-between border-b border-solid border-b-lightGray pt-4 text-lg font-semibold">
      <ul className="flex flex-wrap justify-start gap-4">
        {tabList.map(({ text, type }) => (
          <li
            role="presentation"
            key={text}
            className={`box-border flex cursor-pointer justify-center whitespace-nowrap px-5 pb-[19px] ${selectValue === type ? 'border-b-2 border-black' : 'text-mainGray'} ${tabClassName}`}
            onClick={e => onChangeValue(type, e)}
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
