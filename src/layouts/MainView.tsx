import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function MainView({ children, className }: Props) {
  return (
    <main
      className={`flex min-h-screen flex-1 flex-col pb-20 pl-3 pr-[50px] pt-[60px] ${className || ''}`}
    >
      {children}
    </main>
  );
}
