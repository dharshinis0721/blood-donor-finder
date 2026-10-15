import React, { useState } from 'react';
import { BloodRequest, BloodGroup } from '../types';
import { donorService } from '../services/donorService';
import { CreateRequestModal } from './CreateRequestModal';

interface EmergencyRequestsPageProps {
  onFulfillMatch: (bloodGroup: BloodGroup, city: string) => void;
}

export const EmergencyRequestsPage: React.FC<EmergencyRequestsPageProps> = ({ onFulfillMatch }) => {
  const [requests, setRequests] = useState<BloodRequest[]>(() => donorService.getEmergencyRequests());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCity, setFilterCity] = useState('ALL');

  const handleRequestCreated = (newReq: BloodRequest) => {
    setRequests(donorService.getEmergencyRequests());
    setShowCreateModal(false);
  };

  const handleMarkFulfilled = (id: string) => {
    donorService.updateRequestStatus(id, 'Fulfilled');
    setRequests(donorService.getEmergencyRequests());
  };

  const filteredRequests = requests.filter((r) => {
    if (filterCity !== 'ALL' && r.city !== filterCity) return false;
    return true;
  });

  const cities = Array.from(new Set(requests.map((r) => r.city)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Live Urgent Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Emergency Blood Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Critical patient requirements broadcasted across intensive care units and hospitals. Contact the emergency coordinator directly to volunteer.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="self-start md:self-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-rose-200 flex items-center gap-2 cursor-pointer"
        >
          <span>🚨</span>
          <span>Post Emergency Request</span>
        </button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Filter by City:</span>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800"
          >
            <option value="ALL">All Cities ({requests.length})</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-500">
          Showing <strong className="text-slate-900">{filteredRequests.length}</strong> urgent requirements
        </div>
      </div>

      {/* Request Cards Feed */}
      <div className="space-y-4">
        {filteredRequests.map((req) => {
          const isFulfilled = req.status === 'Fulfilled';
          return (
            <div
              key={req.requestId}
              className={`bg-white rounded-2xl border transition-all p-6 ${
                req.urgency.includes('Critical')
                  ? 'border-rose-300 shadow-sm shadow-rose-100/50'
                  : 'border-slate-200 shadow-xs'
              } ${isFulfilled ? 'opacity-70 bg-slate-50' : ''}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Blood Group Badge and Patient Details */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-rose-600 text-white shrink-0 shadow-sm">
                    <span className="font-mono text-xl font-black">{req.bloodGroup}</span>
                    <span className="text-[10px] font-semibold text-rose-200 uppercase">
                      {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{req.patientName}</h3>
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {req.requestId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.urgency.includes('Critical')
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {req.urgency}
                      </span>
                      {isFulfilled && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          ✓ Fulfilled
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      🏥 <strong>{req.hospitalName}</strong> · {req.city}
                    </p>
                    <p className="text-xs text-slate-500">{req.locationAddress}</p>
                    {req.notes && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                        “{req.notes}”
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions and Contact details */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right text-xs">
                    <span className="text-slate-500 block">Contact Coordinator:</span>
                    <span className="font-bold text-slate-900">{req.contactPerson}</span>
                    <a
                      href={`tel:${req.contactPhone.replace(/\s+/g, '')}`}
                      className="font-mono font-bold text-rose-600 block mt-0.5 hover:underline"
                    >
                      {req.contactPhone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!isFulfilled && (
                      <button
                        onClick={() => onFulfillMatch(req.bloodGroup, req.city)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>🔍</span>
                        <span>Find Matching Donors</span>
                      </button>
                    )}
                    {!isFulfilled && (
                      <button
                        onClick={() => handleMarkFulfilled(req.requestId)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="Mark Request as Fulfilled"
                      >
                        Mark Fulfilled
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRequestCreated}
        />
      )}
    </div>
  );
};
