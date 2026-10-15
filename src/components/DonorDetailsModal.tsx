import React, { useState } from 'react';
import { Donor } from '../types';

interface DonorDetailsModalProps {
  donor: Donor;
  onClose: () => void;
  onInitiateContact: (donor: Donor) => void;
}

export const DonorDetailsModal: React.FC<DonorDetailsModalProps> = ({
  donor,
  onClose,
  onInitiateContact,
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  const certStatus = donor.medicalCertificate?.verificationStatus || 'Pending Review';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-mono font-black text-xl shadow-sm">
              {donor.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{donor.fullName}</h3>
                <span className="font-mono text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                  {donor.donorId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {donor.city}, {donor.state}
                {donor.distanceKm !== undefined && (
                  <span className="text-rose-600 font-semibold ml-1.5">
                    · {donor.distanceKm} km away
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Availability</span>
              <span
                className={`text-xs font-bold mt-1 inline-block ${
                  donor.availabilityStatus === 'Available'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                ● {donor.availabilityStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Medical Clearance</span>
              <span
                className={`text-xs font-bold mt-1 inline-block ${
                  certStatus === 'Verified'
                    ? 'text-emerald-700'
                    : certStatus === 'Pending Review'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {certStatus === 'Verified' ? '✓' : '⏳'} {certStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Age</span>
              <span className="text-xs font-bold text-slate-900 mt-1 block">
                {donor.consent.shareAge ? `${donor.age} years` : 'Undisclosed'}
              </span>
            </div>
          </div>

          {/* Clinical & Donation History */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Donation Profile
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Last Donation Date:</span>
                <span className="font-medium text-slate-900">
                  {donor.lastDonationDate || 'First-time voluntary donor'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Total Recorded Donations:</span>
                <span className="font-medium text-slate-900">{donor.donationCount} donations</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Estimated Distance:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {donor.distanceKm !== undefined ? `${donor.distanceKm} km (estimated road)` : 'Exact origin needed'}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Certificate Review Statement */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Authorized Verification Record
            </h4>
            <div className="bg-rose-50/40 rounded-xl p-4 border border-rose-100 text-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-950">
                  File: {donor.medicalCertificate.fileName}
                </span>
                <span className="text-[11px] text-slate-500">
                  Uploaded {donor.medicalCertificate.uploadDate}
                </span>
              </div>
              {donor.medicalCertificate.reviewNotes && (
                <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-rose-100/70 mt-1">
                  “{donor.medicalCertificate.reviewNotes}”
                </p>
              )}
              {donor.medicalCertificate.reviewedBy && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Verified by: <strong className="text-slate-700">{donor.medicalCertificate.reviewedBy}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Location & Privacy Notice */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Location & Contact Access
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
              <p className="text-slate-600">
                General Area: <strong>{donor.city}, {donor.state} (PIN {donor.pinCode})</strong>
              </p>
              {!showFullAddress ? (
                <button
                  type="button"
                  onClick={() => setShowFullAddress(true)}
                  className="mt-2 text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                >
                  Show Street Details (Recipient Emergency Intent)
                </button>
              ) : (
                <p className="mt-2 text-slate-800 font-medium bg-white p-2 rounded border border-slate-200">
                  {donor.address}
                </p>
              )}
            </div>
          </div>

          {/* Mandatory Medical Safety Disclaimer */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <strong>Mandatory Health Notice:</strong> This platform verifies document submissions for community reference. Final donation eligibility (hemoglobin, recent travel, vitals, infectious disease testing) must always be screened and approved directly by licensed blood-bank personnel at the donation facility.
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => onInitiateContact(donor)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm shadow-rose-200 flex items-center gap-2 cursor-pointer"
          >
            <span>📞</span>
            <span>Contact Donor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
