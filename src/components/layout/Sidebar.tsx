import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Trash2, TestTube } from 'lucide-react';
import Logo from './Logo';
import { useState } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/testing', icon: TestTube, label: 'Testing' },
    { path: '/runs', icon: List, label: 'History' },
    { path: '/purge', icon: Trash2, label: 'Purge Runs' },
  ];

  return (
    <div
      className={`fixed md:relative flex flex-col h-full min-h-screen bg-fcc-dark border-r border-fcc-divider transition-all duration-300 z-50 ${
        isHovered ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 border-b border-fcc-divider flex items-center space-x-3">
        <Logo className="w-8 h-8 flex-shrink-0" />
        {isHovered && (
          <span className="text-fcc-white font-semibold whitespace-nowrap">TestLab</span>
        )}
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === '/' && location.pathname === '/dashboard');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 py-3 px-4 mx-2 mb-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-fcc-cyan text-fcc-white'
                  : 'text-fcc-white hover:bg-fcc-divider hover:text-fcc-cyan'
              }`}
              title={!isHovered ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isHovered && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-fcc-divider">
        <div className="w-8 h-8 bg-fcc-cyan rounded-full flex items-center justify-center text-fcc-white font-semibold text-sm">
          JS
        </div>
      </div>
    </div>
  );
}
