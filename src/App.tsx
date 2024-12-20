import { Suspense } from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MainView from '@/layouts/MainView';
import loginRoutes from '@/route/loginRoutes';
import mainRoutes from '@/route/mainRoutes';

import LoopLoading from '@/components/common/LoopLoading';
import DialogContextProvider from '@/components/context/DialogContextProvider';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    children: [...mainRoutes, ...loginRoutes],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DialogContextProvider>
        <Suspense
          fallback={
            // TODO : 수정 필요, 에러바운더리추가
            <MainView className="flex h-screen w-full items-center justify-center">
              <LoopLoading />
            </MainView>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </DialogContextProvider>
    </QueryClientProvider>
  );
}
