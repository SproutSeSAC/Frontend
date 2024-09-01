import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function MainView({ children }: Props) {
  return <main className="flex flex-1 flex-col px-9 py-11">{children}</main>;
}
