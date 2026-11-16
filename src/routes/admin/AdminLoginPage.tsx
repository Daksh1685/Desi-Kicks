import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import { SeoHead } from '../../components/SeoHead';
import craftYourSoleLogo from '../../assets/craftyoursole_logo.svg';

interface AdminLoginPageProps {
  loginUser: string;
  setLoginUser: (v: string) => void;
  loginPassword: string;
  setLoginPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  loginError: string | null;
  setLoginError: (v: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function AdminLoginPage({
  loginUser, setLoginUser,
  loginPassword, setLoginPassword,
  showPassword, setShowPassword,
  rememberMe, setRememberMe,
  loginError, setLoginError,
  onSubmit, onBack,
}: AdminLoginPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <SeoHead
        title="Admin Login | CraftYourSole"
        description="Restricted Administrator Operations Portal."
        canonicalPath="/admin"
        noindex
      />
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <img
              src={craftYourSoleLogo}
              alt="CraftYourSole"
              className="h-8 sm:h-9 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your administrator credentials</p>

          {loginError && (
            <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <span className="mt-0.5">⚠</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <Icon
                  name="person"
                  className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => { setLoginUser(e.target.value); setLoginError(null); }}
                  placeholder="admin@craftyoursole.in"
                  autoComplete="username"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Icon
                  name="lock"
                  className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(null); }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs cursor-pointer select-none"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-primary hover:bg-[#8a2600] text-white font-bold text-sm rounded-lg transition-colors cursor-pointer shadow-sm mt-1"
            >
              Sign In →
            </button>
          </form>
        </div>

        <button
          onClick={onBack}
          className="mt-5 mx-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <Icon name="arrow_left" className="w-4 h-4" />
          Back to Storefront
        </button>
      </div>
    </div>
  );
}
