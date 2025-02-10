import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export default function MainView({ children, isEmpty, className }: Props) {
  return (
    <main
      className={`flex flex-1 flex-col pr-[50px] ${
        isEmpty
          ? 'mb-10 mt-[60px] items-center justify-center rounded-l-[80px] bg-white shadow-card'
          : 'pb-10 pl-3 pt-[60px]'
      } ${className}`}
    >
      {children}
    </main>
  );
}
