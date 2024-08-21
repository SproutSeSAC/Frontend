import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SideView({ children }: Props) {
  return (
    <section className="w-[24%] max-w-[284px] px-1 py-11">{children}</section>
  );
}
