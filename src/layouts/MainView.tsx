import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export default function MainView({ children, isEmpty, className }: Props) {
  return (
    <main
      className={`flex flex-1 flex-col pr-[60px] ${className} ${
        isEmpty
          ? 'mb-11 items-center justify-center rounded-l-[80px] bg-white shadow-card'
          : 'pb-11 pl-3'
      }`}
    >
      {children}
    </main>
  );
}
