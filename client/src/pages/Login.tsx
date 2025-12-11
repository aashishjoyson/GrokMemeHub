import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, MapPin, LogIn } from 'lucide-react';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  darkMode: boolean;
}

export default function Login({ setIsLoggedIn, darkMode }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
        },
        () => {
          setLocation('Location access denied');
        }
      );
    } else {
      setLocation('Geolocation not supported');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #7C3AED 0px, #7C3AED 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #7C3AED 0px, #7C3AED 1px, transparent 1px, transparent 40px)`,
        }}></div>
      </div>

      {/* Floating AI Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-20">🤖</div>
        <div className="absolute top-40 right-20 text-3xl animate-pulse opacity-20 delay-100">💡</div>
        <div className="absolute bottom-32 left-1/4 text-5xl animate-bounce opacity-20 delay-200">✨</div>
        <div className="absolute bottom-20 right-1/3 text-4xl animate-pulse opacity-20 delay-300">🚀</div>
        <div className="absolute top-1/2 right-10 text-3xl animate-bounce opacity-20">🧠</div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
              Login to GrokMemeHub
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome back to the AI humor universe
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Location Button */}
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl transition-all"
            >
              <MapPin className="w-5 h-5" />
              Get my location
            </button>

            {location && (
              <div className="text-center text-slate-600 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
                📍 {location}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-purple-600 dark:text-purple-400 hover:text-cyan-500 transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
