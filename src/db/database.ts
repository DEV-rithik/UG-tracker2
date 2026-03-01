import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { WeekData, AppSettings } from '../types';

export class UGTrackerDB extends Dexie {
  weeks!: Table<WeekData>;
  settings!: Table<AppSettings>;

  constructor() {
    super('UGTrackerDB');
    this.version(1).stores({
      weeks: '++id, weekNumber, overallWeekNumber, startDate, semesterIndex, yearIndex',
      settings: '++id',
    });
    // Version 2: adds photos[] field to WeekData (no new indexes needed, Dexie handles object properties)
    this.version(2).stores({
      weeks: '++id, weekNumber, overallWeekNumber, startDate, semesterIndex, yearIndex',
      settings: '++id',
    });
  }
}

export const db = new UGTrackerDB();

export async function getSettings(): Promise<AppSettings | undefined> {
  return db.settings.orderBy('id').last();
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const existing = await getSettings();
  if (existing?.id) {
    await db.settings.update(existing.id, settings);
  } else {
    await db.settings.add(settings as AppSettings);
  }
}

export async function getAllWeeks(): Promise<WeekData[]> {
  return db.weeks.orderBy('overallWeekNumber').toArray();
}

export async function saveWeeks(weeks: WeekData[]): Promise<void> {
  await db.weeks.clear();
  await db.weeks.bulkAdd(weeks);
}

export async function updateWeek(id: number, data: Partial<WeekData>): Promise<void> {
  await db.weeks.update(id, data);
}

export async function clearAll(): Promise<void> {
  await db.weeks.clear();
  await db.settings.clear();
}
