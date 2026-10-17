import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentApi, doctorApi } from '../api/apiClient';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  UserCheck, 
  Check, 
  X, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  Stethoscope, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function AdminDashboard({ onOpenAuth }) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'doctors'
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Add doctor modal form
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialty: '',
    department: '',
    experience: '5+ years',
    available_days: 'Mon - Thu',
    available_time: '10:00 AM - 04:00 PM'
  });
  const [addingDoc, setAddingDoc] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appts, docs] = await Promise.all([
        appointmentApi.getAll(),
        doctorApi.getAll()
      ]);
      setAppointments(appts);
      setDoctors(docs);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Admin Privileges Required</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          You need to be logged in as an administrator to manage clinic appointments and medical personnel.
        </p>
        <button
          onClick={() => onOpenAuth('admin')}
          className="mt-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  // Update appointment status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this appointment record?')) return;
    try {
      await appointmentApi.delete(id);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete appointment');
    }
  };

  // Add doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setAddingDoc(true);
    try {
      await doctorApi.create(newDoc);
      setShowAddDocModal(false);
      setNewDoc({
        name: '',
        specialty: '',
        department: '',
        experience: '5+ years',
        available_days: 'Mon - Thu',
        available_time: '10:00 AM - 04:00 PM'
      });
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to add doctor');
    } finally {
      setAddingDoc(false);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor from the system?')) return;
    try {
      await doctorApi.delete(id);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete doctor');
    }
  };

  // Filters
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'ALL' || a.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (a.patient_name && a.patient_name.toLowerCase().includes(query)) ||
      (a.patient_email && a.patient_email.toLowerCase().includes(query)) ||
      (a.doctor_name && a.doctor_name.toLowerCase().includes(query)) ||
      (a.doctor_dept && a.doctor_dept.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-800/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-cyan-950/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800/80">
            Administrative Control Panel
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Clinic Master Dashboard
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Real-time management for patient requests, doctor schedules, and clinical operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'appointments'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Appointments ({total})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'doctors'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Doctors ({doctors.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Total Bookings</p>
          <h3 className="text-2xl font-bold text-white mt-1">{total}</h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold text-amber-400">Pending Review</p>
          <h3 className="text-2xl font-bold text-amber-300 mt-1">{pending}</h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold text-emerald-400">Approved Visits</p>
          <h3 className="text-2xl font-bold text-emerald-300 mt-1">{confirmed}</h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold text-rose-400">Rejected / Cancelled</p>
          <h3 className="text-2xl font-bold text-rose-300 mt-1">{cancelled}</h3>
        </div>
      </div>

      {/* TAB 1: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          
          {/* Controls: Search, Filter, Refresh */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by patient, email, doctor, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
                {['ALL', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      statusFilter === status
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchData}
                title="Refresh Table"
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-4">Patient</th>
                  <th className="py-4 px-4">Doctor & Dept</th>
                  <th className="py-4 px-4">Date & Time</th>
                  <th className="py-4 px-4">Problem</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                      <p className="mt-2 text-xs">Loading records...</p>
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                      No appointments match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Patient */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-white text-sm">{item.patient_name}</p>
                        <p className="text-xs text-slate-400">{item.patient_email}</p>
                      </td>

                      {/* Doctor */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-cyan-300 text-sm">{item.doctor_name}</p>
                        <p className="text-xs text-slate-400">{item.doctor_dept}</p>
                      </td>

                      {/* Date / Time */}
                      <td className="py-4 px-4">
                        <p className="text-slate-200 text-xs font-semibold">{item.appointment_date}</p>
                        <p className="text-[11px] text-slate-400">{item.appointment_time}</p>
                      </td>

                      {/* Problem */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {item.problem || '—'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            item.status === 'Confirmed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : item.status === 'Cancelled'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'Confirmed')}
                                title="Accept & Confirm (Sends Email)"
                                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-800/60 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
                                title="Reject Appointment"
                                className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-800/60 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDeleteAppointment(item.id)}
                            title="Delete Record"
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: DOCTORS MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white">Registered Specialists</h3>
              <p className="text-xs text-slate-400">Configure clinic physicians, specialties, and visiting hours</p>
            </div>

            <button
              onClick={() => setShowAddDocModal(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Doctor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div 
                key={doc.id}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{doc.name}</h4>
                      <p className="text-xs font-semibold text-cyan-400">{doc.specialty}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{doc.department}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteDoctor(doc.id)}
                      title="Remove Doctor"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <p><span className="text-slate-500">Experience:</span> {doc.experience}</p>
                    <p><span className="text-slate-500">Days:</span> {doc.available_days}</p>
                    <p><span className="text-slate-500">Hours:</span> {doc.available_time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowAddDocModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Add Specialist Doctor</h3>

            <form onSubmit={handleAddDoctor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sabrina Noor"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiologist"
                    value={newDoc.specialty}
                    onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiology"
                    value={newDoc.department}
                    onChange={(e) => setNewDoc({ ...newDoc, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Available Days</label>
                  <input
                    type="text"
                    placeholder="Mon - Thu"
                    value={newDoc.available_days}
                    onChange={(e) => setNewDoc({ ...newDoc, available_days: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Visiting Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 04:00 PM"
                    value={newDoc.available_time}
                    onChange={(e) => setNewDoc({ ...newDoc, available_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addingDoc}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 mt-4 flex items-center justify-center gap-2"
              >
                {addingDoc ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Doctor'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
