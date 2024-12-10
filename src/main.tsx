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
import { invoke } from '@tauri-apps/api/core';

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
], {
    basename: '/'
});

function App() {
  useEffect(() => {
    invoke('create')
      .then((response: any) => console.log('Create command response:', response))
      .catch((error: any) => console.error('Error invoking create command:', error));

    return () => {
      invoke('close')
        .then((response: any) => console.log('Close command response:', response))
        .catch((error: any) => console.error('Error invoking close command:', error));
    };
  }, []);

  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
