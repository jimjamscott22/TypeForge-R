export type PracticeCategory = 'code' | 'warmup' | 'words' | 'lessons' | 'prose' | 'custom';

export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'rust'
  | 'go'
  | 'html_css'
  | 'sql'
  | 'cpp';

export type DifficultyLevel = 'junior' | 'mid' | 'senior';

export type DurationLimit = 'snippet' | '15' | '30' | '60';

export type SwitchSoundType = 'clicky' | 'tactile' | 'linear' | 'mute';

export type AppTheme = 'dark' | 'cyberpunk' | 'paper';

export type CaretStyle = 'line' | 'block' | 'underline';

export interface Snippet {
  id: string;
  title: string;
  category: PracticeCategory;
  subCategory: string; // e.g. language name, drill type, lesson name
  difficulty: DifficultyLevel;
  language?: CodeLanguage;
  text: string;
  description?: string;
  author?: string;
}

export interface WpmSample {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface SessionStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  elapsedSeconds: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  mistakeKeys: Record<string, number>;
  wpmOverTime: WpmSample[];
}

export interface SessionRecord {
  id: string;
  timestamp: string;
  snippetId: string;
  snippetTitle: string;
  category: PracticeCategory;
  subCategory: string;
  difficulty: DifficultyLevel;
  stats: SessionStats;
}

export interface UserPreferences {
  theme: AppTheme;
  switchSound: SwitchSoundType;
  soundVolume: number; // 0 to 1
  caretStyle: CaretStyle;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  showLiveWpm: boolean;
  showKeyboardGuide: boolean;
  smoothCaret: boolean;
}

export interface OverallAnalytics {
  totalCompleted: number;
  totalDurationSeconds: number;
  allTimeBestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  dailyStreak: number;
  lastActiveDay: string;
  problemKeys: { key: string; errorCount: number }[];
  history: SessionRecord[];
}
