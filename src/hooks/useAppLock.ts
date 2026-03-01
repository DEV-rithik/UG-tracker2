import { useState, useEffect } from 'react';

const PIN_KEY = 'ug-pin-hash';

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function useAppLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    const storedHash = localStorage.getItem(PIN_KEY);
    if (storedHash) {
      setHasPin(true);
      setIsLocked(true);
    }
  }, []);

  const setPin = async (pin: string): Promise<void> => {
    const hash = await hashPin(pin);
    localStorage.setItem(PIN_KEY, hash);
    setHasPin(true);
    setIsLocked(false);
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    const storedHash = localStorage.getItem(PIN_KEY);
    if (!storedHash) return true;
    const hash = await hashPin(pin);
    return hash === storedHash;
  };

  const removePin = () => {
    localStorage.removeItem(PIN_KEY);
    setHasPin(false);
    setIsLocked(false);
  };

  const lock = () => {
    if (hasPin) setIsLocked(true);
  };

  const unlock = () => setIsLocked(false);

  return { isLocked, hasPin, setPin, verifyPin, removePin, lock, unlock };
}
