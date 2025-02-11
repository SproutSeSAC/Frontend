import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SideView({ children }: Props) {
  return (
    <section className="w-[25%] max-w-[390px] pb-10 pr-[50px] pt-[60px]">
      {children}
    </section>
  );
}
