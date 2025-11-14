import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #000; color: #fff; padding: 20px;">
      <div style="max-width: 600px;">
        <h1 style="color: #ff0000; margin-bottom: 20px;">Error Loading Application</h1>
        <p style="margin-bottom: 10px;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <pre style="background: #1a1a1a; padding: 10px; border-radius: 4px; overflow: auto; font-size: 12px;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    </div>
  `;
}

