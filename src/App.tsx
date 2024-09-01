import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '@/layouts/Layout';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Announcement from '@/pages/Announcement';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Lounge from '@/pages/Lounge';
import MyPage from '@/pages/MyPage';
import NotFound from '@/pages/NotFound';
import Schedule from '@/pages/Schedule';
import SignUp from '@/pages/SignUp';
import Store from '@/pages/Store';

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
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/announcement',
    element: (
      <Layout>
        <Announcement />
      </Layout>
    ),
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
    path: '/stores',
    element: (
      <Layout>
        <Store />
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
    children: [
      {
        path: 'post/:postId',
      },
      {
        path: 'post',
      },
    ],
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
