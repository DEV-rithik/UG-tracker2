import React, { useState, useRef, useEffect } from 'react';
import type { WeekData } from '../types';
import { SCORE_COLORS, HOLIDAY_SCORE_COLORS } from '../utils/constants';

interface WeekCellProps {
  week: WeekData;
  isCurrent: boolean;
  isPast: boolean;
  onClick: () => void;
  semesterName: string;
}

function formatTooltipDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export const WeekCell: React.FC<WeekCellProps> = ({ week, isCurrent, isPast, onClick, semesterName }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const scoreKey = week.score ?? 0;
  const colors = week.isHoliday ? HOLIDAY_SCORE_COLORS : SCORE_COLORS;
  const bgColor = isCurrent ? '#1C1917' : colors[scoreKey];
  const isClickable = isCurrent || isPast;
  const hasPhotos = (week.photos?.length ?? 0) > 0;

  const tooltipText = `${semesterName} · Y${week.yearIndex + 1} Wk${week.weekNumber} · ${formatTooltipDate(week.startDate)}`;

  const handleMouseEnter = () => {
    if (window.matchMedia('(hover: none)').matches) return;
    timerRef.current = setTimeout(() => setTooltipVisible(true), 100);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTooltipVisible(false);
  };

  return (
    <div
      className={`w-7 h-7 rounded transition-transform relative ${isClickable ? 'cursor-pointer hover:scale-125 hover:z-10' : 'cursor-default opacity-50'} ${isCurrent ? 'ring-2 ring-stone-900 dark:ring-white ring-offset-1' : ''}`}
      style={{ backgroundColor: bgColor }}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasPhotos && (
        <span className="absolute -bottom-0.5 -right-0.5 text-[6px] leading-none select-none">📷</span>
      )}
      <div
        role="tooltip"
        aria-hidden={!tooltipVisible}
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none transition-opacity duration-150 ${tooltipVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="bg-stone-900 dark:bg-stone-700 text-stone-200 text-xs font-medium tracking-wider px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          {tooltipText}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-stone-900 dark:border-t-stone-700" />
      </div>
    </div>
  );
};
