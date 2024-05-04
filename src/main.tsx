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
import ProjectsPage from './pages/project/projectsPage.tsx';
import ManageProjectDataPage from './pages/project/manageProjectData.tsx';
import ManageProjectsPage from './pages/project/manageProject.tsx';
import ManageProjectAccess from './components/projects/ManageProjectAccess.tsx';

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
        element: <ProjectsPage />,
      },
      {
        path: 'project/:projectId',
        element: <ManageProjectDataPage />,
      },
      {
        path: 'project/:projectId/manage',
        element: <ManageProjectsPage />,
      },
      {
        path: 'project/:projectId/users/manage',
        element: <ManageProjectAccess />,
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
