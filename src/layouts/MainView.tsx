import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isEmpty?: boolean;
}

export default function MainView({ children, isEmpty }: Props) {
  return (
    <main
      className={`flex flex-1 flex-col ${
        isEmpty
          ? 'my-11 items-center justify-center rounded-l-[80px] bg-white shadow-card'
          : 'px-9 py-11'
      }`}
    >
      {children}
    </main>
  );
}
