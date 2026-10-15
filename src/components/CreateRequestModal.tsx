import React, { useState } from 'react';
import { BloodGroup, UrgencyLevel, BloodRequest } from '../types';
import { ALL_BLOOD_GROUPS } from '../utils/bloodCompatibility';
import { POPULAR_LOCATIONS } from '../utils/distance';
import { donorService } from '../services/donorService';

interface CreateRequestModalProps {
  onClose: () => void;
  onSuccess: (request: BloodRequest) => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O-' as BloodGroup,
    unitsNeeded: 2,
    hospitalName: '',
    city: 'Chennai',
    locationAddress: '',
    latitude: 13.0827,
    longitude: 80.2707,
    contactPerson: '',
    contactPhone: '',
    requiredDate: new Date().toISOString().split('T')[0],
    urgency: 'Critical (Immediate)' as UrgencyLevel,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchingCount, setMatchingCount] = useState<number | null>(null);

  const handleCitySelect = (cityName: string) => {
    const loc = POPULAR_LOCATIONS.find((l) => l.name === cityName);
    if (loc) {
      setFormData((prev) => ({
        ...prev,
        city: loc.name,
        latitude: loc.lat,
        longitude: loc.lng,
      }));
      // Check potential donors in radius
      const donors = donorService.searchDonors(
        {
          bloodGroup: formData.bloodGroup,
          includeCompatible: true,
          cityOrPin: '',
          maxDistanceKm: 25,
          minAge: 18,
          availabilityOnly: true,
          verifiedOnly: false,
        },
        { lat: loc.lat, lng: loc.lng }
      );
      setMatchingCount(donors.length);
    }
  };

  const handleBloodGroupChange = (bg: BloodGroup) => {
    setFormData((prev) => ({ ...prev, bloodGroup: bg }));
    const donors = donorService.searchDonors(
      {
        bloodGroup: bg,
        includeCompatible: true,
        cityOrPin: '',
        maxDistanceKm: 25,
        minAge: 18,
        availabilityOnly: true,
        verifiedOnly: false,
      },
      { lat: formData.latitude, lng: formData.longitude }
    );
    setMatchingCount(donors.length);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.patientName.trim()) errs.patientName = 'Patient or Case identifier is required.';
    if (!formData.hospitalName.trim()) errs.hospitalName = 'Hospital / Blood Bank facility name is required.';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact coordinator name is required.';
    if (!formData.contactPhone.trim() || formData.contactPhone.length < 8) {
      errs.contactPhone = 'Valid emergency contact phone is required.';
    }
    if (!formData.locationAddress.trim()) errs.locationAddress = 'Hospital address / ward is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newReq = donorService.createEmergencyRequest({
      patientName: formData.patientName.trim(),
      bloodGroup: formData.bloodGroup,
      unitsNeeded: Number(formData.unitsNeeded),
      hospitalName: formData.hospitalName.trim(),
      city: formData.city,
      locationAddress: formData.locationAddress.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      contactPerson: formData.contactPerson.trim(),
      contactPhone: formData.contactPhone.trim(),
      requiredDate: formData.requiredDate,
      urgency: formData.urgency,
      notes: formData.notes.trim(),
    });

    onSuccess(newReq);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-6 bg-rose-600 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200">
              Emergency Broadcast
            </span>
            <h3 className="text-xl font-bold tracking-tight">Post Emergency Blood Request</h3>
          </div>
          <button
            onClick={onClose}
            className="text-rose-100 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {matchingCount !== null && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span>
                ✨ <strong>{matchingCount} compatible voluntary donors</strong> detected within 25 km of {formData.city}!
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Name / Case ID <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Master Aarav Sharma (ICU Ward 3)"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
              {errors.patientName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.patientName}</p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Blood Group <span className="text-rose-600">*</span>
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleBloodGroupChange(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 font-mono"
              >
                {ALL_BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Units Needed */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Units Needed (Pints / Bags) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.unitsNeeded}
                onChange={(e) =>
                  setFormData({ ...formData, unitsNeeded: parseInt(e.target.value, 10) || 1 })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
              />
            </div>

            {/* Hospital Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital / Blood Bank Facility <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apollo Super Speciality Hospital, Greams Rd"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
              {errors.hospitalName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.hospitalName}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City <span className="text-rose-600">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Priority <span className="text-rose-600">*</span>
              </label>
              <select
                value={formData.urgency}
                onChange={(e) =>
                  setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })
                }
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-rose-700 bg-white"
              >
                <option value="Critical (Immediate)">🚨 Critical (Immediate Transfusion)</option>
                <option value="Urgent (Within 6 hrs)">⚠️ Urgent (Within 6 hrs)</option>
                <option value="High (Within 24 hrs)">🕒 High (Within 24 hrs)</option>
                <option value="Standard">Standard (Scheduled Surgery Standby)</option>
              </select>
            </div>

            {/* Hospital Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital Address / Ward / Room <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 21 Greams Lane, 3rd Floor Cardio ICU"
                value={formData.locationAddress}
                onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
              {errors.locationAddress && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.locationAddress}</p>
              )}
            </div>

            {/* Contact Coordinator */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Person Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar (Relative / Nurse)"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
              {errors.contactPerson && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.contactPerson}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Phone Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98402 11099"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
              />
              {errors.contactPhone && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.contactPhone}</p>
              )}
            </div>

            {/* Required Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date Needed By
              </label>
              <input
                type="date"
                value={formData.requiredDate}
                onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            {/* Additional Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clinical Details / Doctor's Note
              </label>
              <textarea
                rows={2}
                placeholder="Mention cross-matching details, donor weight requirements, or platelet replacement instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
            <strong>Safety Disclaimer:</strong> This portal connects community volunteers. We do not charge fees or guarantee donor arrival. Please also notify the nearest government blood bank immediately.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm shadow-rose-200 cursor-pointer"
            >
              Broadcast Emergency Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
