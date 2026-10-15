import React from 'react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'find' | 'register' | 'requests' | 'about' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-base tracking-tight">Blood Donor Finder</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering voluntary humanitarian donors and recipients through rapid distance matching, authenticated blood records, and emergency alerts.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <p className="font-semibold text-slate-200">National Blood Bank Helpline:</p>
              <p className="text-rose-400 font-mono font-bold text-sm mt-0.5">104 / 112 (24x7 Toll-Free)</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Search Compatible Donors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('requests')}
                  className="hover:text-white transition-colors cursor-pointer text-rose-400"
                >
                  Emergency Blood Board
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Donor Enrollment Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Medical Verifier & Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Blood Compatibility Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Donor Eligibility</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Age: 18 to 65 years</li>
              <li>• Minimum weight: 50 kg (110 lbs)</li>
              <li>• Hemoglobin: Minimum 12.5 g/dL</li>
              <li>• Interval: 90 days for whole blood</li>
              <li>• Pulse & BP: Within normal medical limits</li>
              <li>• Valid photo ID & medical clearance</li>
            </ul>
          </div>

          {/* Legal & Emergency Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Emergency Medical Disclaimer</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Blood Donor Finder is a community volunteer matching system. We do not store, test, or collect blood units directly. All transfusions and eligibility screenings must occur inside certified clinical hospitals and licensed blood banks under qualified medical supervision.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In severe acute trauma or life-threatening hemorrhage, immediately alert local hospital emergency rooms and government blood banks.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Blood Donor Finder Network. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition-colors">Privacy & Consent Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300 transition-colors">HIPAA/NABH Compliance</span>
            <span>·</span>
            <span className="hover:text-slate-300 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
