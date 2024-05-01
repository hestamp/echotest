import ReactDOM from 'react-dom/client';
import { Geiger } from 'react-geiger';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import Providers from './components/Providers';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Geiger renderTimeThreshold={50}>
      <Providers>
        <App />
      </Providers>
    </Geiger>
    <Toaster />
  </BrowserRouter>
);
