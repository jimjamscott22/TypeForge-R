import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppTheme,
  CodeLanguage,
  DifficultyLevel,
  DurationLimit,
  PracticeCategory,
  SessionRecord,
  SessionStats,
  Snippet,
  SwitchSoundType,
  UserPreferences,
} from './types';
import { SNIPPETS } from './data/snippets';
import {
  computeOverallAnalytics,
  loadPreferences,
  loadSessionRecords,
  savePreferences,
  saveSessionRecord,
} from './utils/statsStorage';
import { soundEngine } from './utils/soundEngine';
import { TopBar } from './components/TopBar';
import { Toolbar } from './components/Toolbar';
import { TypingArena } from './components/TypingArena';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { CompletionModal } from './components/CompletionModal';
import { StatsDashboard } from './components/StatsDashboard';
import { LessonsView } from './components/LessonsView';
import { AboutView } from './components/AboutView';
import { SettingsModal } from './components/SettingsModal';
import { CustomSnippetModal } from './components/CustomSnippetModal';
import { OfflineBanner } from './components/OfflineBanner';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'practice' | 'lessons' | 'stats' | 'info'>('practice');

  // Preferences & Sound
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());
  const [theme, setTheme] = useState<AppTheme>(preferences.theme || 'dark');
  const [switchSound, setSwitchSound] = useState<SwitchSoundType>(preferences.switchSound || 'clicky');

  // Content Filtering
  const [category, setCategory] = useState<PracticeCategory>('code');
  const [language, setLanguage] = useState<CodeLanguage>('typescript');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('junior');
  const [durationLimit, setDurationLimit] = useState<DurationLimit>('snippet');
  const [subCategory, setSubCategory] = useState<string>('TypeScript');

  // Active Snippet & Practice Session
  const [customSnippets, setCustomSnippets] = useState<Snippet[]>([]);
  const [snippetIndex, setSnippetIndex] = useState<number>(0);
  const [completedStats, setCompletedStats] = useState<SessionStats | null>(null);

  // Virtual Keyboard state
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [targetChar, setTargetChar] = useState<string | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // History & Telemetry Analytics
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessionRecords());
  const analytics = useMemo(() => computeOverallAnalytics(sessions), [sessions]);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'paper') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Sync sound engine with preferences
  useEffect(() => {
    soundEngine.setSwitch(switchSound);
    soundEngine.setVolume(preferences.soundVolume);
  }, [switchSound, preferences.soundVolume]);

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updated };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
    if (updated.theme) setTheme(updated.theme);
    if (updated.switchSound) setSwitchSound(updated.switchSound);
  };

  // Filter available snippets according to active category and options
  const availableSnippets = useMemo(() => {
    if (category === 'custom') {
      return customSnippets.length > 0 ? customSnippets : [SNIPPETS[0]];
    }

    if (category === 'code') {
      const matched = SNIPPETS.filter(
        (s) => s.category === 'code' && s.language === language && s.difficulty === difficulty
      );
      if (matched.length > 0) return matched;
      // Fallback to any language match
      const langFallback = SNIPPETS.filter((s) => s.category === 'code' && s.language === language);
      return langFallback.length > 0 ? langFallback : [SNIPPETS[0]];
    }

    if (category === 'warmup') {
      const matched = SNIPPETS.filter((s) => s.category === 'warmup' && s.subCategory === subCategory);
      return matched.length > 0 ? matched : SNIPPETS.filter((s) => s.category === 'warmup');
    }

    if (category === 'words') {
      const matched = SNIPPETS.filter((s) => s.category === 'words' && s.subCategory === subCategory);
      return matched.length > 0 ? matched : SNIPPETS.filter((s) => s.category === 'words');
    }

    if (category === 'lessons') {
      const matched = SNIPPETS.filter((s) => s.category === 'lessons' && s.subCategory === subCategory);
      return matched.length > 0 ? matched : SNIPPETS.filter((s) => s.category === 'lessons');
    }

    if (category === 'prose') {
      const matched = SNIPPETS.filter((s) => s.category === 'prose' && s.title.includes(subCategory));
      return matched.length > 0 ? matched : SNIPPETS.filter((s) => s.category === 'prose');
    }

    return SNIPPETS;
  }, [category, language, difficulty, subCategory, customSnippets]);

  // Current active snippet
  const activeSnippet = useMemo(() => {
    const safeIdx = snippetIndex % (availableSnippets.length || 1);
    return availableSnippets[safeIdx] || SNIPPETS[0];
  }, [availableSnippets, snippetIndex]);

  // Shuffle / Next Snippet
  const handleShuffleSnippet = useCallback(() => {
    setSnippetIndex((prev) => (prev + 1) % availableSnippets.length);
    setCompletedStats(null);
  }, [availableSnippets.length]);

  // Handle category change and auto-set appropriate subCategory default
  const handleCategoryChange = (newCat: PracticeCategory) => {
    setCategory(newCat);
    setSnippetIndex(0);
    setCompletedStats(null);

    if (newCat === 'code') setSubCategory(language);
    else if (newCat === 'warmup') setSubCategory('Home Row');
    else if (newCat === 'words') setSubCategory('Core 100');
    else if (newCat === 'lessons') setSubCategory('Fundamentals');
    else if (newCat === 'prose') setSubCategory('Alan Turing');
  };

  // Completion Handler
  const handleCompleteSession = useCallback(
    (stats: SessionStats) => {
      setCompletedStats(stats);

      const record: SessionRecord = {
        id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        snippetId: activeSnippet.id,
        snippetTitle: activeSnippet.title,
        category: activeSnippet.category,
        subCategory: activeSnippet.subCategory,
        difficulty: activeSnippet.difficulty,
        stats,
      };

      const updatedSessions = saveSessionRecord(record);
      setSessions(updatedSessions);
    },
    [activeSnippet]
  );

  const handleLessonSelect = (snippet: Snippet) => {
    setCategory('lessons');
    setSubCategory(snippet.subCategory);
    setActiveTab('practice');
    setCompletedStats(null);
  };

  const handleAddCustomSnippet = (snippet: Snippet) => {
    setCustomSnippets((prev) => [snippet, ...prev]);
    setCategory('custom');
    setActiveTab('practice');
    setCompletedStats(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-200">
      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={(newTheme) => handleUpdatePreferences({ theme: newTheme })}
        switchSound={switchSound}
        setSwitchSound={(newSound) => handleUpdatePreferences({ switchSound: newSound })}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-col justify-center">
        {activeTab === 'practice' && (
          <div className="flex flex-col gap-5">
            {/* Toolbar Controls */}
            <Toolbar
              category={category}
              setCategory={handleCategoryChange}
              language={language}
              setLanguage={(l) => {
                setLanguage(l);
                setSnippetIndex(0);
              }}
              difficulty={difficulty}
              setDifficulty={(d) => {
                setDifficulty(d);
                setSnippetIndex(0);
              }}
              durationLimit={durationLimit}
              setDurationLimit={setDurationLimit}
              subCategory={subCategory}
              setSubCategory={(sub) => {
                setSubCategory(sub);
                setSnippetIndex(0);
              }}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
              onShuffleSnippet={handleShuffleSnippet}
              onRestart={() => setCompletedStats(null)}
            />

            {/* Typing Arena */}
            <TypingArena
              key={`${activeSnippet.id}-${durationLimit}`}
              snippet={activeSnippet}
              durationLimit={durationLimit}
              fontSize={preferences.fontSize}
              caretStyle={preferences.caretStyle}
              showLiveWpm={preferences.showLiveWpm}
              onComplete={handleCompleteSession}
              onActiveKeyChange={(key, target) => {
                setActiveKey(key);
                setTargetChar(target);
              }}
            />

            {/* Optional Virtual Keyboard Guide */}
            {preferences.showKeyboardGuide && (
              <VirtualKeyboard activeKey={activeKey} targetChar={targetChar} />
            )}
          </div>
        )}

        {activeTab === 'lessons' && (
          <LessonsView onSelectSnippet={handleLessonSelect} />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard
            analytics={analytics}
            onRefreshStats={() => setSessions(loadSessionRecords())}
            onStartPractice={() => setActiveTab('practice')}
          />
        )}

        {activeTab === 'info' && (
          <AboutView onStartPractice={() => setActiveTab('practice')} />
        )}
      </main>

      {/* Clean Distraction-Free Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-4 px-6 text-center text-xs text-[var(--text-dim)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-secondary)]">Reactive-Typing</span>
            <span>·</span>
            <span>Developer Ergonomics & Touch Typing</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Tab + Enter to restart</span>
            <span>·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Sound & Theme
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('info')}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Shortcuts
            </button>
          </div>
        </div>
      </footer>

      {/* Completion Modal */}
      {completedStats && (
        <CompletionModal
          stats={completedStats}
          snippet={activeSnippet}
          onNextSnippet={handleShuffleSnippet}
          onTryAgain={() => setCompletedStats(null)}
          onViewStats={() => {
            setCompletedStats(null);
            setActiveTab('stats');
          }}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Custom Snippet Modal */}
      {isCustomModalOpen && (
        <CustomSnippetModal
          onAddCustomSnippet={handleAddCustomSnippet}
          onClose={() => setIsCustomModalOpen(false)}
        />
      )}

      {/* Offline Status Toast */}
      <OfflineBanner />
    </div>
  );
}
