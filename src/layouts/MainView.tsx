import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function MainView({ children }: Props) {
  return <main className="flex-1 border-x-4 px-9 py-11">{children}</main>;
}
