import { ReactNode } from 'react';

import NavigationBar from '@/layouts/NavigationBar';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-[100vh] bg-bg">
      <NavigationBar />
      {children}
    </div>
  );
}
