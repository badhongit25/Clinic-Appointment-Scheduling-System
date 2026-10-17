import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import HomeView from './views/HomeView';
import PatientDashboard from './views/PatientDashboard';
import AdminDashboard from './views/AdminDashboard';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'dashboard' | 'admin'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('login');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedDoctor, setPreselectedDoctor] = useState(null);

  const handleOpenAuth = (tab = 'login') => {
    setAuthDefaultTab(tab);
    setAuthModalOpen(true);
  };

  const handleOpenBooking = (doctor = null) => {
    setPreselectedDoctor(doctor);
    setBookingModalOpen(true);
  };

  const handleAuthSuccess = (loggedUser) => {
    if (loggedUser.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onBookDoctor={handleOpenBooking}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'dashboard' && (
          <PatientDashboard
            onOpenBooking={() => handleOpenBooking(null)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onOpenAuth={handleOpenAuth}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
        onSuccess={handleAuthSuccess}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDoctor={preselectedDoctor}
        onSuccess={() => {
          if (user) {
            setCurrentView('dashboard');
          }
        }}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
