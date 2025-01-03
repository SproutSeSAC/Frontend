import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

import SessionsDetail from '@/pages/SessionsDetail';

const NoticeLayout = lazy(() => import('@/layouts/NoticeLayout'));
const Notice = lazy(() => import('@/pages/Notice'));
const NoticeDetail = lazy(() => import('@/pages/NoticeDetail'));
const Layout = lazy(() => import('@/layouts/Layout'));
const LoungeLayout = lazy(() => import('@/layouts/LoungeLayout'));
const Home = lazy(() => import('@/pages/Home'));
const Lounge = lazy(() => import('@/pages/Lounge'));
const LoungeDetail = lazy(() => import('@/pages/LoungeDetail'));
const MyPage = lazy(() => import('@/pages/MyPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Schedule = lazy(() => import('@/pages/Schedule'));
const Store = lazy(() => import('@/pages/Store'));
const StoreDetail = lazy(() => import('@/pages/StoreDetail'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'notice',
        element: <NoticeLayout />,
        children: [
          {
            index: true,
            element: <Notice />,
          },
          {
            path: 'post/:postId',
            element: <NoticeDetail />,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: 'application-status-for-sessions',
        element: <SessionsDetail />,
      },
      {
        path: 'stores',
        element: <Store />,
      },
      {
        path: 'stores/detail-location',
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
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default mainRoutes;
