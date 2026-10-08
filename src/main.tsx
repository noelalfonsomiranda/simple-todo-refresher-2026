import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Entry point: mount <App /> into the #root div from index.html.
// StrictMode runs extra checks in development (e.g. runs effects twice)
// to help catch bugs early. It does nothing in production.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
