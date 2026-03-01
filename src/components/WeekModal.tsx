import React, { useState, useRef } from 'react';
import type { WeekData } from '../types';
import { SCORE_COLORS, HOLIDAY_SCORE_COLORS, SCORE_LABELS } from '../utils/constants';
import { formatDateDisplay } from '../utils/dateUtils';

interface WeekModalProps {
  week: WeekData | null;
  onClose: () => void;
  onSave: (weekId: number, score: number | null, remarks: string, goal: string, photos?: string[]) => void;
}

const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE = 500 * 1024; // 500KB

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      // Scale down if too large
      const MAX_DIM = 800;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      // Try quality 0.7 first, reduce if still too large
      let quality = 0.7;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      while (dataUrl.length * 0.75 > MAX_PHOTO_SIZE && quality > 0.2) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = url;
  });
}

const WeekModalInner: React.FC<{ week: WeekData; onClose: () => void; onSave: WeekModalProps['onSave'] }> = ({ week, onClose, onSave }) => {
  const [score, setScore] = useState<number | null>(week.score);
  const [remarks, setRemarks] = useState(week.remarks);
  const [goal, setGoal] = useState(week.goal);
  const [photos, setPhotos] = useState<string[]>(week.photos ?? []);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const colors = week.isHoliday ? HOLIDAY_SCORE_COLORS : SCORE_COLORS;

  const handleSave = () => {
    if (week.id !== undefined) {
      onSave(week.id, score, remarks, goal, photos);
      onClose();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = MAX_PHOTOS - photos.length;
    const toProcess = files.slice(0, remaining);
    const compressed = await Promise.all(toProcess.map(compressImage));
    setPhotos((prev) => [...prev, ...compressed].slice(0, MAX_PHOTOS));
    e.target.value = '';
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
              Week {week.overallWeekNumber}
              {week.isHoliday && <span className="ml-2 text-xs text-blue-500 font-normal uppercase tracking-wider">Holiday</span>}
            </h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 text-xl leading-none">×</button>
          </div>
          <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            {formatDateDisplay(week.startDate)} – {formatDateDisplay(week.endDate)}
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-medium mb-3">Score This Week</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setScore(score === s ? null : s)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${score === s ? 'ring-2 ring-offset-2 ring-stone-700 dark:ring-stone-300 scale-105' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: colors[s], color: s >= 4 ? 'white' : '#3D3429' }}
                title={SCORE_LABELS[s]}
              >
                {s}
              </button>
            ))}
          </div>
          {score && <p className="text-xs text-stone-400 dark:text-stone-500 mt-1.5 text-center">{SCORE_LABELS[score]}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-medium mb-2">Remarks / Reflection</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="How did this week go? What happened? How did you feel?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none placeholder-stone-300 dark:placeholder-stone-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-medium mb-2">Goal for Next Week</label>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What do you want to achieve next week?"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 placeholder-stone-300 dark:placeholder-stone-500"
          />
        </div>

        {/* Photos section */}
        <div className="mb-6">
          <label className="block text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-medium mb-2">Memories</label>
          {photos.length > 0 && (
            <div className="flex gap-2 mb-2">
              {photos.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={src}
                    alt={`Memory ${idx + 1}`}
                    onClick={() => setLightboxPhoto(src)}
                    className="w-16 h-16 object-cover rounded-lg border border-stone-200 dark:border-stone-600 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-stone-600 dark:bg-stone-400 text-white dark:text-stone-900 rounded-full text-xs flex items-center justify-center leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {photos.length < MAX_PHOTOS && (
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-1.5 transition-colors"
            >
              📷 Add Photos ({photos.length}/{MAX_PHOTOS})
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-xl font-medium text-sm hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl font-medium text-sm hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <img
            src={lightboxPhoto}
            alt="Memory"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 text-white text-2xl leading-none hover:text-stone-300 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export const WeekModal: React.FC<WeekModalProps> = ({ week, onClose, onSave }) => {
  if (!week) return null;
  return <WeekModalInner key={week.id} week={week} onClose={onClose} onSave={onSave} />;
};
