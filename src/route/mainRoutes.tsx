import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const AnnouncementLayout = lazy(() => import('@/layouts/AnnouncementLayout'));
const Announcement = lazy(() => import('@/pages/Announcement'));
const AnnouncementDetail = lazy(() => import('@/pages/AnnouncementDetail'));
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
