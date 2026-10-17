import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Calendar, 
  User, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X, 
  PlusCircle, 
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, onOpenBooking, onOpenAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-sky-400 bg-clip-text text-transparent">
                ClinicCare
              </span>
              <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                Appointment System
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                currentView === 'home'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            {user && (
              <button
                onClick={() => setCurrentView(isAdmin ? 'admin' : 'dashboard')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  currentView === (isAdmin ? 'admin' : 'dashboard')
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {isAdmin ? (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    Admin Portal
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    My Appointments
                  </>
                )}
              </button>
            )}
          </nav>

          {/* Action CTAs & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 stroke-[2.5]" />
              Book Appointment
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800/60">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm flex items-center gap-2 transition-all"
              >
                <User className="w-4 h-4 text-teal-400" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-4 rounded-xl text-slate-300 hover:bg-slate-900 font-medium"
          >
            Home
          </button>
          {user && (
            <button
              onClick={() => { setCurrentView(isAdmin ? 'admin' : 'dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-4 rounded-xl text-slate-300 hover:bg-slate-900 font-medium flex items-center gap-2"
            >
              {isAdmin ? <ShieldAlert className="w-4 h-4 text-amber-400" /> : <LayoutDashboard className="w-4 h-4 text-teal-400" />}
              {isAdmin ? 'Admin Portal' : 'My Appointments'}
            </button>
          )}
          <button
            onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }}
            className="w-full py-3 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
          {user ? (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 rounded-xl text-rose-400 bg-rose-950/30 border border-rose-900/40 font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out ({user.name})
            </button>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 rounded-xl text-slate-200 bg-slate-900 border border-slate-800 font-medium flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-teal-400" />
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
}
