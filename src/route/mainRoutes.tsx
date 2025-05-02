import { Suspense, lazy } from 'react';

import { RouteObject } from 'react-router-dom';

import ContentsManagement from '@/pages/admin/ContentsManagement';
import CourseManagement from '@/pages/admin/CourseManagement';
import UserManagement from '@/pages/admin/UserManagement';
import UserManagementDetail from '@/pages/admin/UserManagementDetail';

const ScrapedPostList = lazy(() => import('@/pages/trainee/ScrapedPostList'));
const AppliedSessionsDetail = lazy(
  () => import('@/pages/trainee/AppliedSessionsDetail'),
);

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

const SessionApplicantManagementDetail = lazy(
  () => import('@/pages/admin/SessionApplicantManagementDetail'),
);
const SessionApplicantManagement = lazy(
  () => import('@/pages/admin/SessionApplicantManagement'),
);

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
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: 'session-status',
        element: <AppliedSessionsDetail />,
      },
      {
        path: 'session-status/:userId',
        element: <AppliedSessionsDetail />,
      },
      {
        path: 'scraped-posts',
        element: <ScrapedPostList />,
      },
      {
        path: 'scraped-posts/:userId',
        element: <ScrapedPostList />,
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
        children: [
          {
            index: true,
            element: <UserManagement />,
          },
          {
            path: ':userId',
            element: <UserManagementDetail />,
          },
        ],
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
        children: [
          {
            index: true,
            element: <SessionApplicantManagement />,
          },
          {
            path: ':postId',
            element: <SessionApplicantManagementDetail />,
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
