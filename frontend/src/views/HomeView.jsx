import React, { useState, useEffect } from 'react';
import { doctorApi } from '../api/apiClient';
import { 
  Calendar, 
  Clock, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  Star, 
  ArrowRight, 
  Stethoscope,
  Activity,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function HomeView({ onBookDoctor, onOpenAuth }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.getAll()
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Next-Gen Healthcare Scheduling
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Your Health, Our Priority. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  Book Top Doctors
                </span> In Seconds.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Experience seamless appointment scheduling with verified medical specialists. No waiting queues, instant email confirmations, and full control over your visits.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onBookDoctor(null)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/25 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment Now
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#doctors-section"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-base flex items-center justify-center gap-2 transition-all"
                >
                  <Stethoscope className="w-5 h-5 text-teal-400" />
                  View Doctors
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80">
                <div>
                  <h4 className="text-2xl font-bold text-white">50+</h4>
                  <p className="text-xs text-slate-400">Specialist Doctors</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-teal-400">99.8%</h4>
                  <p className="text-xs text-slate-400">Patient Satisfaction</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-cyan-400">24/7</h4>
                  <p className="text-xs text-slate-400">Support & Booking</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-950/40 backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Live Doctor Availability</h4>
                      <p className="text-xs text-teal-400 font-medium">Slots Available Today</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Online
                  </span>
                </div>

                <div className="py-6 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                        SJ
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Dr. Sarah Jenkins</p>
                        <p className="text-xs text-slate-400">Cardiology Dept</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onBookDoctor(doctors[0] || null)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 transition-colors"
                    >
                      Book
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                        RI
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Dr. Rafiqul Islam</p>
                        <p className="text-xs text-slate-400">Neurology Dept</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onBookDoctor(doctors[1] || null)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 transition-colors"
                    >
                      Book
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                        EW
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Dr. Emily Watson</p>
                        <p className="text-xs text-slate-400">Dermatology Dept</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onBookDoctor(doctors[2] || null)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 transition-colors"
                    >
                      Book
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    Instant Email Confirmation
                  </span>
                  <span>Free Cancellation</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">
            Departments & Specialties
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Comprehensive Medical Care Under One Roof
          </h2>
          <p className="text-slate-400 text-sm">
            Access our state-of-the-art specialized departments designed to give you the highest quality care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Cardiology', desc: 'Complete cardiovascular diagnosis, ECG, echo, and heart care therapies.', icon: '❤️', color: 'from-rose-500/20 to-rose-600/5' },
            { title: 'Neurology', desc: 'Expert consultation for migraines, nervous system health, and stroke recovery.', icon: '🧠', color: 'from-cyan-500/20 to-cyan-600/5' },
            { title: 'Dermatology', desc: 'Modern skin treatments, allergy management, and cosmetic dermatology.', icon: '✨', color: 'from-amber-500/20 to-amber-600/5' },
            { title: 'General Medicine', desc: 'Primary health consultations, routine checkups, and preventive treatments.', icon: '🩺', color: 'from-teal-500/20 to-teal-600/5' },
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-3xl bg-gradient-to-b ${item.color} border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-1`}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">
              Qualified Specialists
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">
              Meet Our Specialist Doctors
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Select your doctor and book your consultation in a few simple clicks.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div 
                key={doc.id}
                className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 hover:border-teal-500/50 transition-all hover:shadow-xl hover:shadow-teal-950/30 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                      {doc.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950 border border-slate-800 text-teal-400">
                      {doc.experience || '5+ Years'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-sm font-medium text-cyan-400 mt-0.5">{doc.specialty}</p>
                  <p className="text-xs text-slate-400 mt-1">{doc.department}</p>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-400" />
                      <span>{doc.available_days}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{doc.available_time}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onBookDoctor(doc)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/30 hover:border-teal-500 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book with {doc.name.split(' ')[1] || doc.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose ClinicCare */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Board Certified Doctors</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every physician on our platform is thoroughly verified with proven medical credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">No Waiting Room Delays</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your designated time slot is reserved and honored with streamlined digital check-in.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Confidential & Secure</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your patient records, contact info, and medical consultation details remain 100% private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
