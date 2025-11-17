import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Logo from '../components/layout/Logo';
import PrimaryButton from '../components/ui/PrimaryButton';
import AuthError from '../components/ui/AuthError';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have a valid reset token in the URL hash
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type === 'recovery' && accessToken) {
      // Verify the token is valid by trying to get the session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      });
    } else {
      setTokenValid(false);
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [location]);

  const getErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred';
    
    const message = error.message || error.toString();
    
    if (message.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    if (message.includes('expired') || message.includes('invalid_token')) {
      return 'This reset link has expired. Please request a new password reset.';
    }
    if (message.includes('Network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return message;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        setError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-fcc-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-8 space-y-6">
            <div className="flex justify-center">
              <Logo className="w-12 h-12" />
            </div>
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-fcc-white/70 mt-4">Verifying reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false && error) {
    return (
      <div className="min-h-screen bg-fcc-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-8 space-y-6">
            <div className="flex justify-center">
              <Logo className="w-12 h-12" />
            </div>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-fcc-white">Invalid Reset Link</h1>
              <AuthError message={error} />
              <a
                href="/forgot-password"
                className="block text-center text-fcc-cyan hover:text-fcc-cyan/80 transition-colors text-sm"
              >
                Request a new password reset
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-fcc-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-8 space-y-6">
            <div className="flex justify-center">
              <Logo className="w-12 h-12" />
            </div>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-fcc-white">Password Reset Successful</h1>
              <p className="text-sm text-fcc-white/70">
                Your password has been successfully reset. Redirecting to sign in...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-fcc-white">Set New Password</h1>
            <p className="text-sm text-fcc-white/70">
              Enter your new password below.
            </p>
          </div>

          {/* Error Message */}
          {error && <AuthError message={error} />}

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-fcc-white mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fcc-white/50" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2 bg-fcc-black border border-fcc-divider rounded-lg text-fcc-white placeholder-fcc-white/50 focus:outline-none focus:ring-2 focus:ring-fcc-cyan focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-fcc-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fcc-white/50" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2 bg-fcc-black border border-fcc-divider rounded-lg text-fcc-white placeholder-fcc-white/50 focus:outline-none focus:ring-2 focus:ring-fcc-cyan focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Reset Password Button */}
            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full py-3 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}

