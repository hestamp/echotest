import ReactDOM from 'react-dom/client';
import { Geiger } from 'react-geiger';
import { BrowserRouter,} from 'react-router-dom';
import { MyStorageProvider } from './storage/StorageContext';
import App from './App';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Geiger renderTimeThreshold={50}>
    <MyStorageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MyStorageProvider>
  </Geiger>
);
