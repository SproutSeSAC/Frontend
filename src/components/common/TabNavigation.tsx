import { ReactNode } from 'react';

interface TabNavigationProps<T> {
  tabList: readonly { text: string; type: T }[];
  onChangeValue: (
    value: T,
    e?:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>,
  ) => void;
  selectValue: string;
  children?: ReactNode;
  tabClassName?: string;
  selectedStyle?: {
    point: 'dot' | 'border';
    color: 'green' | 'black';
  };
}

export default function TabNavigation<T>({
  tabList,
  children,
  selectValue,
  onChangeValue,
  tabClassName,
  selectedStyle = { point: 'border', color: 'black' },
}: TabNavigationProps<T>) {
  const borderStyle = selectedStyle.point === 'border' ? 'border-b-2' : '';

  const colorStyle =
    selectedStyle.color === 'green'
      ? 'border-mainGreen text-mainGreen'
      : 'border-black text-black';

  return (
    <nav
      className={`flex items-end justify-between text-lg font-semibold ${selectedStyle.point === 'border' ? 'border-b' : ''}`}
    >
      <ul className="flex flex-wrap justify-start gap-4">
        {tabList.map(({ text, type }) => (
          <li
            role="presentation"
            key={text}
            className={`relative flex cursor-pointer flex-col items-center justify-center whitespace-nowrap px-5 pb-[19px] pt-4 ${selectValue === type ? `${borderStyle} ${colorStyle}` : 'text-mainGray'} ${tabClassName}`}
            onClick={e => onChangeValue(type, e)}
            onKeyDown={e => {
              if (e.key === 'Escape' || e.key === ' ') {
                onChangeValue(type, e);
              }
            }}
          >
            {selectValue === type && selectedStyle.point === 'dot' && (
              <div className="absolute -top-3 mb-2 aspect-square size-1.5 rounded-full bg-mainGreen" />
            )}
            <span>{text}</span>
          </li>
        ))}
      </ul>
      {children && children}
    </nav>
  );
}
