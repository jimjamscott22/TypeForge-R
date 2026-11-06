import React, { useState } from 'react';
import { OverallAnalytics, SessionRecord } from '../types';
import { exportDataAsJson, importDataFromJson, clearAllHistory } from '../utils/statsStorage';
import {
  Trophy,
  Flame,
  Clock,
  Target,
  BarChart2,
  Download,
  Upload,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface StatsDashboardProps {
  analytics: OverallAnalytics;
  onRefreshStats: () => void;
  onStartPractice: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  analytics,
  onRefreshStats,
  onStartPractice,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = (mins / 60).toFixed(1);
    return `${hours} hrs`;
  };

  const filteredHistory = analytics.history.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importDataFromJson(content);
        onRefreshStats();
      } catch (err) {
        alert('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearHistory = () => {
    clearAllHistory();
    setShowClearConfirm(false);
    onRefreshStats();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-4 animate-in fade-in duration-150">
      {/* Title & Actions Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Progress & Performance Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Historical analytics, speed consistency, and accuracy trends across all practice sessions
          </p>
        </div>

        {/* Export / Import Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportDataAsJson(analytics.history)}
            disabled={analytics.history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Import
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={analytics.history.length === 0}
            className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 transition-colors"
            title="Clear all statistics"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--text-dim)] text-xs font-medium mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Best Speed</span>
          </div>
          <p className="text-2xl font-bold text-[var(--accent)] font-mono tabular-nums">
            {analytics.allTimeBestWpm}{' '}
            <span className="text-xs font-normal text-[var(--text-dim)]">WPM</span>
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--text-dim)] text-xs font-medium mb-1">
            <BarChart2 className="w-4 h-4 text-sky-400" />
            <span>Average Speed</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono tabular-nums">
            {analytics.averageWpm}{' '}
            <span className="text-xs font-normal text-[var(--text-dim)]">WPM</span>
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--text-dim)] text-xs font-medium mb-1">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {analytics.averageAccuracy}%
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--text-dim)] text-xs font-medium mb-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Daily Streak</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono tabular-nums">
            {analytics.dailyStreak}{' '}
            <span className="text-xs font-normal text-[var(--text-dim)]">days</span>
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--text-dim)] text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Practice Time</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono tabular-nums">
            {formatDuration(analytics.totalDurationSeconds)}
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--text-dim)] text-xs font-medium mb-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Completed</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono tabular-nums">
            {analytics.totalCompleted}{' '}
            <span className="text-xs font-normal text-[var(--text-dim)]">tests</span>
          </p>
        </div>
      </div>

      {/* Speed Over Recent Sessions Sparkline */}
      {analytics.history.length > 0 && (
        <div className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Speed History & Velocity Trend
            </h2>
            <span className="text-xs text-[var(--text-dim)] font-mono">
              Last {Math.min(20, analytics.history.length)} sessions
            </span>
          </div>

          <div className="w-full h-32 flex items-end gap-1.5 pt-4">
            {analytics.history
              .slice(0, 20)
              .reverse()
              .map((session, idx) => {
                const maxVal = Math.max(...analytics.history.map((s) => s.stats.wpm), 60);
                const barHeight = Math.max(12, Math.round((session.stats.wpm / maxVal) * 100));

                return (
                  <div
                    key={session.id || idx}
                    className="flex-1 flex flex-col items-center gap-1 group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-primary)] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20 font-mono">
                      {session.stats.wpm} WPM · {session.stats.accuracy}% · {session.snippetTitle}
                    </div>

                    <div
                      className="w-full bg-[var(--bg-elevated)] group-hover:bg-[var(--accent)] transition-colors rounded-t-sm"
                      style={{ height: `${barHeight}%` }}
                    />
                    <span className="text-[10px] text-[var(--text-dim)] font-mono tabular-nums">
                      {session.stats.wpm}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Problem Keys Analysis */}
      {analytics.problemKeys.length > 0 && (
        <div className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Problem Keys Matrix</h2>
              <p className="text-xs text-[var(--text-dim)]">
                Characters that triggered the highest error frequency in recent sessions
              </p>
            </div>
            <span className="text-xs text-rose-400 font-medium">Targeted Practice Focus</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            {analytics.problemKeys.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              >
                <span className="font-mono text-lg font-bold text-[var(--accent)] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                  {item.key === ' ' ? '␣ Space' : item.key}
                </span>
                <span className="text-xs text-rose-400 font-mono tabular-nums font-semibold">
                  {item.errorCount} {item.errorCount === 1 ? 'error' : 'errors'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session History Log Table */}
      <div className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Session History Log</h2>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-[var(--bg-elevated)] rounded-lg text-xs font-medium">
            {['all', 'code', 'warmup', 'words', 'lessons', 'prose'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  filterCategory === cat
                    ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-[var(--text-secondary)]">No completed sessions recorded yet.</p>
            <button
              onClick={onStartPractice}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--accent)] text-slate-950 hover:opacity-90 transition-opacity"
            >
              Start First Practice Session
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-secondary)]">
              <thead className="border-b border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-dim)] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Snippet</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Net WPM</th>
                  <th className="py-2.5 px-3 text-right">Raw WPM</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
                {filteredHistory.map((row) => {
                  const date = new Date(row.timestamp);
                  const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-[var(--bg-elevated)]/50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-sans text-[var(--text-dim)]">{dateStr}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-[var(--text-primary)]">
                        {row.snippetTitle}
                      </td>
                      <td className="py-2.5 px-3 font-sans capitalize text-[var(--text-secondary)]">
                        {row.category}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[var(--accent)] tabular-nums">
                        {row.stats.wpm}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-secondary)]">
                        {row.stats.rawWpm}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 font-semibold">
                        {row.stats.accuracy}%
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-dim)]">
                        {row.stats.elapsedSeconds}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal to Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Reset All Statistics?
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              This will permanently delete your session history, streak, and problem key records.
              Consider exporting a JSON backup first.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
