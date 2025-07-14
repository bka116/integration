import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Привязка к <div id="root"> в public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Отрисовка корневого компонента App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
