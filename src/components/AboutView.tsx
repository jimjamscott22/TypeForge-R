import React from 'react';
import { Keyboard, Code2, Dumbbell, Zap, Shield, Volume2, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onStartPractice: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartPractice }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4 animate-in fade-in duration-150">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          About Reactive-Typing
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          A distraction-free typing arena optimized for developers, programmers, and speed-typing enthusiasts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] mb-1">
            <Code2 className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Developer Mode</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Real code syntax across TypeScript, Python, Rust, Go, SQL, HTML/CSS, and C++. Master braces, brackets, arrow functions, and indentation.
          </p>
        </div>

        <div className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] mb-1">
            <Dumbbell className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Finger Warmups & Drills</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Short, focused drills for home row agility, common high-frequency n-grams, numbers, and operator stretches to prime your hands before long coding sessions.
          </p>
        </div>

        <div className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] mb-1">
            <Volume2 className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Mechanical Switch Audio</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Synthetic Web Audio API sound generator simulating Cherry MX Blue (Clicky), Brown (Tactile), and Red (Linear) acoustic clacks with zero download latency.
          </p>
        </div>
      </div>

      {/* Keyboard Shortcuts Section */}
      <div className="p-6 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-[var(--accent)]" />
          Keyboard Shortcuts & Arena Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Instant Restart Snippet</span>
            <div className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">Tab</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">Enter</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Reset Arena State</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)]">Esc</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Next Snippet (on completion)</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)]">Tab</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Repeat Snippet (on completion)</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)]">Enter</kbd>
          </div>
        </div>
      </div>

      {/* Offline & Privacy Callout */}
      <div className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex items-start gap-3">
        <Shield className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">100% Client-Side & Offline Ready</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            All your statistics, sessions, and custom snippets are stored strictly within your browser's local storage. No external servers track your keystrokes. Install as a PWA to practice completely offline anytime.
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={onStartPractice}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl bg-[var(--accent)] text-slate-950 hover:opacity-90 transition-opacity shadow-sm"
        >
          <span>Jump Into Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
