import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from './Logo';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function getTitleFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/testing') return 'Testing';
  if (pathname.startsWith('/scenarios/')) return 'Scenario Execution';
  if (pathname === '/runs') return 'History';
  if (pathname.startsWith('/runs/')) return 'Run Details';
  if (pathname === '/purge') return 'Purge Runs';
  return 'Dashboard';
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const title = getTitleFromPath(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user initials or email for header
  const getUserDisplay = () => {
    if (!user) return 'U';
    
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <div className="flex h-screen bg-fcc-black">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Sidebar - Mobile */}
      <div
        className={`fixed md:hidden z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-16 relative transition-all duration-300">
        {/* Header */}
        <header className="bg-fcc-black border-b border-fcc-divider px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-fcc-white hover:text-fcc-cyan transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="md:hidden">
              <Logo className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-fcc-white">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 bg-fcc-cyan rounded-full flex items-center justify-center text-fcc-white font-semibold text-sm">
                {getUserDisplay()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

