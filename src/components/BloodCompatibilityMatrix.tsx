import React, { useState } from 'react';
import { BloodGroup } from '../types';
import { ALL_BLOOD_GROUPS, BLOOD_GROUP_INFO, CAN_DONATE_TO, COMPATIBLE_DONORS_FOR_RECIPIENT } from '../utils/bloodCompatibility';

interface BloodCompatibilityMatrixProps {
  onSearchGroup?: (group: BloodGroup) => void;
}

export const BloodCompatibilityMatrix: React.FC<BloodCompatibilityMatrixProps> = ({ onSearchGroup }) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');

  const info = BLOOD_GROUP_INFO[selectedGroup];
  const canGiveTo = CAN_DONATE_TO[selectedGroup];
  const canReceiveFrom = COMPATIBLE_DONORS_FOR_RECIPIENT[selectedGroup];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Transfusion Compatibility Matrix
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Understand Red Cell & Plasma Matches
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Click any blood type below to view clinical compatibility, recipient safety, and prevalence.
          </p>
        </div>

        {onSearchGroup && (
          <button
            onClick={() => onSearchGroup(selectedGroup)}
            className="self-start md:self-auto px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>🔍</span>
            <span>Search {selectedGroup} Donors Nearby</span>
          </button>
        )}
      </div>

      {/* Blood Group Selectors */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-8">
        {ALL_BLOOD_GROUPS.map((bg) => {
          const isSelected = selectedGroup === bg;
          return (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-200 scale-105'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-rose-50/50 hover:border-rose-200'
              }`}
            >
              <span className="font-mono text-base font-extrabold tracking-tight">{bg}</span>
              <span
                className={`text-[10px] mt-0.5 ${
                  isSelected ? 'text-rose-100 font-medium' : 'text-slate-500'
                }`}
              >
                {bg === 'O-' ? 'Universal' : bg === 'AB+' ? 'Recipient' : 'Type'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Blood Type Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-3xl font-black text-rose-600">{selectedGroup}</span>
              <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                {info.rarity}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-2">{info.title}</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{info.note}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            *Red cell compatibility requires cross-matching verification at the hospital laboratory.
          </div>
        </div>

        {/* Can Donate To */}
        <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              ↑
            </span>
            <h4 className="text-sm font-bold text-emerald-950">
              Can Give Red Blood Cells To:
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {canGiveTo.map((target) => (
              <span
                key={target}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs shadow-xs"
              >
                {target}
              </span>
            ))}
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {selectedGroup === 'O-'
              ? 'Universal red cell compatibility! Every patient in trauma care can receive O-.'
              : `Patients with blood group ${canGiveTo.join(', ')} can safely receive this blood.`}
          </p>
        </div>

        {/* Can Receive From */}
        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              ↓
            </span>
            <h4 className="text-sm font-bold text-blue-950">
              Can Receive Red Blood Cells From:
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {canReceiveFrom.map((source) => (
              <span
                key={source}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs shadow-xs"
              >
                {source}
              </span>
            ))}
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            {selectedGroup === 'AB+'
              ? 'Universal recipient! When you need blood, you can receive red blood cells from any blood type.'
              : `A patient with ${selectedGroup} can safely accept transfusions from: ${canReceiveFrom.join(', ')}.`}
          </p>
        </div>
      </div>
    </div>
  );
};
