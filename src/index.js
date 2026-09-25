import './index.css';

import * as Sentry from '@sentry/react';

import App from './App';
import { Integrations } from '@sentry/tracing';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.REACT_APP_SENTRY_URL,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
