import { useCallback } from 'react';

export function useNotifications() {
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  const scheduleWeekEndReminder = useCallback(async (weekEndDate: string, goal: string) => {
    const granted = await requestPermission();
    if (!granted) return;

    // Calculate Sunday evening (end of week)
    const endDate = new Date(weekEndDate + 'T20:00:00');
    const now = new Date();
    const delay = endDate.getTime() - now.getTime();
    
    if (delay > 0 && 'serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      // Store reminder in service worker via postMessage
      reg.active?.postMessage({
        type: 'SCHEDULE_REMINDER',
        delay,
        goal,
        weekEndDate,
      });
    }
  }, [requestPermission]);

  return { requestPermission, scheduleWeekEndReminder };
}
