// File: main.tsx
// Type: Entry Point
// Imports: React, ReactDOM, App, index.css
// Imported by: Vite build system
// Role: Bootstraps the React application and renders App to the DOM.
// Located at: src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
