import React, { useState } from 'react';
import { Donor, AvailabilityStatus } from '../types';
import { donorService } from '../services/donorService';

interface DonorPortalProps {
  donor: Donor;
  onUpdateDonor: (updated: Donor) => void;
  onLogout: () => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  donor: initialDonor,
  onUpdateDonor,
  onLogout,
}) => {
  const [donor, setDonor] = useState<Donor>(initialDonor);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mobileNumber: donor.mobileNumber,
    address: donor.address,
    city: donor.city,
    state: donor.state,
    pinCode: donor.pinCode,
    lastDonationDate: donor.lastDonationDate || '',
  });

  const handleToggleAvailability = (status: AvailabilityStatus) => {
    donorService.updateAvailability(donor.donorId, status);
    const updated = { ...donor, availabilityStatus: status };
    setDonor(updated);
    onUpdateDonor(updated);
    setFeedbackMsg(`Availability status updated to ${status}`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = donorService.updateDonor(donor.donorId, {
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      lastDonationDate: formData.lastDonationDate || undefined,
    });
    if (updated) {
      setDonor(updated);
      onUpdateDonor(updated);
      setIsEditing(false);
      setFeedbackMsg('Profile updated successfully!');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      donorService.updateMedicalDocument(donor.donorId, {
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result as string,
      });
      const refreshed = donorService.getDonorById(donor.donorId);
      if (refreshed) {
        setDonor(refreshed);
        onUpdateDonor(refreshed);
        setFeedbackMsg('New medical document submitted for clinical review!');
        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Next eligible donation calculation
  const getNextEligibleDate = () => {
    if (!donor.lastDonationDate) return 'Eligible to donate today';
    const lastDate = new Date(donor.lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 90);
    const today = new Date();

    if (today >= nextDate) {
      return 'Eligible to donate today (90-day recovery completed)';
    } else {
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Eligible in ${diffDays} days (${nextDate.toISOString().split('T')[0]})`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center font-mono font-black text-2xl shadow-sm text-white shrink-0">
            {donor.bloodGroup}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {donor.fullName}
              </h1>
              <span className="font-mono text-xs bg-slate-800 text-rose-300 px-2.5 py-0.5 rounded border border-slate-700">
                {donor.donorId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Registered Voluntary Donor · {donor.city}, {donor.state}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Availability Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Current Readiness Status</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn off during travel, recovery, illness, or after recent donation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleAvailability('Available')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              donor.availabilityStatus === 'Available'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ● Ready & Available
          </button>
          <button
            type="button"
            onClick={() => handleToggleAvailability('Temporarily Unavailable')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              donor.availabilityStatus === 'Temporarily Unavailable'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⏸ Temporarily Resting
          </button>
        </div>
      </div>

      {/* Grid: Profile Details + Medical Certificate Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Contact & Address Details</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Details'}
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mobile Phone:</span>
                <span className="font-mono font-bold text-slate-900">{donor.mobileNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email Address:</span>
                <span className="text-slate-900">{donor.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Age:</span>
                <span className="text-slate-900">{donor.age} years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-900">
                  {donor.city}, {donor.state} ({donor.pinCode})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Street Address:</span>
                <span className="text-slate-900">{donor.address}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Next Eligible Donation:</span>
                <span className="font-semibold text-emerald-700">{getNextEligibleDate()}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number:
                </label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address:
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City:</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIN:</label>
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Blood Donation Date:
                </label>
                <input
                  type="date"
                  value={formData.lastDonationDate}
                  onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* Medical Document & Verification Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Medical Certificate Status</h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                  donor.medicalCertificate?.verificationStatus === 'Verified'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {donor.medicalCertificate?.verificationStatus || 'Pending'}
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs text-slate-600">
              <p>
                Document: <strong className="text-slate-800">{donor.medicalCertificate.fileName}</strong>
              </p>
              <p>Uploaded: {donor.medicalCertificate.uploadDate}</p>
              {donor.medicalCertificate.reviewNotes && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 mt-2">
                  <span className="font-bold text-[11px] text-slate-500 block mb-0.5">
                    Medical Verifier Comments:
                  </span>
                  “{donor.medicalCertificate.reviewNotes}”
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Upload New / Replacement Medical Clearance Document:
            </label>
            <input
              type="file"
              id="donorCertUpload"
              accept=".pdf,image/png,image/jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="donorCertUpload"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-300"
            >
              <span>📄</span>
              <span>Upload Fresh Medical Clearance</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
