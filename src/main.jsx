import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@context/auth-context';
import App from './App';
import * as Sentry from '@sentry/react';

import './index.css';

Sentry.init({
  dsn: 'https://e78ab80a93b20db644d031b04e658854@o4509201126981632.ingest.us.sentry.io/4509204378288128',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
