import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import './index.css'

import MainPage from '../src/app/MainPage/MainPage';
import ShipPage from '../src/app/ShipPage/ShipPage';
import {HomePage} from '../src/app/HomePage/HomePage';
import Layout from './components/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element:( 
      <Layout>
        <HomePage />
      </Layout>)
  },
  {
    path: '/ships',
    element:( 
    <Layout>
      <MainPage />
    </Layout>)
  },
  {
    path: '/ships/:shipId',
    element:( 
      <Layout>
        <ShipPage />
      </Layout>)
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)