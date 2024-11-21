import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export default function MainView({ children, isEmpty, className }: Props) {
  return (
    <main
      className={`flex flex-1 flex-col ${className} ${
        isEmpty
          ? 'my-11 items-center justify-center rounded-l-[80px] bg-white shadow-card'
          : 'px-9 py-11'
      }`}
    >
      {children}
    </main>
  );
}
