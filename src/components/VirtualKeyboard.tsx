import React from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  targetChar: string | null;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space'],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, targetChar }) => {
  const normalizedActive = activeKey?.toLowerCase() || '';
  const normalizedTarget = targetChar?.toLowerCase() || '';

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Backspace':
        return 'w-14 sm:w-16';
      case 'Tab':
        return 'w-12 sm:w-14';
      case 'Caps':
        return 'w-14 sm:w-16';
      case 'Enter':
        return 'w-16 sm:w-20';
      case 'Shift':
        return 'w-16 sm:w-20';
      case 'Space':
        return 'w-48 sm:w-64';
      default:
        return 'w-7 sm:w-9';
    }
  };

  const isKeyActive = (key: string) => {
    if (!activeKey) return false;
    if (key === 'Space' && activeKey === ' ') return true;
    return normalizedActive === key.toLowerCase();
  };

  const isKeyTarget = (key: string) => {
    if (!targetChar) return false;
    if (key === 'Space' && targetChar === ' ') return true;
    if (key === 'Enter' && targetChar === '\n') return true;
    return normalizedTarget === key.toLowerCase();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl mt-4 select-none">
      <div className="flex flex-col gap-1 items-center font-mono text-[11px] sm:text-xs">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 justify-center w-full">
            {row.map((key, kIdx) => {
              const active = isKeyActive(key);
              const target = isKeyTarget(key);
              const isHomeKey = key === 'f' || key === 'j';

              return (
                <div
                  key={`${rIdx}-${kIdx}`}
                  className={`h-7 sm:h-9 ${getKeyWidth(
                    key
                  )} flex items-center justify-center rounded border transition-all duration-75 relative ${
                    active
                      ? 'bg-[var(--accent)] text-slate-950 border-[var(--accent)] scale-95 shadow-sm'
                      : target
                      ? 'bg-[var(--accent-glow)] text-[var(--accent)] border-[var(--accent)] font-bold animate-pulse'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                  }`}
                >
                  <span>{key === 'Space' ? '␣' : key}</span>
                  {/* Visual bump for tactile F and J keys */}
                  {isHomeKey && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-[var(--text-dim)] rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
