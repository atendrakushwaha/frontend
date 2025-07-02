import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- This is correct for React 18+
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import './index.css';



const root = ReactDOM.createRoot(document.getElementById('root')); // <-- Correct
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);