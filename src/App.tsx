import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Dashboard from '@/pages/Dashboard';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/signup',
  },
  {
    path: '/profile-setup',
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/mypage',
  },
  {
    path: '/restaurants',
    children: [
      {
        path: 'map',
      },
      {
        path: ':id',
      },
    ],
  },
  {
    path: '/schedule',
  },
  {
    path: '/lounge',

    children: [
      {
        path: 'editor',
      },
    ],
  },
  {
    path: '/networking',
  },
  {
    // not-found 페이지
    path: '*',
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
