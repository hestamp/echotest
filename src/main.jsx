import ReactDOM from 'react-dom/client';
import { Geiger } from 'react-geiger';
import { RouterProvider } from 'react-router-dom';

import { MyStorageProvider } from './storage/StorageContext';
import router from './pages/router.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Geiger renderTimeThreshold={50}>
    <MyStorageProvider>
      <RouterProvider router={router} />
    </MyStorageProvider>
  </Geiger>
);
