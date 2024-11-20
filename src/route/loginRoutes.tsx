import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const Login = lazy(() => import('@/pages/Login'));
const LoginCheck = lazy(() => import('@/pages/LoginCheck'));
const SignUp = lazy(() => import('@/pages/SignUp'));

const loginRoutes: RouteObject[] = [
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
];

export default loginRoutes;
