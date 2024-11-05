import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import './index.css'

import MainPage from '../src/app/MainPage/MainPage';
import Layout from './components/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element:( 
    <Layout>
      <MainPage />
    </Layout>)
  },
  {
    path: '/ships',
    element: <h1>Страница корабля</h1>
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)