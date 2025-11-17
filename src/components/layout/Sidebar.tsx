import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Trash2, TestTube, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
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
      <div className="p-4 border-t border-fcc-divider space-y-2">
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-fcc-cyan rounded-full flex items-center justify-center text-fcc-white font-semibold text-sm flex-shrink-0">
            {getUserDisplay()}
          </div>
          {isHovered && (
            <span className="text-fcc-white text-sm whitespace-nowrap truncate">
              {getUserName()}
            </span>
          )}
        </div>
        
        {/* Sign Out Button */}
        {isHovered && (
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center space-x-3 py-2 px-4 rounded-lg text-fcc-white hover:bg-fcc-divider hover:text-fcc-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
