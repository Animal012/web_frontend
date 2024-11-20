import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';

import MainPage from './pages/ShipsPage/ShipsPage';
import ShipPage from './pages/ShipPage/ShipPage';
import { HomePage } from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import store from './store';

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
  ],
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/Navy_sea/sw.js')
      .then(() => console.log('service worker registered'))
      .catch((err) => console.log('service worker not registered', err));
  });
}
