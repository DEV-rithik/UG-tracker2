import React, { useMemo } from 'react';
import type { WeekData, AppSettings } from '../types';
import { SCORE_COLORS } from '../utils/constants';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatDateShort } from '../utils/dateUtils';

interface StatsDashboardProps {
  weeks: WeekData[];
  settings: AppSettings;
}

const renderPieLabel = ({ name, percent }: { name?: string; percent?: number }) =>
  `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`;

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ weeks, settings }) => {
  const scoredWeeks = useMemo(() => weeks.filter(w => w.score !== null), [weeks]);

  const trendData = useMemo(() => 
    scoredWeeks.map(w => ({
      week: `W${w.overallWeekNumber}`,
      score: w.score,
      date: formatDateShort(w.startDate),
    })), [scoredWeeks]);

  const semesterData = useMemo(() => {
    const semMap: Record<number, { total: number; count: number; name: string }> = {};
    for (const w of scoredWeeks) {
      if (!w.isHoliday) {
        const idx = w.semesterIndex;
        if (!semMap[idx]) semMap[idx] = { total: 0, count: 0, name: settings.semesters[idx]?.name || `Sem ${idx + 1}` };
        semMap[idx].total += w.score || 0;
        semMap[idx].count++;
      }
    }
    return Object.entries(semMap).map(([, v]) => ({
      name: v.name,
      avg: parseFloat((v.total / v.count).toFixed(2)),
    }));
  }, [scoredWeeks, settings]);

  const distributionData = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const w of scoredWeeks) {
      if (w.score) dist[w.score]++;
    }
    return Object.entries(dist).map(([score, count]) => ({ name: `Score ${score}`, value: count, score: parseInt(score) }));
  }, [scoredWeeks]);

  // Current streak
  const streak = useMemo(() => {
    let s = 0;
    for (let i = scoredWeeks.length - 1; i >= 0; i--) {
      if (scoredWeeks[i].score !== null) s++;
      else break;
    }
    return s;
  }, [scoredWeeks]);

  const bestWeek = useMemo(() => scoredWeeks.reduce((best, w) => (!best || (w.score || 0) > (best.score || 0)) ? w : best, null as WeekData | null), [scoredWeeks]);
  const worstWeek = useMemo(() => scoredWeeks.reduce((worst, w) => (!worst || (w.score || 0) < (worst.score || 0)) ? w : worst, null as WeekData | null), [scoredWeeks]);

  if (scoredWeeks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-400 text-sm uppercase tracking-widest">No scored weeks yet.</p>
        <p className="text-stone-300 text-xs mt-2">Start scoring your weeks to see statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-stone-800">{streak}</div>
          <div className="text-xs tracking-widest uppercase text-stone-400 mt-1">Current Streak</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-stone-800">{scoredWeeks.length}</div>
          <div className="text-xs tracking-widest uppercase text-stone-400 mt-1">Total Scored</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-stone-800">{weeks.filter(w => w.remarks).length}</div>
          <div className="text-xs tracking-widest uppercase text-stone-400 mt-1">Remarks Written</div>
        </div>
      </div>

      {bestWeek && worstWeek && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <div className="text-xs tracking-widest uppercase text-stone-400 mb-2">Best Week</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: SCORE_COLORS[bestWeek.score || 0] }}>
                {bestWeek.score}
              </div>
              <div>
                <div className="text-sm font-medium text-stone-700">Week {bestWeek.overallWeekNumber}</div>
                <div className="text-xs text-stone-400">{formatDateShort(bestWeek.startDate)}</div>
              </div>
            </div>
            {bestWeek.remarks && <p className="text-xs text-stone-500 mt-2 line-clamp-2">{bestWeek.remarks}</p>}
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <div className="text-xs tracking-widest uppercase text-stone-400 mb-2">Worst Week</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: SCORE_COLORS[worstWeek.score || 0], color: '#3D3429' }}>
                {worstWeek.score}
              </div>
              <div>
                <div className="text-sm font-medium text-stone-700">Week {worstWeek.overallWeekNumber}</div>
                <div className="text-xs text-stone-400">{formatDateShort(worstWeek.startDate)}</div>
              </div>
            </div>
            {worstWeek.remarks && <p className="text-xs text-stone-500 mt-2 line-clamp-2">{worstWeek.remarks}</p>}
          </div>
        </div>
      )}

      {/* Score Trend Chart */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
        <h3 className="text-xs tracking-widest uppercase text-stone-500 font-medium mb-4">Score Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#449D44" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Semester Comparison */}
      {semesterData.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
          <h3 className="text-xs tracking-widest uppercase text-stone-500 font-medium mb-4">Semester Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={semesterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="#449D44" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Score Distribution */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
        <h3 className="text-xs tracking-widest uppercase text-stone-500 font-medium mb-4">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={renderPieLabel}>
              {distributionData.map((entry, index) => (
                <Cell key={index} fill={SCORE_COLORS[entry.score]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
