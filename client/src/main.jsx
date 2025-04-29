import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx'; // Correct import path

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home /> {/* Render the Home component */}
  </StrictMode>
);
