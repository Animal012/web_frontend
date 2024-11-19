import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';  // Импортируем Provider
import './index.css';

import MainPage from './pages/ShipsPage/ShipsPage';
import ShipPage from './pages/ShipPage/ShipPage';
import { HomePage } from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import store from './store';  // Импортируем store

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: '/ships',
    element: (
      <Layout>
        <MainPage />
      </Layout>
    ),
  },
  {
    path: '/ships/:shipId',
    element: (
      <Layout>
        <ShipPage />
      </Layout>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>  {/* Оборачиваем в Provider */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
