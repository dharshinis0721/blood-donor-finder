import React from 'react';
import { UserSession } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'find' | 'register' | 'requests' | 'about' | 'admin' | 'donor-portal';
  setActiveTab: (tab: 'home' | 'find' | 'register' | 'requests' | 'about' | 'admin' | 'donor-portal') => void;
  userSession: UserSession | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userSession,
  onLogout,
  onOpenLogin,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm shadow-rose-200 group-hover:bg-rose-700 transition-colors">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
              Blood Donor Finder
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-normal">
              Emergency Lifeline Network
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              activeTab === 'home'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('find')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              activeTab === 'find'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : ''
            }`}
          >
            Find Donors
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : ''
            }`}
          >
            <span>Emergency Requests</span>
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              activeTab === 'register'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : ''
            }`}
          >
            Register as Donor
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              activeTab === 'about'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : ''
            }`}
          >
            About Us
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {userSession ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActiveTab(userSession.role === 'admin' ? 'admin' : 'donor-portal')
                }
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors text-slate-800 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>{userSession.role === 'admin' ? '🛡️ Admin Panel' : '👤 My Profile'}</span>
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm shadow-rose-200 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Become a Donor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'home' ? 'text-rose-600 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('find')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'find' ? 'text-rose-600 font-bold' : ''}`}
        >
          Find Donors
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'requests' ? 'text-rose-600 font-bold' : ''}`}
        >
          Requests
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'register' ? 'text-rose-600 font-bold' : ''}`}
        >
          Register
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'about' ? 'text-rose-600 font-bold' : ''}`}
        >
          About
        </button>
      </div>
    </header>
  );
};
