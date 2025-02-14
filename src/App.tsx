import { Suspense, useEffect } from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useSSE } from './hooks/common/useSSE';

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
  const { subscribe, unsubscribe, publishMessage } = useSSE(); // TODO 서버에서 SSE 확인 중

  useEffect(() => {
    subscribe();

    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);

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
          {/* TODO 버튼 제거 */}
          <button onClick={() => publishMessage(8)}>버튼</button>
          <button onClick={subscribe}>구독 시작</button>
          <button onClick={unsubscribe}>구독 취소</button>
          <RouterProvider router={router} />
        </Suspense>
      </DialogContextProvider>
    </QueryClientProvider>
  );
}
