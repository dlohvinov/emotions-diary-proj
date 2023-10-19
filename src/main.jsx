import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import '@fontsource/inter';
import App from './app/App.jsx';
import './app/css/index.scss';
import store from './app/store/store.js';
import './app/locale/i18n.js';
import './app/firebase';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
