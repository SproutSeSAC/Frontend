import { Suspense } from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LoopLoading from './components/common/LoopLoading';
import DialogProvider from './components/context/DialogContextProvider';
import MainView from './layouts/MainView';
import loginRoutes from './route/loginRoutes';
import mainRoutes from './route/mainRoutes';

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
      <DialogProvider>
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
      </DialogProvider>
    </QueryClientProvider>
  );
}
