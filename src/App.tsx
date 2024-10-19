import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import DialogProvider from './components/context/DialogContextProvider';
import AnnouncementLayout from './layouts/AnnouncementLayout';
import Announcement from './pages/Announcement';
import AnnouncementDetail from './pages/AnnouncementDetail';
import LoungeEditor from './pages/LoungeEditor';

import Layout from '@/layouts/Layout';
import LoungeLayout from '@/layouts/LoungeLayout';
import 'swiper/css';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import LoginCheck from '@/pages/LoginCheck';
import Lounge from '@/pages/Lounge';
import LoungeDetail from '@/pages/LoungeDetail';
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
        element: <AnnouncementLayout />,
        children: [
          {
            index: true,
            element: <Announcement />,
          },
          {
            path: 'post/:postId',
            element: <AnnouncementDetail />,
          },
        ],
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
            path: '/lounge/editor',
            element: <LoungeEditor />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login-check',
    element: <LoginCheck />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        <RouterProvider router={router} />
      </DialogProvider>
    </QueryClientProvider>
  );
}
