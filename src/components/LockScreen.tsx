import React, { useState } from 'react';

interface LockScreenProps {
  onUnlock: (pin: string) => Promise<boolean>;
  onForgotPin: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, onForgotPin }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleDigit = async (digit: string) => {
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      const ok = await onUnlock(newPin);
      if (!ok) {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin('');
        }, 600);
      }
    }
  };

  const handleBackspace = () => {
    setPin((p) => p.slice(0, -1));
  };

  const handleForgot = () => {
    if (confirm('This will reset your PIN but NOT your data. You\'ll need to set a new PIN after unlocking. Continue?')) {
      onForgotPin();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900">
      <div className="w-full max-w-xs px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100 tracking-tight mb-1">
            UG Life <em className="font-serif not-italic italic font-normal" style={{ fontFamily: "'DM Serif Display', serif" }}>Tracker</em>
          </h1>
          <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 mt-2">Enter your PIN</p>
        </div>

        {/* PIN dots */}
        <div
          className="flex justify-center gap-4 mb-10"
          style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                i < pin.length
                  ? 'bg-stone-800 dark:bg-stone-200 border-stone-800 dark:border-stone-200'
                  : 'border-stone-300 dark:border-stone-600'
              }`}
            />
          ))}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1','2','3','4','5','6','7','8','9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              disabled={pin.length >= 4}
              className="aspect-square flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 text-lg font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors disabled:opacity-40"
            >
              {d}
            </button>
          ))}
          {/* Bottom row: empty, 0, backspace */}
          <div />
          <button
            onClick={() => handleDigit('0')}
            disabled={pin.length >= 4}
            className="aspect-square flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 text-lg font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors disabled:opacity-40"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            disabled={pin.length === 0}
            className="aspect-square flex items-center justify-center rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors disabled:opacity-30"
          >
            ⌫
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowForgot(true)}
            className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            Forgot PIN?
          </button>
        </div>

        {showForgot && (
          <div className="mt-4 p-4 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-500 dark:text-stone-400 text-center">
            <p className="mb-3">This will reset your PIN but <strong>NOT</strong> your data. You'll need to set a new PIN.</p>
            <div className="flex gap-2">
              <button
                onClick={handleForgot}
                className="flex-1 py-2 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-lg font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
              >
                Reset PIN
              </button>
              <button
                onClick={() => setShowForgot(false)}
                className="flex-1 py-2 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg font-medium hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};
