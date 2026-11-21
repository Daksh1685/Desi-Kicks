import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SeoHead } from '../components/SeoHead';
import { Icon } from '../components/ui/Icon';
import craftYourSoleLogo from '../assets/craftyoursole_logo.svg';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Read destination if user was redirected to login (e.g. from checkout)
  const queryRedirect = new URLSearchParams(location.search).get('redirect') || '/profile';

  // If already authenticated, redirect
  if (currentUser) {
    navigate(queryRedirect, { replace: true });
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      await signInWithGoogle();
      navigate(queryRedirect, { replace: true });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Google sign-in could not be completed. Please try again.';
      setAuthError(errorMsg);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/60">
      <SeoHead
        title="Sign In | CraftYourSole"
        description="Sign in to your CraftYourSole account with Google to track orders, manage your wishlist, and enjoy 1-click checkout."
        canonicalPath="/login"
        noindex
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
          <img src={craftYourSoleLogo} alt="CraftYourSole" className="h-8 w-auto mx-auto" />
        </Link>
        <h1 className="mt-5 font-anton text-2xl sm:text-3xl text-gray-900 tracking-wide uppercase">
          Welcome to CraftYourSole
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          Sign in to access your footwear wishlist, track deliveries, and enjoy fast 1-click checkout.
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-gray-200/80 shadow-md">
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Primary Action: Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-800 font-bold py-3.5 px-4 rounded-2xl border border-gray-300 shadow-xs hover:border-gray-400 transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Connecting to Google Cloud...' : 'Continue with Google'}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-bold tracking-wider text-[10px]">
                Member Benefits
              </span>
            </div>
          </div>

          {/* Perks list */}
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-orange-100 text-primary flex items-center justify-center shrink-0">
                <Icon name="package" className="w-3.5 h-3.5" />
              </div>
              <span><strong>Live Order Tracking</strong> and 36-hour doorstep size exchanges</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                <Icon name="favorite" className="w-3.5 h-3.5" />
              </div>
              <span><strong>Cloud Wishlist</strong> synced seamlessly across your devices</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Icon name="map_pin" className="w-3.5 h-3.5" />
              </div>
              <span><strong>1-Click Saved Addresses</strong> for fast Pan-India checkout</span>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col items-center gap-3">
            <Link
              to="/collections"
              className="text-xs text-gray-500 hover:text-primary font-medium hover:underline cursor-pointer"
            >
              Continue shopping as guest →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          By signing in, you agree to CraftYourSole’s{' '}
          <Link to="/terms" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

