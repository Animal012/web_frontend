import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';

import MainPage from './pages/ShipsPage/ShipsPage';
import ShipPage from './pages/ShipPage/ShipPage';
import { HomePage } from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import store from './store';
import { useEffect } from 'react';

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

function App() {
  useEffect(() => {
    if (window.TAURI) {
      const { invoke } = window.TAURI.tauri;

      invoke('create')
        .then((response: string) => console.log(response))
        .catch((error: any) => console.error('Error:', error));

      return () => {
        invoke('close')
          .then((response: string) => console.log(response))
          .catch((error: any) => console.error('Error:', error));
      };
    }
  }, []);

  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
