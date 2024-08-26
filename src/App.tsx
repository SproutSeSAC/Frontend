import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '@/layouts/Layout';

import Home from '@/pages/Home';
import Lounge from '@/pages/Lounge';
import MyPage from '@/pages/MyPage';
import NotFound from '@/pages/NotFound';
import Restaurant from '@/pages/Restaurant';
import Schedule from '@/pages/Schedule';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/login',
  },
  {
    path: '/signup',
  },
  {
    path: '/mypage',
    element: (
      <Layout>
        <MyPage />
      </Layout>
    ),
  },
  {
    path: '/restaurants',
    element: (
      <Layout>
        <Restaurant />
      </Layout>
    ),
  },
  {
    path: '/schedule',
    element: (
      <Layout>
        <Schedule />
      </Layout>
    ),
  },
  {
    path: '/lounge',
    element: (
      <Layout>
        <Lounge />
      </Layout>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
