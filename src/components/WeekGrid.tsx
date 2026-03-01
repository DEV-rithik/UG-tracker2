import React, { useMemo } from 'react';
import type { WeekData, AppSettings } from '../types';
import { WeekCell } from './WeekCell';
import { getYearLabel } from '../utils/dateUtils';

interface WeekGridProps {
  weeks: WeekData[];
  settings: AppSettings;
  currentWeekIndex: number;
  onWeekClick: (week: WeekData) => void;
}

function getMonthRange(weeks: WeekData[]): string {
  if (weeks.length === 0) return '';
  const start = new Date(weeks[0].startDate + 'T00:00:00');
  const end = new Date(weeks[weeks.length - 1].endDate + 'T00:00:00');
  const startMon = start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const endMon = end.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  return startMon === endMon ? startMon : `${startMon}-${endMon}`;
}

export const WeekGrid: React.FC<WeekGridProps> = ({ weeks, settings, currentWeekIndex, onWeekClick }) => {
  // Group weeks by year
  const yearGroups = useMemo(() => {
    const groups: { yearIndex: number; semesterGroups: { semesterIndex: number; name: string; isHoliday: boolean; weeks: WeekData[] }[] }[] = [];
    
    let currentYear = -1;
    let currentSem = -2;
    let currentIsHoliday = false;
    
    for (const week of weeks) {
      if (week.yearIndex !== currentYear) {
        currentYear = week.yearIndex;
        groups.push({ yearIndex: currentYear, semesterGroups: [] });
        currentSem = -2;
      }
      
      const yearGroup = groups[groups.length - 1];
      const key = week.isHoliday ? -(week.yearIndex + 100) : week.semesterIndex;
      
      if (key !== currentSem || week.isHoliday !== currentIsHoliday) {
        currentSem = key;
        currentIsHoliday = week.isHoliday;
        const semName = week.isHoliday 
          ? 'Holiday Break'
          : settings.semesters[week.semesterIndex]?.name || `Sem ${week.semesterIndex + 1}`;
        yearGroup.semesterGroups.push({
          semesterIndex: week.semesterIndex,
          name: semName,
          isHoliday: week.isHoliday,
          weeks: [],
        });
      }
      
      yearGroup.semesterGroups[yearGroup.semesterGroups.length - 1].weeks.push(week);
    }
    
    return groups;
  }, [weeks, settings]);

  return (
    <div className="space-y-8">
      {yearGroups.map((yearGroup) => (
        <div key={yearGroup.yearIndex}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-stone-200 dark:bg-stone-700 flex-1" />
            <span className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-medium">
              {getYearLabel(yearGroup.yearIndex, settings.collegeStartDate)}
            </span>
            <div className="h-px bg-stone-200 dark:bg-stone-700 flex-1" />
          </div>
          
          <div className="space-y-3">
            {yearGroup.semesterGroups.map((semGroup, si) => (
              <div key={si} className="flex items-center gap-3">
                <div className="w-28 text-right shrink-0">
                  <div className={`text-xs font-bold tracking-widest uppercase ${semGroup.isHoliday ? 'text-blue-400 dark:text-blue-500' : 'text-stone-500 dark:text-stone-400'}`}>
                    {semGroup.name}
                  </div>
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                    {getMonthRange(semGroup.weeks)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {semGroup.weeks.map((week) => {
                    const weekIdx = weeks.indexOf(week);
                    return (
                      <WeekCell
                        key={week.overallWeekNumber}
                        week={week}
                        isCurrent={weekIdx === currentWeekIndex}
                        isPast={weekIdx < currentWeekIndex}
                        onClick={() => onWeekClick(week)}
                        semesterName={semGroup.name}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
