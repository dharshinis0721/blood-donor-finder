import React, { useState } from 'react';
import { Donor, DocumentVerificationStatus, AvailabilityStatus } from '../types';
import { donorService } from '../services/donorService';

interface AdminPortalProps {
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [donors, setDonors] = useState<Donor[]>(() => donorService.getAllDonors());
  const [stats, setStats] = useState(() => donorService.getStats());
  const [activeTab, setActiveTab] = useState<'verification' | 'donors' | 'analytics'>('verification');

  const [selectedDonorForReview, setSelectedDonorForReview] = useState<Donor | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = () => {
    setDonors(donorService.getAllDonors());
    setStats(donorService.getStats());
  };

  const handleVerify = (status: DocumentVerificationStatus) => {
    if (!selectedDonorForReview) return;
    donorService.adminVerifyDocument(
      selectedDonorForReview.donorId,
      status,
      reviewNotes || (status === 'Verified' ? 'Document verified by Medical Admin.' : 'Document rejected.'),
      'Chief Medical Officer Dr. M. Raman'
    );
    setSelectedDonorForReview(null);
    setReviewNotes('');
    refreshData();
  };

  const handleToggleDonorStatus = (donorId: string, currentStatus: AvailabilityStatus) => {
    const nextStatus: AvailabilityStatus =
      currentStatus === 'Available' ? 'Temporarily Unavailable' : 'Available';
    donorService.updateAvailability(donorId, nextStatus);
    refreshData();
  };

  const handleDeleteDonor = (donorId: string) => {
    if (window.confirm(`Are you sure you want to permanently remove donor record ${donorId}?`)) {
      donorService.deleteDonor(donorId);
      refreshData();
    }
  };

  const pendingDocuments = donors.filter(
    (d) => d.medicalCertificate?.verificationStatus === 'Pending Review'
  );

  const filteredDonors = donors.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.fullName.toLowerCase().includes(q) ||
      d.donorId.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.bloodGroup.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Admin & Medical Verification Console
            </span>
            <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
              Authenticated Session
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Clinical Review & Platform Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit voluntary medical certificates, manage donor registrations, and oversee emergency requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              donorService.resetDefaults();
              refreshData();
            }}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Reset Seed Data
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Registered Donors
          </span>
          <p className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
            {stats.totalDonors}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all cities</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Medically Verified
          </span>
          <p className="text-2xl font-extrabold font-mono text-emerald-600 mt-1 tabular-nums">
            {stats.verifiedDonors}
          </p>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">Clinical clearance confirmed</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Pending Certificates
          </span>
          <p className="text-2xl font-extrabold font-mono text-amber-600 mt-1 tabular-nums">
            {pendingDocuments.length}
          </p>
          <span className="text-[11px] text-amber-600/80 mt-1 block">Require physician review</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Urgent Requests Handled
          </span>
          <p className="text-2xl font-extrabold font-mono text-rose-600 mt-1 tabular-nums">
            {stats.fulfilledRequests + stats.activeRequests}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.fulfilledRequests} fulfilled successfully
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📋 Medical Review Queue</span>
          {pendingDocuments.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-white text-rose-600 font-mono text-[10px]">
              {pendingDocuments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('donors')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'donors'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          👥 Donor Directory ({donors.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          📊 Blood Inventory Statistics
        </button>
      </div>

      {/* Tab 1: Medical Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Pending Document Verification Queue ({pendingDocuments.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted CBC test panels, donor eligibility forms, and laboratory serology reports before marking as verified.
              </p>
            </div>

            {pendingDocuments.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <span className="text-2xl block mb-2">🎉</span>
                All submitted medical documents have been reviewed and validated!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingDocuments.map((donor) => (
                  <div
                    key={donor.donorId}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white bg-rose-600 px-2 py-0.5 rounded text-xs">
                          {donor.bloodGroup}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{donor.fullName}</h4>
                        <span className="text-xs font-mono text-slate-400">({donor.donorId})</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        File: <strong className="text-slate-800">{donor.medicalCertificate.fileName}</strong> ·
                        Uploaded on {donor.medicalCertificate.uploadDate}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Location: {donor.city}, {donor.state} · Age: {donor.age}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDonorForReview(donor);
                        setReviewNotes(donor.medicalCertificate.reviewNotes || '');
                      }}
                      className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Review & Validate Document
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Verified Documents Reference List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recently Reviewed Medical Certificates
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2.5">Donor</th>
                    <th className="pb-2.5">Blood Group</th>
                    <th className="pb-2.5">Document File</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Reviewed By</th>
                    <th className="pb-2.5">Reviewer Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donors
                    .filter((d) => d.medicalCertificate?.verificationStatus !== 'Pending Review')
                    .map((d) => (
                      <tr key={d.donorId} className="hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-900">{d.fullName}</td>
                        <td className="py-3 font-mono font-bold text-rose-600">{d.bloodGroup}</td>
                        <td className="py-3 text-slate-600 font-mono text-[11px]">
                          {d.medicalCertificate.fileName}
                        </td>
                        <td className="py-3">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                              d.medicalCertificate.verificationStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {d.medicalCertificate.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 text-[11px]">
                          {d.medicalCertificate.reviewedBy || 'System Admin'}
                        </td>
                        <td className="py-3 text-slate-500 text-[11px] max-w-xs truncate">
                          {d.medicalCertificate.reviewNotes || '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Donor Management */}
      {activeTab === 'donors' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Donor Records Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Deactivate duplicate profiles, toggle availability, and monitor donor activity.
              </p>
            </div>
            <input
              type="text"
              placeholder="Filter by name, ID, city, blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 w-full sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-3">Donor ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Blood Group</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Availability</th>
                  <th className="pb-3">Certificate</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.map((d) => (
                  <tr key={d.donorId} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-slate-600">{d.donorId}</td>
                    <td className="py-3 font-semibold text-slate-900">{d.fullName}</td>
                    <td className="py-3 font-mono font-bold text-rose-600">{d.bloodGroup}</td>
                    <td className="py-3 font-mono text-slate-600">{d.mobileNumber}</td>
                    <td className="py-3 text-slate-700">{d.city}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleDonorStatus(d.donorId, d.availabilityStatus)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          d.availabilityStatus === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title="Click to toggle availability"
                      >
                        ● {d.availabilityStatus}
                      </button>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-semibold ${
                          d.medicalCertificate?.verificationStatus === 'Verified'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {d.medicalCertificate?.verificationStatus || 'None'}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteDonor(d.donorId)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        title="Delete Record"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Available Blood Group Inventory</h3>
            <p className="text-xs text-slate-500">
              Real-time count of active and available voluntary donors per blood type.
            </p>
            <div className="space-y-3 pt-2">
              {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((group) => {
                const count = stats.bloodGroupCounts[group] || 0;
                const pct = Math.min(100, (count / (stats.availableDonors || 1)) * 100);
                return (
                  <div key={group} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono font-bold text-slate-800">{group}</span>
                      <span className="font-mono font-bold text-rose-600">{count} donors</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-600 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Clinical Verification Standards</h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>1. Serological Screening:</strong> Documents should indicate non-reactive status for HIV, Hepatitis B & C, and Syphilis.
              </p>
              <p>
                <strong>2. Hemoglobin Criteria:</strong> Female donors &ge; 12.5 g/dL, Male donors &ge; 13.0 g/dL.
              </p>
              <p>
                <strong>3. Deferral Periods:</strong> Minimum 90 days after whole blood donation, 14 days after platelet pheresis.
              </p>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 mt-4">
                <strong>Administrative Rule:</strong> Do not approve eligibility documents older than 12 months. Request re-upload when certificates are expired.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Document Modal */}
      {selectedDonorForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-rose-400">
                  {selectedDonorForReview.donorId}
                </span>
                <h3 className="text-lg font-bold">Medical Certificate Audit</h3>
              </div>
              <button
                onClick={() => setSelectedDonorForReview(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor Name:</span>
                  <span className="font-bold text-slate-900">{selectedDonorForReview.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {selectedDonorForReview.bloodGroup}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">File Name:</span>
                  <span className="font-mono text-slate-800">
                    {selectedDonorForReview.medicalCertificate.fileName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uploaded Date:</span>
                  <span className="text-slate-700">
                    {selectedDonorForReview.medicalCertificate.uploadDate}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medical Verifier Notes / Clinical Observations:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Hemoglobin 14.1 g/dL verified. All parameters fit for whole blood donation..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleVerify('Rejected')}
                  className="py-2.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Reject (Require Re-upload)
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify('Verified')}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Approve as Verified
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
