import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SideView({ children }: Props) {
  return (
    <section className="w-[27%] max-w-[284px] py-11 pl-1 pr-5">
      {children}
    </section>
  );
}
