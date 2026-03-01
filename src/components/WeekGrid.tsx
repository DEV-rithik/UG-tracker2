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
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-xs tracking-widest uppercase text-stone-400 font-medium">
              {getYearLabel(yearGroup.yearIndex, settings.collegeStartDate)}
            </span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>
          
          <div className="space-y-3">
            {yearGroup.semesterGroups.map((semGroup, si) => (
              <div key={si} className="flex items-center gap-3">
                <div className="w-20 text-right">
                  <span className={`text-xs font-medium ${semGroup.isHoliday ? 'text-blue-400' : 'text-stone-500'}`}>
                    {semGroup.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {semGroup.weeks.map((week) => {
                    const weekIdx = weeks.indexOf(week);
                    return (
                      <WeekCell
                        key={week.overallWeekNumber}
                        week={week}
                        isCurrent={weekIdx === currentWeekIndex}
                        isPast={weekIdx < currentWeekIndex}
                        onClick={() => onWeekClick(week)}
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
