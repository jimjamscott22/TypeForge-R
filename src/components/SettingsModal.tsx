import React from 'react';
import { AppTheme, CaretStyle, SwitchSoundType, UserPreferences } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { X, Volume2, Moon, Sliders, Type, Keyboard } from 'lucide-react';

interface SettingsModalProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  preferences,
  onUpdatePreferences,
  onClose,
}) => {
  const handleSoundChange = (sound: SwitchSoundType) => {
    soundEngine.setSwitch(sound);
    onUpdatePreferences({ switchSound: sound });
    soundEngine.playKey(' ', false);
  };

  const handleVolumeChange = (vol: number) => {
    soundEngine.setVolume(vol);
    onUpdatePreferences({ soundVolume: vol });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">Preferences & Ergonomics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Theme Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-[var(--accent)]" />
            Visual Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'dark', label: 'Dark Minimal', desc: 'Slate canvas' },
              { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon cyan/rose' },
              { id: 'paper', label: 'Paper Light', desc: 'Editorial slate' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => onUpdatePreferences({ theme: th.id as AppTheme })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                  preferences.theme === th.id
                    ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-xs font-semibold">{th.label}</span>
                <span className="text-[10px] text-[var(--text-dim)]">{th.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Mechanical Audio Switches */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
            Mechanical Switch Audio
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'clicky', label: 'Clicky (Blue)', desc: 'Sharp crisp snap' },
              { id: 'tactile', label: 'Tactile (Brown)', desc: 'Muffled clack' },
              { id: 'linear', label: 'Linear (Red)', desc: 'Deep thock' },
              { id: 'mute', label: 'Silent / Mute', desc: 'Pure visual' },
            ].map((sw) => (
              <button
                key={sw.id}
                onClick={() => handleSoundChange(sw.id as SwitchSoundType)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                  preferences.switchSound === sw.id
                    ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-xs font-semibold">{sw.label}</span>
                <span className="text-[10px] text-[var(--text-dim)]">{sw.desc}</span>
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          {preferences.switchSound !== 'mute' && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-[var(--text-dim)] w-16">Volume:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={preferences.soundVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 accent-[var(--accent)]"
              />
              <span className="text-xs font-mono text-[var(--text-primary)] w-10 text-right tabular-nums">
                {Math.round(preferences.soundVolume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* 3. Caret Style */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
            Caret Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ['line', 'Line (|)'],
                ['block', 'Block (█)'],
                ['underline', 'Underline (_)'],
              ] as const
            ).map(([styleKey, label]) => (
              <button
                key={styleKey}
                onClick={() => onUpdatePreferences({ caretStyle: styleKey as CaretStyle })}
                className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                  preferences.caretStyle === styleKey
                    ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Font Size */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[var(--accent)]" />
            Arena Font Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                ['sm', 'Small'],
                ['md', 'Medium'],
                ['lg', 'Large'],
                ['xl', 'Extra Large'],
              ] as const
            ).map(([sizeKey, label]) => (
              <button
                key={sizeKey}
                onClick={() => onUpdatePreferences({ fontSize: sizeKey })}
                className={`p-2 rounded-xl border text-center text-xs font-medium transition-all ${
                  preferences.fontSize === sizeKey
                    ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Toggles: Live WPM & Keyboard Guide */}
        <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[var(--text-primary)]">Show Live WPM in Arena</span>
              <p className="text-[11px] text-[var(--text-dim)]">Real-time velocity counter above typing area</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.showLiveWpm}
              onChange={(e) => onUpdatePreferences({ showLiveWpm: e.target.checked })}
              className="accent-[var(--accent)] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-[var(--accent)]" />
              <div>
                <span className="text-xs font-medium text-[var(--text-primary)]">Virtual Keyboard Guide</span>
                <p className="text-[11px] text-[var(--text-dim)]">Interactive visual finger guidance underneath arena</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.showKeyboardGuide}
              onChange={(e) => onUpdatePreferences({ showKeyboardGuide: e.target.checked })}
              className="accent-[var(--accent)] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl bg-[var(--accent)] py-2.5 text-xs font-semibold text-slate-950 hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    </div>
  );
};
