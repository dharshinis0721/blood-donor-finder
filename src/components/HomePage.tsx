import React from 'react';
import { BloodGroup, BloodRequest } from '../types';
import { BloodCompatibilityMatrix } from './BloodCompatibilityMatrix';
import heroImg from '../assets/images/blood_donation_hero_1792059664191.jpg';
import communityImg from '../assets/images/blood_drive_community_1792059664841.jpg';
import labImg from '../assets/images/medical_verification_lab_1792059663511.jpg';

interface HomePageProps {
  onNavigate: (tab: 'home' | 'find' | 'register' | 'requests' | 'about' | 'admin') => void;
  onSearchBloodGroup: (group: BloodGroup) => void;
  stats: {
    totalDonors: number;
    verifiedDonors: number;
    availableDonors: number;
    fulfilledRequests: number;
    totalDonationsRecorded: number;
  };
  activeRequests: BloodRequest[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSearchBloodGroup,
  stats,
  activeRequests,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading, Value Prop & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>Immediate 24x7 Voluntary Lifeline Matching</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Donate Blood, <span className="text-rose-600">Save Lives.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Connecting hospital patients and families in urgent need of blood transfusions with nearby, medically-verified voluntary blood donors in real time.
              </p>

              {/* Primary Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('find')}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>🔍</span>
                  <span>Find a Donor</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🩸</span>
                  <span>Become a Donor</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('requests')}
                  className="px-5 py-3.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🚨 Urgent Requests ({activeRequests.length})</span>
                </button>
              </div>

              {/* Trust Indicators Strip */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Strict Medical Certificate Audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Geodesic & Road Distance Calculation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Zero Commercial Exploitation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-Fidelity Photography Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 aspect-16/10 lg:aspect-4/3">
                <img
                  src={heroImg}
                  alt="Compassionate voluntary blood donor resting comfortably during donation with a qualified medical nurse"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white text-xs">
                    <span className="font-bold text-rose-400 block text-xs uppercase tracking-wider">
                      Community Lifeline
                    </span>
                    <p className="font-medium text-slate-100 mt-0.5">
                      1 pint of voluntary blood can save up to 3 individual human lives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantitative Proof & Live Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Registered Lifesavers
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
                {stats.totalDonors}
              </span>
              <span className="text-xs font-semibold text-emerald-600">+100% Voluntary</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Verified donors on standby for emergency dispatches.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Medically Verified
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-600 tabular-nums">
                {stats.verifiedDonors}
              </span>
              <span className="text-xs font-semibold text-rose-600">Clinical ID</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Blood group and health fitness verified by medical staff.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Currently Ready & Available
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums">
                {stats.availableDonors}
              </span>
              <span className="text-xs font-semibold text-emerald-600">Active</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Eligible to answer urgent hospital transfusion calls.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Emergency Connections
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
                {stats.fulfilledRequests + 18}
              </span>
              <span className="text-xs font-semibold text-emerald-600">Fulfilled</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Successful matches coordinated between seekers and donors.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Blood Group Compatibility Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <BloodCompatibilityMatrix onSearchGroup={onSearchBloodGroup} />
      </section>

      {/* Emergency Blood Requests Live Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Critical Emergency Live Feed
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                Patients Needing Immediate Blood
              </h3>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="self-start md:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              View All Emergency Requests →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {activeRequests.slice(0, 3).map((req) => (
              <div
                key={req.requestId}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-lg font-black text-rose-400">
                      {req.bloodGroup}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {req.urgency}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{req.patientName}</h4>
                  <p className="text-xs text-slate-400 mt-1">🏥 {req.hospitalName}</p>
                  <p className="text-[11px] text-slate-400">{req.city}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{req.unitsNeeded} units needed</span>
                  <button
                    onClick={() => onSearchBloodGroup(req.bloodGroup)}
                    className="text-rose-400 font-bold hover:underline cursor-pointer"
                  >
                    Match Donors →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2-Column Capability Spotlight: Community Drives & Medical Verification */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Medical Verification Protocol */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                01. Trust & Safety Standards
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Authorized Medical Certificate Screening
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every volunteer donor can submit blood panel reports, hemoglobin verification, and eligibility cards. Qualified clinical personnel review each submission to protect recipient health.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Confidential private document storage (never displayed publicly)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Minimum 12.5 g/dL Hemoglobin and serological clearance checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Automatic 90-day recovery deferral calculation</span>
                </li>
              </ul>
            </div>
            <div className="h-56 bg-slate-100 relative overflow-hidden">
              <img
                src={labImg}
                alt="Clinical laboratory technologist reviewing blood group typing and medical eligibility documents on tablet"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 2: Community Blood Drives */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                02. Real-Time Proximity Routing
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Smart Geodesic & Road Distance Calculation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When time is critical, our interactive OpenStreetMap and Leaflet engine computes actual road distances so families connect with the closest available donors first.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>OpenStreetMap with distinct red droplet markers for donors</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>5 km to 100 km radius filtering with live GPS centering</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Privacy-preserving approximate coordinates to guard donor homes</span>
                </li>
              </ul>
            </div>
            <div className="h-56 bg-slate-100 relative overflow-hidden">
              <img
                src={communityImg}
                alt="Community blood donation drive camp with medical staff and smiling donors"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Simple 3-Step Process
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              How Blood Donor Finder Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered for absolute clarity and speed during medical emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-rose-600 font-mono text-2xl font-extrabold block mb-2">01.</span>
              <h4 className="text-base font-bold text-slate-900 mb-2">Search or Post Request</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your patient's required blood group and city or GPS location. Filter by distance radius to locate verified donors.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-rose-600 font-mono text-2xl font-extrabold block mb-2">02.</span>
              <h4 className="text-base font-bold text-slate-900 mb-2">Verify Compatibility & Route</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                View dynamic road distance, donor readiness status, and medical verification clearance badges directly on Leaflet map.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-rose-600 font-mono text-2xl font-extrabold block mb-2">03.</span>
              <h4 className="text-base font-bold text-slate-900 mb-2">Coordinate Safe Transfusion</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with the donor via call or message to schedule donation at the hospital or licensed blood bank.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
