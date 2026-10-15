/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Donor, BloodGroup, UserSession } from './types';
import { donorService } from './services/donorService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { FindDonorsPage } from './components/FindDonorsPage';
import { DonorRegistrationForm } from './components/DonorRegistrationForm';
import { EmergencyRequestsPage } from './components/EmergencyRequestsPage';
import { AboutUsPage } from './components/AboutUsPage';
import { AdminPortal } from './components/AdminPortal';
import { DonorPortal } from './components/DonorPortal';
import { DonorDetailsModal } from './components/DonorDetailsModal';
import { ContactDonorModal } from './components/ContactDonorModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'find' | 'register' | 'requests' | 'about' | 'admin' | 'donor-portal'
  >('home');

  const [preselectedBloodGroup, setPreselectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedDonorForDetails, setSelectedDonorForDetails] = useState<Donor | null>(null);
  const [selectedDonorForContact, setSelectedDonorForContact] = useState<Donor | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [newlyRegisteredDonor, setNewlyRegisteredDonor] = useState<Donor | null>(null);

  // Auth session
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const raw = localStorage.getItem('bdf_user_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [activeDonorProfile, setActiveDonorProfile] = useState<Donor | null>(() => {
    try {
      const raw = localStorage.getItem('bdf_active_donor');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState(() => donorService.getStats());
  const [activeRequests, setActiveRequests] = useState(() =>
    donorService.getEmergencyRequests().filter((r) => r.status === 'Active')
  );

  const refreshPlatformData = () => {
    setStats(donorService.getStats());
    setActiveRequests(donorService.getEmergencyRequests().filter((r) => r.status === 'Active'));
  };

  useEffect(() => {
    refreshPlatformData();
  }, [activeTab]);

  const handleLoginSuccess = (session: UserSession, donor?: Donor) => {
    setUserSession(session);
    localStorage.setItem('bdf_user_session', JSON.stringify(session));

    if (donor) {
      setActiveDonorProfile(donor);
      localStorage.setItem('bdf_active_donor', JSON.stringify(donor));
    }

    setShowLoginModal(false);

    if (session.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('donor-portal');
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setActiveDonorProfile(null);
    localStorage.removeItem('bdf_user_session');
    localStorage.removeItem('bdf_active_donor');
    setActiveTab('home');
  };

  const handleSearchBloodGroupFromHome = (bg: BloodGroup) => {
    setPreselectedBloodGroup(bg);
    setActiveTab('find');
  };

  const handleFulfillMatch = (bg: BloodGroup) => {
    setPreselectedBloodGroup(bg);
    setActiveTab('find');
  };

  const handleDonorRegistrationSuccess = (donor: Donor) => {
    setNewlyRegisteredDonor(donor);
    refreshPlatformData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'admin' && (!userSession || userSession.role !== 'admin')) {
            setShowLoginModal(true);
            return;
          }
          if (tab === 'donor-portal' && (!userSession || userSession.role !== 'donor')) {
            setShowLoginModal(true);
            return;
          }
          setActiveTab(tab);
        }}
        userSession={userSession}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => {
              if (tab === 'admin' && (!userSession || userSession.role !== 'admin')) {
                setShowLoginModal(true);
                return;
              }
              setActiveTab(tab);
            }}
            onSearchBloodGroup={handleSearchBloodGroupFromHome}
            stats={stats}
            activeRequests={activeRequests}
          />
        )}

        {activeTab === 'find' && (
          <FindDonorsPage
            initialBloodGroup={preselectedBloodGroup}
            onSelectDonorDetails={(donor) => setSelectedDonorForDetails(donor)}
            onContactDonor={(donor) => setSelectedDonorForContact(donor)}
          />
        )}

        {activeTab === 'register' && (
          <div className="py-8 px-4 sm:px-6">
            <DonorRegistrationForm
              onSuccess={handleDonorRegistrationSuccess}
              onCancel={() => setActiveTab('home')}
            />
          </div>
        )}

        {activeTab === 'requests' && (
          <EmergencyRequestsPage onFulfillMatch={handleFulfillMatch} />
        )}

        {activeTab === 'about' && <AboutUsPage />}

        {activeTab === 'admin' && userSession?.role === 'admin' && (
          <AdminPortal onLogout={handleLogout} />
        )}

        {activeTab === 'donor-portal' && activeDonorProfile && (
          <DonorPortal
            donor={activeDonorProfile}
            onUpdateDonor={(updated) => {
              setActiveDonorProfile(updated);
              localStorage.setItem('bdf_active_donor', JSON.stringify(updated));
              refreshPlatformData();
            }}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          if (tab === 'admin' && (!userSession || userSession.role !== 'admin')) {
            setShowLoginModal(true);
            return;
          }
          setActiveTab(tab);
        }}
      />

      {/* Modals */}
      {selectedDonorForDetails && (
        <DonorDetailsModal
          donor={selectedDonorForDetails}
          onClose={() => setSelectedDonorForDetails(null)}
          onInitiateContact={(donor) => {
            setSelectedDonorForDetails(null);
            setSelectedDonorForContact(donor);
          }}
        />
      )}

      {selectedDonorForContact && (
        <ContactDonorModal
          donor={selectedDonorForContact}
          onClose={() => setSelectedDonorForContact(null)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => {
            setShowLoginModal(false);
            setActiveTab('register');
          }}
        />
      )}

      {/* Registration Success Celebration Modal */}
      {newlyRegisteredDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Registration Successful
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Welcome to the Lifesaver Network!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your voluntary profile has been assigned unique identification code:
              </p>
              <div className="my-3 py-2 px-4 bg-slate-100 rounded-xl inline-block border border-slate-200 font-mono text-lg font-extrabold text-rose-600">
                {newlyRegisteredDonor.donorId}
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Your medical clearance document has been sent to our medical review queue. You can now receive emergency inquiries from verified hospital coordinators.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setNewlyRegisteredDonor(null);
                  setActiveTab('find');
                }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Search Nearby Donors
              </button>
              <button
                type="button"
                onClick={() => {
                  const registered = newlyRegisteredDonor;
                  setNewlyRegisteredDonor(null);
                  handleLoginSuccess(
                    {
                      role: 'donor',
                      email: registered.email,
                      name: registered.fullName,
                      donorId: registered.donorId,
                    },
                    registered
                  );
                }}
                className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Open My Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
