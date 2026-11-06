import { OverallAnalytics, SessionRecord, UserPreferences } from '../types';

const STORAGE_KEY_SESSIONS = 'reactive_typing_sessions_v1';
const STORAGE_KEY_PREFS = 'reactive_typing_prefs_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  switchSound: 'clicky',
  soundVolume: 0.5,
  caretStyle: 'line',
  fontSize: 'md',
  showLiveWpm: true,
  showKeyboardGuide: false,
  smoothCaret: true,
};

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFS);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse preferences from localStorage', e);
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences to localStorage', e);
  }
}

export function loadSessionRecords(): SessionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw) as SessionRecord[];
  } catch (e) {
    console.error('Failed to parse session records from localStorage', e);
    return [];
  }
}

export function saveSessionRecord(record: SessionRecord): SessionRecord[] {
  const current = loadSessionRecords();
  const updated = [record, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save session records to localStorage', e);
  }
  return updated;
}

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
  } catch (e) {
    console.error('Failed to clear history from localStorage', e);
  }
}

export function computeOverallAnalytics(sessions: SessionRecord[]): OverallAnalytics {
  if (sessions.length === 0) {
    return {
      totalCompleted: 0,
      totalDurationSeconds: 0,
      allTimeBestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      dailyStreak: 0,
      lastActiveDay: '',
      problemKeys: [],
      history: [],
    };
  }

  let totalDuration = 0;
  let bestWpm = 0;
  let sumWpm = 0;
  let sumAcc = 0;
  const mistakeCounts: Record<string, number> = {};

  sessions.forEach((s) => {
    totalDuration += s.stats.elapsedSeconds || 0;
    if (s.stats.wpm > bestWpm) {
      bestWpm = s.stats.wpm;
    }
    sumWpm += s.stats.wpm;
    sumAcc += s.stats.accuracy;

    if (s.stats.mistakeKeys) {
      Object.entries(s.stats.mistakeKeys).forEach(([key, count]) => {
        mistakeCounts[key] = (mistakeCounts[key] || 0) + count;
      });
    }
  });

  const avgWpm = Math.round(sumWpm / sessions.length);
  const avgAcc = Math.round((sumAcc / sessions.length) * 10) / 10;

  // Problem keys sorted by frequency
  const problemKeys = Object.entries(mistakeCounts)
    .map(([key, errorCount]) => ({ key, errorCount }))
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 10);

  // Compute daily streak
  const uniqueDays = Array.from(
    new Set(
      sessions.map((s) => {
        const d = new Date(s.timestamp);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`;
      })
    )
  ).sort().reverse();

  let streak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(
    yesterday.getMonth() + 1
  ).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (uniqueDays.length > 0) {
    const mostRecent = uniqueDays[0];
    if (mostRecent === todayStr || mostRecent === yesterdayStr) {
      streak = 1;
      let checkDate = new Date(mostRecent === todayStr ? today : yesterday);
      for (let i = 1; i < uniqueDays.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expected = `${checkDate.getFullYear()}-${String(
          checkDate.getMonth() + 1
        ).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (uniqueDays[i] === expected) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    totalCompleted: sessions.length,
    totalDurationSeconds: Math.round(totalDuration),
    allTimeBestWpm: bestWpm,
    averageWpm: avgWpm,
    averageAccuracy: avgAcc,
    dailyStreak: streak,
    lastActiveDay: uniqueDays[0] || '',
    problemKeys,
    history: sessions,
  };
}

export function exportDataAsJson(sessions: SessionRecord[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `reactive-typing-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDataFromJson(jsonString: string): SessionRecord[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Imported data must be an array of sessions');
    }
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(parsed));
    return parsed;
  } catch (err) {
    console.error('Failed to import JSON data', err);
    throw err;
  }
}
