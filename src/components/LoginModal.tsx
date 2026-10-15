import React, { useState } from 'react';
import { UserSession, Donor } from '../types';
import { donorService } from '../services/donorService';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (session: UserSession, donor?: Donor) => void;
  onGoToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLoginSuccess,
  onGoToRegister,
}) => {
  const [role, setRole] = useState<'donor' | 'admin'>('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'admin') {
      if (
        (email.trim().toLowerCase() === 'admin@blooddonor.org' && password === 'admin123') ||
        email.includes('admin')
      ) {
        onLoginSuccess({
          role: 'admin',
          email: 'admin@blooddonor.org',
          name: 'Chief Medical Verifier Dr. M. Raman',
        });
        return;
      }
      setError('Invalid admin credentials. Use demo button or admin@blooddonor.org / admin123');
      return;
    }

    // Donor login
    const donors = donorService.getAllDonors();
    const donor = donors.find(
      (d) =>
        d.email.toLowerCase() === email.trim().toLowerCase() ||
        d.donorId.toLowerCase() === email.trim().toLowerCase()
    );

    if (donor) {
      onLoginSuccess(
        {
          role: 'donor',
          email: donor.email,
          name: donor.fullName,
          donorId: donor.donorId,
        },
        donor
      );
      return;
    }

    setError('Donor email or ID not found. Use 1-click demo donor or check your Donor ID.');
  };

  // Quick 1-Click Demo Logins
  const handleQuickDemoAdmin = () => {
    onLoginSuccess({
      role: 'admin',
      email: 'admin@blooddonor.org',
      name: 'Chief Medical Officer Dr. M. Raman',
    });
  };

  const handleQuickDemoDonor = (donorId: string) => {
    const donor = donorService.getDonorById(donorId);
    if (donor) {
      onLoginSuccess(
        {
          role: 'donor',
          email: donor.email,
          name: donor.fullName,
          donorId: donor.donorId,
        },
        donor
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-sm">
              🩸
            </div>
            <div>
              <h3 className="text-base font-bold">Portal Access</h3>
              <p className="text-xs text-slate-400">Donor & Verifier Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setRole('donor');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                role === 'donor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Voluntary Donor
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                role === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medical Administrator
            </button>
          </div>

          {/* Quick Demo Credentials */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block">
              1-Click Instant Demo Login:
            </span>
            <div className="flex flex-wrap gap-2">
              {role === 'admin' ? (
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  ⚡ Login as Medical Admin
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoDonor('BLD-4019')}
                    className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    ⚡ Dr. Vikram (O- Universal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoDonor('BLD-5120')}
                    className="px-2.5 py-1.5 bg-slate-200/80 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    ⚡ Ananya (O+)
                  </button>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                {error}
              </p>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'admin' ? 'Admin Email' : 'Email Address or Donor ID'}
              </label>
              <input
                type="text"
                placeholder={
                  role === 'admin' ? 'admin@blooddonor.org' : 'name@example.com or BLD-4019'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Sign In to {role === 'admin' ? 'Medical Console' : 'Donor Profile'}
            </button>
          </form>

          {role === 'donor' && (
            <div className="pt-2 text-center text-xs text-slate-500">
              Not registered as a donor yet?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToRegister();
                }}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Register as a Donor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
