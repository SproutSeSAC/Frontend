import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SideView({ children }: Props) {
  return (
    <section className="w-[27%] max-w-[320px] pl-1 pr-[60px]">
      {children}
    </section>
  );
}
