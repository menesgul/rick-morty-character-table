import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import reportWebVitals from './reportWebVitals';

// React 18 Strict Mode'u devre dışı bırak (geliştirme sırasında gereksiz render'ları önlemek için)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// Performans metriklerini raporla
reportWebVitals(console.log); 