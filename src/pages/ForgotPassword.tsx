import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/layout/Logo';
import PrimaryButton from '../components/ui/PrimaryButton';
import AuthError from '../components/ui/AuthError';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const getErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred';
    
    const message = error.message || error.toString();
    
    if (message.includes('User not found')) {
      return 'No account found with this email address.';
    }
    if (message.includes('Too many requests') || message.includes('too_many_requests')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (message.includes('Network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return message;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-fcc-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-8 space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <Logo className="w-12 h-12" />
            </div>

            {/* Success Message */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-fcc-white">Check Your Email</h1>
              <p className="text-sm text-fcc-white/70">
                We've sent a password reset link to <strong className="text-fcc-white">{email}</strong>.
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <p className="text-xs text-fcc-white/50">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="block text-center text-fcc-cyan hover:text-fcc-cyan/80 transition-colors text-sm"
            >
              <ArrowLeft className="inline w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
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
            <h1 className="text-2xl font-bold text-fcc-white">Reset Password</h1>
            <p className="text-sm text-fcc-white/70">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && <AuthError message={error} />}

          {/* Reset Form */}
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

            {/* Send Reset Link Button */}
            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full py-3 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </PrimaryButton>
          </form>

          {/* Back to Login */}
          <Link
            to="/login"
            className="block text-center text-fcc-cyan hover:text-fcc-cyan/80 transition-colors text-sm"
          >
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

