import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentApi } from '../api/apiClient';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  RefreshCw, 
  Trash2,
  FileText
} from 'lucide-react';

export default function PatientDashboard({ onOpenBooking }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Pending' | 'Confirmed' | 'Cancelled'
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await appointmentApi.getAll(user.email);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load user appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    try {
      await appointmentApi.updateStatus(id, 'Cancelled');
      await fetchAppointments();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = appointments.filter(a => {
    if (filter === 'ALL') return true;
    return a.status.toLowerCase() === filter.toLowerCase();
  });

  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900/40 via-cyan-900/30 to-slate-900 border border-teal-800/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-teal-950/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800/80">
            Patient Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Welcome, {user?.name || 'Valued Patient'}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Track and manage your upcoming consultations and medical appointments.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Book New Appointment
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Bookings</p>
            <h3 className="text-2xl font-bold text-white mt-1">{total}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400">Pending Review</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">{pending}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/50 text-amber-400 flex items-center justify-center border border-amber-800/40">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-teal-400">Confirmed Visits</p>
            <h3 className="text-2xl font-bold text-teal-300 mt-1">{confirmed}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-950/50 text-teal-400 flex items-center justify-center border border-teal-800/40">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Appointments List Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Your Appointments</h3>
            <p className="text-xs text-slate-400">All registered appointments under {user?.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              {['ALL', 'Pending', 'Confirmed', 'Cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === tab
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={fetchAppointments}
              title="Refresh Appointments"
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-teal-400 hover:border-teal-500/50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-slate-950/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-slate-300">No appointments found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === 'ALL'
                ? "You haven't scheduled any medical appointments yet. Click below to book your first visit."
                : `No appointments with status "${filter}".`}
            </p>
            {filter === 'ALL' && (
              <button
                onClick={onOpenBooking}
                className="mt-3 px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20"
              >
                Book Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((appt) => {
              const isPending = appt.status === 'Pending';
              const isConfirmed = appt.status === 'Confirmed';
              const isCancelled = appt.status === 'Cancelled';

              return (
                <div
                  key={appt.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{appt.doctor_name}</h4>
                          <p className="text-xs text-teal-400 font-medium">{appt.doctor_dept}</p>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          isConfirmed
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                            : isCancelled
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                        }`}
                      >
                        {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isPending && <Clock className="w-3.5 h-3.5" />}
                        {isCancelled && <XCircle className="w-3.5 h-3.5" />}
                        {appt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{appt.appointment_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{appt.appointment_time}</span>
                      </div>
                    </div>

                    {appt.problem && (
                      <p className="text-xs text-slate-400 italic">
                        "{appt.problem}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      ID: #{appt.id}
                    </span>

                    {appt.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        disabled={cancellingId === appt.id}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900/40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {cancellingId === appt.id ? 'Cancelling...' : 'Cancel Visit'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
