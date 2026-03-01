import React from 'react';
import type { WeekData } from '../types';
import { SCORE_COLORS, HOLIDAY_SCORE_COLORS } from '../utils/constants';
import { formatDateShort } from '../utils/dateUtils';

interface WeekCellProps {
  week: WeekData;
  isCurrent: boolean;
  isPast: boolean;
  onClick: () => void;
}

export const WeekCell: React.FC<WeekCellProps> = ({ week, isCurrent, isPast, onClick }) => {
  const scoreKey = week.score ?? 0;
  const colors = week.isHoliday ? HOLIDAY_SCORE_COLORS : SCORE_COLORS;
  const bgColor = isCurrent ? '#1C1917' : colors[scoreKey];
  const isClickable = isCurrent || isPast;

  const tooltipText = `Week ${week.overallWeekNumber}: ${formatDateShort(week.startDate)} – ${formatDateShort(week.endDate)}${week.score ? ` | Score: ${week.score}` : ''}${week.remarks ? `\n${week.remarks.split('\n')[0].substring(0, 50)}` : ''}`;

  return (
    <div
      className={`w-4 h-4 rounded-sm transition-transform ${isClickable ? 'cursor-pointer hover:scale-125 hover:z-10 relative' : 'cursor-default opacity-50'} ${isCurrent ? 'ring-2 ring-stone-900 ring-offset-1' : ''}`}
      style={{ backgroundColor: bgColor }}
      onClick={isClickable ? onClick : undefined}
      title={tooltipText}
    />
  );
};
