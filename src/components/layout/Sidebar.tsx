import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Trash2, TestTube, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/testing', icon: TestTube, label: 'Testing' },
    { path: '/runs', icon: List, label: 'History' },
    { path: '/purge', icon: Trash2, label: 'Purge Runs' },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  // Get user initials or email
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

  const getUserName = () => {
    if (!user) return 'User';
    
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    if (user.email) {
      return user.email;
    }
    
    return 'User';
  };

  const isExpanded = isHovered;

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-fcc-dark border-r border-fcc-divider transition-all duration-300 ease-in-out z-[1000] overflow-hidden ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'width' }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-fcc-divider flex items-center gap-3 min-w-0">
          <Logo className="w-8 h-8 flex-shrink-0" />
          <span
            className={`text-fcc-white font-semibold text-lg whitespace-nowrap transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'opacity-100 translate-x-0 ml-3 scale-100'
                : 'opacity-0 w-0 overflow-hidden -translate-x-2 scale-95'
            }`}
          >
            TestLab
          </span>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/' && location.pathname === '/dashboard');
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onNavigate}
                    className={`flex items-center rounded-lg text-sm font-medium transition-colors relative min-h-[2.5rem] py-2 ${
                      !isExpanded 
                        ? 'justify-center px-0' 
                        : 'gap-3 px-3'
                    } ${
                      isActive
                        ? 'bg-fcc-cyan text-fcc-white'
                        : 'text-fcc-white/70 hover:bg-fcc-divider hover:text-fcc-cyan'
                    }`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out ${
                        isExpanded ? 'scale-100 rotate-0' : 'scale-110'
                      }`}
                    />
                    <span
                      className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${
                        isExpanded
                          ? 'opacity-100 translate-x-0 ml-3 scale-100'
                          : 'opacity-0 w-0 overflow-hidden -translate-x-2 scale-95'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-fcc-divider">
          <button
            onClick={() => {
              navigate('/profile');
              onNavigate?.();
            }}
            className={`w-full flex items-center py-2 rounded-lg transition-colors relative ${
              location.pathname === '/profile'
                ? 'bg-fcc-cyan text-fcc-white'
                : 'text-fcc-white hover:bg-fcc-divider hover:text-fcc-cyan'
            } ${
              !isExpanded 
                ? 'justify-center px-0' 
                : 'gap-3 px-3'
            }`}
            title={!isExpanded ? 'Profile' : undefined}
          >
            <div className="w-8 h-8 bg-fcc-cyan rounded-full flex items-center justify-center text-fcc-white font-semibold flex-shrink-0 transition-all duration-300 ease-in-out">
              {getUserDisplay()}
            </div>
            <span
              className={`font-medium transition-all duration-300 ease-in-out flex-1 min-w-0 ${
                isExpanded ? 'opacity-100 delay-150' : 'opacity-0 w-0'
              }`}
            >
              <span className="block truncate text-sm">
                {getUserName()}
              </span>
            </span>
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSignOut();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                disabled={signingOut}
                className="ml-2 p-1.5 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors flex-shrink-0 group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
