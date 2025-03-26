import { Suspense, lazy } from 'react';

import { RouteObject } from 'react-router-dom';

import ContentsManagement from '@/pages/admin/ContentsManagement';
import CourseManagement from '@/pages/admin/CourseManagement';
import UserManagement from '@/pages/admin/UserManagement';

const MyScrapedPostList = lazy(
  () => import('@/pages/trainee/MyScrapedPostList'),
);
const SessionsDetail = lazy(() => import('@/pages/SessionsDetail'));

const NoticeLayout = lazy(() => import('@/layouts/NoticeLayout'));
const Notice = lazy(() => import('@/pages/trainee/Notice'));
const NoticeDetail = lazy(() => import('@/pages/trainee/NoticeDetail'));
const Layout = lazy(() => import('@/layouts/Layout'));
const LoungeLayout = lazy(() => import('@/layouts/LoungeLayout'));
const Home = lazy(() => import('@/pages/trainee/Home'));
const Lounge = lazy(() => import('@/pages/trainee/Lounge'));
const LoungeDetail = lazy(() => import('@/pages/trainee/LoungeDetail'));
const MyPage = lazy(() => import('@/pages/trainee/MyPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Schedule = lazy(() => import('@/pages/trainee/Schedule'));
const Store = lazy(() => import('@/pages/trainee/Store'));
const StoreDetail = lazy(() => import('@/pages/trainee/StoreDetail'));
const AdminHome = lazy(() => import('@/pages/admin/AdminHome'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const SessionsDetail = lazy(() => import('@/pages/SessionsDetail'));
const SessionLayout = lazy(() => import('@/layouts/SessionLayout'));
const SessionsApplicants = lazy(() => import('@/pages/SessionsApplicants'));

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout type="trainee" />,
    ErrorBoundary: () => (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage type="trainee" />
      </Suspense>
    ),
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
        path: '/notice/session-status',
        element: <SessionsDetail />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
      { 
        path: 'mypage/scraped-posts',
        element: <MyScrapedPostList />,
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
  {
    path: '/admin',
    element: <Layout type="admin" />,
    ErrorBoundary: () => (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage type="admin" />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: 'user',
        element: <UserManagement />,
      },
      {
        path: 'course',
        element: <CourseManagement />,
      },
      {
        path: 'content',
        element: <ContentsManagement />,
      },
      {
        path: 'session-status',
        element: <SessionLayout />,
        children: [
          {
            index: true,
            element: <SessionsDetail />,
          },
          {
            path: 'post/:postId',
            element: <SessionsApplicants />,
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
