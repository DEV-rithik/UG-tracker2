import { useState, useEffect, useCallback } from 'react';
import type { WeekData, AppSettings, SemesterConfig } from '../types';
import { getSettings, saveSettings, getAllWeeks, saveWeeks, updateWeek } from '../db/database';
import { generateWeeks, generateDefaultSemesters, getCurrentWeekIndex } from '../utils/dateUtils';

export function useWeeks() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(-1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await getSettings();
      if (s) {
        setSettings(s);
        const w = await getAllWeeks();
        setWeeks(w);
        setCurrentWeekIndex(getCurrentWeekIndex(w));
      }
    } finally {
      setLoading(false);
    }
  };

  const setupCalendar = useCallback(async (startDate: string, semesterOverrides?: SemesterConfig[]) => {
    const semesters = semesterOverrides || generateDefaultSemesters(startDate);
    const generatedWeeks = generateWeeks(startDate, semesters);
    
    const newSettings: AppSettings = {
      collegeStartDate: startDate,
      semesters,
      setupComplete: true,
    };
    
    await saveSettings(newSettings);
    await saveWeeks(generatedWeeks);
    
    const savedSettings = await getSettings();
    const savedWeeks = await getAllWeeks();
    setSettings(savedSettings || null);
    setWeeks(savedWeeks);
    setCurrentWeekIndex(getCurrentWeekIndex(savedWeeks));
  }, []);

  const scoreWeek = useCallback(async (weekId: number, score: number | null, remarks: string, goal: string, photos?: string[]) => {
    await updateWeek(weekId, {
      score,
      remarks,
      goal,
      scoredAt: score !== null ? new Date().toISOString() : null,
      ...(photos !== undefined ? { photos } : {}),
    });
    
    const updatedWeeks = await getAllWeeks();
    setWeeks(updatedWeeks);
  }, []);

  const resetApp = useCallback(async () => {
    const { clearAll } = await import('../db/database');
    await clearAll();
    setSettings(null);
    setWeeks([]);
    setCurrentWeekIndex(-1);
  }, []);

  const stats = {
    weeksElapsed: currentWeekIndex >= 0 ? currentWeekIndex + 1 : 0,
    weeksScored: weeks.filter(w => w.score !== null).length,
    averageScore: (() => {
      const scored = weeks.filter(w => w.score !== null);
      if (scored.length === 0) return 0;
      return scored.reduce((sum, w) => sum + (w.score || 0), 0) / scored.length;
    })(),
    weeksRemaining: currentWeekIndex >= 0 ? weeks.length - currentWeekIndex - 1 : weeks.length,
  };

  return { settings, weeks, loading, currentWeekIndex, setupCalendar, scoreWeek, resetApp, stats, reloadData: loadData };
}
