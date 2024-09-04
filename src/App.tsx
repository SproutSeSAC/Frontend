import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '@/layouts/Layout';
import LoungeLayout from '@/layouts/LoungeLayout';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Announcement from '@/pages/Announcement';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Lounge from '@/pages/Lounge';
import LoungeDetail from '@/pages/LoungeDetail';
import LoungeEditor from '@/pages/LoungeEditor';
import MyPage from '@/pages/MyPage';
import NotFound from '@/pages/NotFound';
import Schedule from '@/pages/Schedule';
import SignUp from '@/pages/SignUp';
import Store from '@/pages/Store';
import StoreDetail from '@/pages/StoreDetail';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'announcement',
        element: <Announcement />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: 'stores',
        element: <Store />,
      },
      {
        path: 'stores/:storeId',
        element: <StoreDetail />,
      },
      {
        path: 'schedule',
        element: <Schedule />,
      },
      {
        path: 'lounge',
        element: <LoungeLayout />,
        children: [
          {
            index: true,
            element: <Lounge />,
          },
          {
            path: 'post/:postId',
            element: <LoungeDetail />,
          },
          {
            path: 'editor',
            element: <LoungeEditor />,
          },
        ],
      },
    ],
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
