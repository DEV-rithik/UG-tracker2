import React, { useState } from 'react';
import type { SemesterConfig } from '../types';
import { generateDefaultSemesters } from '../utils/dateUtils';
import { SemesterAdjust } from './SemesterAdjust';

interface SetupFormProps {
  onSetup: (startDate: string, semesters?: SemesterConfig[]) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onSetup }) => {
  const [startDate, setStartDate] = useState('');
  const [showAdjust, setShowAdjust] = useState(false);
  const [semesters, setSemesters] = useState<SemesterConfig[]>([]);

  const handleDateChange = (date: string) => {
    setStartDate(date);
    if (date) {
      setSemesters(generateDefaultSemesters(date));
    }
  };

  const handleSubmit = () => {
    if (!startDate) return;
    onSetup(startDate, showAdjust ? semesters : undefined);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
        <div className="mb-6">
          <label className="block text-xs tracking-widest uppercase text-stone-500 font-medium mb-3">
            First Day of Your UG
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
          />
        </div>

        <button
          onClick={() => setShowAdjust(!showAdjust)}
          className="mb-6 text-xs tracking-widest uppercase text-stone-500 hover:text-stone-700 flex items-center gap-2 transition-colors"
        >
          <span className="text-lg">{showAdjust ? '⊖' : '⊕'}</span>
          Adjust Individual Semester Dates
        </button>

        {showAdjust && startDate && (
          <SemesterAdjust semesters={semesters} onChange={setSemesters} />
        )}

        <button
          onClick={handleSubmit}
          disabled={!startDate}
          className="w-full py-3 px-6 bg-stone-800 text-stone-50 rounded-xl font-medium text-sm tracking-widest uppercase hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Build My Calendar →
        </button>
      </div>
    </div>
  );
};
