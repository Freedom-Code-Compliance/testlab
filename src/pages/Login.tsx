import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/layout/Logo';
import PrimaryButton from '../components/ui/PrimaryButton';
import AuthError from '../components/ui/AuthError';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate, searchParams]);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-fcc-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render login form if user is already logged in (will redirect)
  if (user) {
    return null;
  }

  const getErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred';
    
    const message = error.message || error.toString();
    
    // Map common Supabase auth errors to user-friendly messages
    if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (message.includes('Email not confirmed') || message.includes('email_not_confirmed')) {
      return 'Please confirm your email address before signing in.';
    }
    if (message.includes('Too many requests') || message.includes('too_many_requests')) {
      return 'Too many login attempts. Please wait a moment and try again.';
    }
    if (message.includes('User not found')) {
      return 'No account found with this email address.';
    }
    if (message.includes('Network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return message;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      // Redirect to intended destination or dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    } catch (err: any) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(getErrorMessage(error));
        setLoading(false);
      }
      // Note: Google OAuth redirects, so we don't navigate here
    } catch (err: any) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fcc-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo className="w-12 h-12" />
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-fcc-white">Welcome to Test Lab</h1>
            <h2 className="text-lg font-semibold text-fcc-white">Sign In</h2>
            <p className="text-sm text-fcc-white/70">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Error Message */}
          {error && <AuthError message={error} />}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fcc-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fcc-white/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-fcc-black border border-fcc-divider rounded-lg text-fcc-white placeholder-fcc-white/50 focus:outline-none focus:ring-2 focus:ring-fcc-cyan focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-fcc-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fcc-white/50" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-fcc-black border border-fcc-divider rounded-lg text-fcc-white placeholder-fcc-white/50 focus:outline-none focus:ring-2 focus:ring-fcc-cyan focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-fcc-cyan hover:text-fcc-cyan/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full py-3 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </PrimaryButton>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-fcc-divider"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-fcc-dark text-fcc-white/70">Or</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-fcc-black border border-fcc-divider rounded-lg text-fcc-white font-semibold hover:bg-fcc-divider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img 
              src="/icons8-google-48.png" 
              alt="Google" 
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

