import React, { useState, useEffect } from 'react';
import type { WeekData } from '../types';
import { SCORE_COLORS, HOLIDAY_SCORE_COLORS, SCORE_LABELS } from '../utils/constants';
import { formatDateDisplay } from '../utils/dateUtils';

interface WeekModalProps {
  week: WeekData | null;
  onClose: () => void;
  onSave: (weekId: number, score: number | null, remarks: string, goal: string) => void;
}

export const WeekModal: React.FC<WeekModalProps> = ({ week, onClose, onSave }) => {
  const [score, setScore] = useState<number | null>(null);
  const [remarks, setRemarks] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    if (week) {
      setScore(week.score);
      setRemarks(week.remarks);
      setGoal(week.goal);
    }
  }, [week]);

  if (!week) return null;

  const colors = week.isHoliday ? HOLIDAY_SCORE_COLORS : SCORE_COLORS;

  const handleSave = () => {
    if (week.id !== undefined) {
      onSave(week.id, score, remarks, goal);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-semibold text-stone-800">
              Week {week.overallWeekNumber}
              {week.isHoliday && <span className="ml-2 text-xs text-blue-500 font-normal uppercase tracking-wider">Holiday</span>}
            </h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
          </div>
          <p className="text-xs text-stone-400 uppercase tracking-wider">
            {formatDateDisplay(week.startDate)} – {formatDateDisplay(week.endDate)}
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-xs tracking-widest uppercase text-stone-500 font-medium mb-3">Score This Week</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setScore(score === s ? null : s)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${score === s ? 'ring-2 ring-offset-2 ring-stone-700 scale-105' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: colors[s], color: s >= 4 ? 'white' : '#3D3429' }}
                title={SCORE_LABELS[s]}
              >
                {s}
              </button>
            ))}
          </div>
          {score && <p className="text-xs text-stone-400 mt-1.5 text-center">{SCORE_LABELS[score]}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-xs tracking-widest uppercase text-stone-500 font-medium mb-2">Remarks / Reflection</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="How did this week go? What happened? How did you feel?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none placeholder-stone-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs tracking-widest uppercase text-stone-500 font-medium mb-2">Goal for Next Week</label>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What do you want to achieve next week?"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 placeholder-stone-300"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-medium text-sm hover:bg-stone-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-stone-100 text-stone-600 rounded-xl font-medium text-sm hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
