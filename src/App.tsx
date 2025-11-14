import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Testing from './pages/Testing';
import Runs from './pages/Runs';
import RunDetail from './pages/RunDetail';
import Purge from './pages/Purge';

function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/runs" element={<Runs />} />
              <Route path="/runs/:id" element={<RunDetail />} />
              <Route path="/purge" element={<Purge />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;

