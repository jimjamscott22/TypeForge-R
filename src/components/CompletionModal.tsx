import React, { useEffect } from 'react';
import { SessionStats, Snippet } from '../types';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, BarChart2, Award, CheckCircle2, XCircle } from 'lucide-react';

interface CompletionModalProps {
  stats: SessionStats;
  snippet: Snippet;
  onNextSnippet: () => void;
  onTryAgain: () => void;
  onViewStats: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  stats,
  snippet,
  onNextSnippet,
  onTryAgain,
  onViewStats,
}) => {
  useEffect(() => {
    // Launch celebratory confetti if accuracy is >= 90%
    if (stats.accuracy >= 90) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#38BDF8', '#4ADE80', '#F43F5E', '#F59E0B'],
        });
      } catch (e) {
        // Safe fallback
      }
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onTryAgain();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onNextSnippet();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextSnippet, onTryAgain, stats.accuracy]);

  // Generate SVG path for WPM trajectory graph
  const renderTrajectoryGraph = () => {
    const points = stats.wpmOverTime;
    if (!points || points.length < 2) return null;

    const maxWpm = Math.max(...points.map((p) => p.wpm), 40);
    const width = 480;
    const height = 90;
    const padding = 15;

    const xStep = (width - padding * 2) / (points.length - 1);
    const coords = points.map((p, idx) => {
      const x = padding + idx * xStep;
      const y = height - padding - (p.wpm / maxWpm) * (height - padding * 2);
      return { x, y };
    });

    const pathD = coords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    return (
      <div className="w-full bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] my-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mb-1">
          <span className="font-sans">Pace Trajectory (WPM / sec)</span>
          <span className="font-mono tabular-nums">Peak: {maxWpm} wpm</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
          {/* Subtle grid line */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="var(--border-subtle)"
            strokeWidth="1"
          />
          {/* Trajectory Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots on points */}
          {coords.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={points.length > 25 ? 1.5 : 3}
              fill="var(--accent)"
            />
          ))}
        </svg>
      </div>
    );
  };

  const mistakeEntries = Object.entries(stats.mistakeKeys || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Session Complete</h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {snippet.title} · <span className="capitalize">{snippet.difficulty}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[var(--text-dim)]">Duration</span>
            <p className="text-sm font-semibold text-[var(--text-primary)] font-mono tabular-nums">
              {stats.elapsedSeconds}s
            </p>
          </div>
        </div>

        {/* Primary KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-dim)] uppercase font-semibold">Net WPM</span>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--accent)] font-mono tabular-nums mt-0.5">
              {stats.wpm}
            </p>
          </div>

          <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-dim)] uppercase font-semibold">Raw WPM</span>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-mono tabular-nums mt-0.5">
              {stats.rawWpm}
            </p>
          </div>

          <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-dim)] uppercase font-semibold">Accuracy</span>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
              {stats.accuracy}%
            </p>
          </div>

          <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-dim)] uppercase font-semibold">Consistency</span>
            <p className="text-2xl sm:text-3xl font-bold text-sky-400 font-mono tabular-nums mt-0.5">
              {stats.consistency}%
            </p>
          </div>
        </div>

        {/* WPM Pace Curve */}
        {renderTrajectoryGraph()}

        {/* Character Breakdown & Problem Keys */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-[var(--bg-elevated)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.correctCharacters} correct</span>
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
              <span>{stats.incorrectCharacters} errors</span>
            </span>
          </div>

          {mistakeEntries.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[var(--text-dim)]">Mistake keys:</span>
              {mistakeEntries.slice(0, 4).map(([key, count]) => (
                <span
                  key={key}
                  className="font-mono bg-[var(--bg-surface)] px-1.5 py-0.5 rounded border border-rose-500/30 text-rose-300 font-bold"
                >
                  {key === ' ' ? '␣' : key} ({count})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onViewStats}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-xl transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            Detailed Stats
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onTryAgain}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again <span className="opacity-50 text-[10px] hidden sm:inline">(Enter)</span>
            </button>

            <button
              onClick={onNextSnippet}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--accent)] text-slate-950 hover:opacity-90 transition-opacity shadow-sm"
            >
              Next Snippet <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
