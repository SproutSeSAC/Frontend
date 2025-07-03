import { Suspense, lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const Layout = lazy(() => import('@/layouts/Layout'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));

const Home = lazy(() => import('@/pages/trainee/Home'));
const Schedule = lazy(() => import('@/pages/trainee/Schedule'));
const LoungeLayout = lazy(() => import('@/layouts/LoungeLayout'));
const Lounge = lazy(() => import('@/pages/trainee/Lounge'));
const LoungeDetail = lazy(() => import('@/pages/trainee/LoungeDetail'));
const NoticeLayout = lazy(() => import('@/layouts/NoticeLayout'));
const Notice = lazy(() => import('@/pages/trainee/Notice'));
const NoticeDetail = lazy(() => import('@/pages/trainee/NoticeDetail'));
const Store = lazy(() => import('@/pages/trainee/Store'));
const StoreDetail = lazy(() => import('@/pages/trainee/StoreDetail'));
const MyPage = lazy(() => import('@/pages/trainee/MyPage'));
const ScrapedPostList = lazy(() => import('@/pages/trainee/ScrapedPostList'));
const AppliedSessionsDetail = lazy(
  () => import('@/pages/trainee/AppliedSessionsDetail'),
);

const AdminHome = lazy(() => import('@/pages/admin/AdminHome'));
const ContentsManagement = lazy(
  () => import('@/pages/admin/ContentsManagement'),
);
const CourseManagement = lazy(() => import('@/pages/admin/CourseManagement'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const UserManagementDetail = lazy(
  () => import('@/pages/admin/UserManagementDetail'),
);
const SessionApplicantManagement = lazy(
  () => import('@/pages/admin/SessionApplicantManagement'),
);
const SessionApplicantManagementDetail = lazy(
  () => import('@/pages/admin/SessionApplicantManagementDetail'),
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
        path: 'session-status/:userId',
        element: <AppliedSessionsDetail />,
      },
      {
        path: 'applicants-status',
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
