import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';

import MainPage from './pages/ShipsPage/ShipsPage';
import ShipPage from './pages/ShipPage/ShipPage';
import AuthPage from './pages/AuthPage/AuthPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { HomePage } from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import store from './store';
import API from "./api/API";

// Функция для получения и установки CSRF-токена
async function initializeCsrfToken() {
  try {
    const csrfToken = await API.getCsrfToken();
    if (csrfToken) {
      document.cookie = `csrftoken=${csrfToken}; path=/; SameSite=Strict`;
    }
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }
}

const router = createBrowserRouter(
  [
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
    {
      path: '/auth',
      element: (
        <Layout>
          <AuthPage />
        </Layout>
      ),
    },
    {
      path: '/profile',
      element: (
        <Layout>
          <ProfilePage />
        </Layout>
      ),
    },
  ],
);

async function main() {
  // Получение CSRF-токена перед инициализацией React-приложения
  await initializeCsrfToken();

  createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );

  // Регистрация Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/Navy_sea/sw.js')
        .then(() => console.log('service worker registered'))
        .catch((err) => console.log('service worker not registered', err));
    });
  }
}

// Запуск приложения
main();