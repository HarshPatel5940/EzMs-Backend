import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from '@/pages/errorPage.tsx';
import LoginPage from '@/pages/auth/loginPage.tsx';
import SignupPage from '@/pages/auth/signupPage.tsx';
import HomePage from './pages/rootPage.tsx';
import NotFoundPage from './pages/notFoundPage.tsx';
import DashboardPage from './pages/project/dashboardPage.tsx';
import ProjectPage from './pages/project/project.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'projects',
        element: <DashboardPage />,
      },
      {
        path: 'project/:projectId',
        element: <ProjectPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
