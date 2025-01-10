import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import './index.css'
import App from './App.jsx'
import OwnerAdvertisementsList from './pages/OwnerAdvertisementsList.jsx'
import CreateAdvertisement from './pages/CreateAdvertisement.jsx'

WebApp.ready();


const router = createBrowserRouter([
  {
    path: "/dom24/",
    element: <App />,
    children: [
      {
        path: "/dom24/",
        element: <CreateAdvertisement />,
      },
      {
        path: "/dom24/my-houses",
        element: <OwnerAdvertisementsList />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)