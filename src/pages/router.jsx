import { createBrowserRouter } from 'react-router-dom';
import { GuidePage, MainPage } from '.';
import Layout from '@/components/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuidePage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/main',
        element: <MainPage />,
      },
    ],
  },
]);

export default router;
