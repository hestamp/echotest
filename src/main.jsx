import ReactDOM from 'react-dom/client';
import { Geiger } from 'react-geiger';
import { BrowserRouter, RouterProvider } from 'react-router-dom';

import { MyStorageProvider } from './storage/StorageContext';
import router from './pages/router.jsx';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Geiger renderTimeThreshold={50}>
    <MyStorageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MyStorageProvider>
  </Geiger>
);
