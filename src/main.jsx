import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@context/auth-context';
import * as Sentry from '@sentry/react';
import App from './App';

Sentry.init({
  dsn: 'https://a421cf71a8d1aeeb7b04515850c52c1b@o4509201126981632.ingest.us.sentry.io/4509201127833600',
});

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
