import React, { useState } from 'react';
import { AppTheme, SwitchSoundType } from '../types';
import { Volume2, VolumeX, BarChart2, BookOpen, Keyboard, Settings, Download, Moon, Sun, Zap, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface TopBarProps {
  activeTab: 'practice' | 'lessons' | 'stats' | 'info';
  setActiveTab: (tab: 'practice' | 'lessons' | 'stats' | 'info') => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  switchSound: SwitchSoundType;
  setSwitchSound: (sound: SwitchSoundType) => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  switchSound,
  setSwitchSound,
  onOpenSettings,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const toggleSound = () => {
    if (switchSound === 'mute') {
      setSwitchSound('clicky');
    } else {
      setSwitchSound('mute');
    }
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('cyberpunk');
    else if (theme === 'cyberpunk') setTheme('paper');
    else setTheme('dark');
  };

  return (
    <>
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('practice')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] shadow-sm group-hover:border-[var(--accent)] transition-colors">
                <Keyboard className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[var(--text-primary)] whitespace-nowrap">
                Reactive<span className="text-[var(--accent)]">Typing</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'practice'
                  ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'lessons'
                  ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 hidden sm:inline" />
              Lessons
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'stats'
                  ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 hidden sm:inline" />
              Stats
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'info'
                  ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Info className="w-3.5 h-3.5 hidden sm:inline" />
              About
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={`Switch Sound: ${switchSound.toUpperCase()} (Click to toggle)`}
              className="p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus:outline-none"
              aria-label="Toggle Mechanical Keyboard Audio"
            >
              {switchSound === 'mute' ? (
                <VolumeX className="w-4 h-4 text-[var(--text-dim)]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[var(--accent)]" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              title={`Current Theme: ${theme} (Click to switch)`}
              className="p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus:outline-none"
              aria-label="Switch Theme"
            >
              {theme === 'dark' && <Moon className="w-4 h-4" />}
              {theme === 'cyberpunk' && <Zap className="w-4 h-4 text-emerald-400" />}
              {theme === 'paper' && <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Preferences & Settings"
              className="p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus:outline-none"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* PWA Install Button */}
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)] text-slate-950 hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            )}

            {!isInstalled && isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap"
              >
                Install iOS
              </button>
            )}
          </div>
        </div>
      </header>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Install on iPhone or iPad</h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              1. Tap the <span className="font-semibold text-[var(--text-primary)]">Share</span> icon in the Safari toolbar.<br />
              2. Scroll down and choose <span className="font-semibold text-[var(--text-primary)]">Add to Home Screen</span>.<br />
              3. Launch Reactive-Typing directly from your home screen for full-screen offline typing!
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-lg bg-[var(--bg-elevated)] py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
