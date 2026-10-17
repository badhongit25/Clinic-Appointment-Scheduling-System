import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login', onSuccess }) {
  const { login, register, loading } = useAuth();
  const [tab, setTab] = useState(defaultTab); // 'login' | 'register' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'register') {
      const res = await register(name, email, password, 'patient');
      if (res.success) {
        onSuccess && onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Registration failed');
      }
    } else {
      // login or admin
      const res = await login(email, password);
      if (res.success) {
        onSuccess && onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }
  };

  const handleAdminDemoFill = () => {
    setEmail('admin@clinic.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-950/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === 'login'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Patient Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === 'register'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setTab('admin'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === 'admin'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-100">
            {tab === 'register' && 'Create Patient Account'}
            {tab === 'login' && 'Welcome Back'}
            {tab === 'admin' && 'Admin Portal Access'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'register' && 'Sign up to manage your doctor appointments and health history'}
            {tab === 'login' && 'Enter your credentials to access your scheduled visits'}
            {tab === 'admin' && 'Sign in to manage appointments, schedules, and doctors'}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {tab === 'admin' ? 'Admin Email / ID' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder={tab === 'admin' ? 'admin@clinic.com' : 'patient@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Button for Admin */}
          {tab === 'admin' && (
            <button
              type="button"
              onClick={handleAdminDemoFill}
              className="w-full py-1.5 px-3 rounded-lg bg-cyan-950/50 border border-cyan-800/60 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-cyan-900/40 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Click here to auto-fill default admin credentials
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-slate-950 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-6 ${
              tab === 'admin'
                ? 'bg-gradient-to-r from-cyan-400 to-sky-400 shadow-cyan-500/25'
                : 'bg-gradient-to-r from-teal-400 to-cyan-400 shadow-teal-500/25'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {tab === 'register' && 'Complete Registration'}
                {tab === 'login' && 'Sign In to Account'}
                {tab === 'admin' && 'Unlock Admin Dashboard'}
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Developed by{' '}
            <a
              href="https://github.com/badhongit25"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline font-semibold"
            >
              Badhon
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
