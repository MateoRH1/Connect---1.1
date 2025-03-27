import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Publications } from './pages/Publications';
import { PublicationMetrics } from './pages/PublicationMetrics';
import { Unauthorized } from './pages/Unauthorized';
import { PrivateRoute } from './components/PrivateRoute'; // Updated import
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><Dashboard /></PrivateRoute>
  },
  {
    path: '/publications',
    element: <PrivateRoute><Publications /></PrivateRoute>
  },
  {
    path: '/publications/:productId',
    element: <PrivateRoute><PublicationMetrics /></PrivateRoute>
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
