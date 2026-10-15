import React, { useState } from 'react';
import { Donor } from '../types';

interface ContactDonorModalProps {
  donor: Donor;
  onClose: () => void;
}

export const ContactDonorModal: React.FC<ContactDonorModalProps> = ({ donor, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(donor.mobileNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-lg font-mono">
              {donor.bloodGroup}
            </div>
            <div>
              <h3 className="font-bold text-base">Direct Donor Contact</h3>
              <p className="text-xs text-slate-400">Recipient Coordination Channel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!agreed ? (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-950 text-xs leading-relaxed space-y-2">
                <p className="font-bold">Authorized Emergency Disclosure:</p>
                <p>
                  To protect voluntary donor privacy from spam or non-medical solicitations, please confirm this contact request is for a genuine patient requiring <strong>{donor.bloodGroup}</strong> blood units.
                </p>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I confirm this request is for legitimate medical necessity and I will conduct all blood collection at a licensed medical hospital or blood bank.
                </span>
              </label>

              <button
                type="button"
                disabled={!agreed}
                onClick={() => setAgreed(true)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  agreed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Reveal Authorized Contact
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Donor Name:</span>
                  <span className="font-bold text-slate-900">{donor.fullName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {donor.bloodGroup}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">
                    {donor.city} ({donor.distanceKm ? `${donor.distanceKm} km away` : 'Nearby'})
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-1">Direct Mobile Number:</span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-300">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {donor.mobileNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                {donor.email && (
                  <div className="text-xs text-slate-600">
                    <span className="text-slate-400">Email: </span>
                    <a href={`mailto:${donor.email}`} className="text-blue-600 hover:underline">
                      {donor.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${donor.mobileNumber.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>📞</span>
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${donor.mobileNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                    donor.fullName
                  )},%20I%20found%20your%20verified%20profile%20on%20Blood%20Donor%20Finder%20for%20an%20urgent%20${encodeURIComponent(
                    donor.bloodGroup
                  )}%20blood%20requirement.%20Could%20you%20please%20let%20me%20know%20if%20you%20are%20available?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-[11px] text-amber-900 leading-relaxed">
                <strong>Donor Protocol:</strong> Please be respectful of the donor's time and explain the hospital, patient name, and time frame clearly. Never offer or accept financial remuneration—voluntary blood donation is unpaid and humanitarian.
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
