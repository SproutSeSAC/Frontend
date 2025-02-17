import { Suspense } from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import loginRoutes from '@/route/loginRoutes';
import mainRoutes from '@/route/mainRoutes';

import LoadingPage from '@/pages/LoadingPage';

import DialogContextProvider from '@/components/context/DialogContextProvider';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    children: [...mainRoutes, ...loginRoutes],
  },
]);

export function redirectToLogin() {
  router.navigate('/login', { replace: true });
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DialogContextProvider>
        <Suspense fallback={<LoadingPage noLayout />}>
          <RouterProvider router={router} />
        </Suspense>
      </DialogContextProvider>
    </QueryClientProvider>
  );
}
