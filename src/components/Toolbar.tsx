import React from 'react';
import { CodeLanguage, DifficultyLevel, DurationLimit, PracticeCategory } from '../types';
import { Code2, Dumbbell, Type, BookOpen, Quote, FileEdit, RotateCcw } from 'lucide-react';

interface ToolbarProps {
  category: PracticeCategory;
  setCategory: (cat: PracticeCategory) => void;
  language: CodeLanguage;
  setLanguage: (lang: CodeLanguage) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (diff: DifficultyLevel) => void;
  durationLimit: DurationLimit;
  setDurationLimit: (dur: DurationLimit) => void;
  subCategory: string;
  setSubCategory: (sub: string) => void;
  onOpenCustomModal: () => void;
  onShuffleSnippet: () => void;
  onRestart: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  category,
  setCategory,
  language,
  setLanguage,
  difficulty,
  setDifficulty,
  durationLimit,
  setDurationLimit,
  subCategory,
  setSubCategory,
  onOpenCustomModal,
  onShuffleSnippet,
  onRestart,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 py-2">
      {/* Primary Category Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setCategory('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              category === 'code'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Developer Mode
          </button>

          <button
            onClick={() => setCategory('warmup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              category === 'warmup'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Warmup Drills
          </button>

          <button
            onClick={() => setCategory('words')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              category === 'words'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Default Words
          </button>

          <button
            onClick={() => setCategory('lessons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              category === 'lessons'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Lessons
          </button>

          <button
            onClick={() => setCategory('prose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              category === 'prose'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            Literature
          </button>

          <button
            onClick={onOpenCustomModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              category === 'custom'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            Custom
          </button>
        </div>

        {/* Quick Restart and Shuffle actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShuffleSnippet}
            title="Next snippet in current mode"
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-dim)] transition-colors whitespace-nowrap"
          >
            Next Snippet
          </button>
          <button
            onClick={onRestart}
            title="Restart current text (Tab + Enter)"
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-dim)] transition-colors focus:outline-none"
            aria-label="Restart snippet"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Contextual Options Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs py-1 px-1">
        {/* If Developer Code: Select Language & Difficulty */}
        {category === 'code' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-subtle)]">
              {(
                [
                  ['typescript', 'TypeScript'],
                  ['python', 'Python'],
                  ['rust', 'Rust'],
                  ['go', 'Go'],
                  ['sql', 'SQL'],
                  ['cpp', 'C++'],
                ] as const
              ).map(([langKey, label]) => (
                <button
                  key={langKey}
                  onClick={() => setLanguage(langKey)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    language === langKey
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Difficulty Level */}
            <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-subtle)]">
              {(
                [
                  ['junior', 'Junior'],
                  ['mid', 'Mid'],
                  ['senior', 'Senior'],
                ] as const
              ).map(([diffKey, label]) => (
                <button
                  key={diffKey}
                  onClick={() => setDifficulty(diffKey)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    difficulty === diffKey
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If Warmup: Select Drill Focus */}
        {category === 'warmup' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[var(--text-dim)] mr-1">Drill:</span>
            {[
              ['Home Row', 'Home Row Agility'],
              ['Digraphs', 'High-Frequency N-Grams'],
              ['Code Symbols', 'Delimiters & Parens'],
              ['Operators', 'Syntax Operators'],
              ['Numbers', 'Number Row'],
            ].map(([sub, label]) => (
              <button
                key={sub}
                onClick={() => setSubCategory(sub)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  subCategory === sub
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-elevated)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* If Default Words: Timer Limit & Word Set */}
        {category === 'words' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-dim)] mr-1">Vocabulary:</span>
              {['Core 100', 'Dev Words'].map((vocab) => (
                <button
                  key={vocab}
                  onClick={() => setSubCategory(vocab)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                    subCategory === vocab
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-elevated)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {vocab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-dim)] px-2">Timer:</span>
              {(
                [
                  ['snippet', 'Full Text'],
                  ['15', '15s'],
                  ['30', '30s'],
                  ['60', '60s'],
                ] as const
              ).map(([dur, label]) => (
                <button
                  key={dur}
                  onClick={() => setDurationLimit(dur)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    durationLimit === dur
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If Lessons: Select Level */}
        {category === 'lessons' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[var(--text-dim)] mr-1">Curriculum:</span>
            {[
              ['Fundamentals', '1. Home Row'],
              ['Top Row', '2. Top Row'],
              ['Bottom Row', '3. Bottom Row'],
              ['Punctuation', '4. Punctuation'],
              ['Symbols', '5. Code Symbols'],
            ].map(([sub, label]) => (
              <button
                key={sub}
                onClick={() => setSubCategory(sub)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  subCategory === sub
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-elevated)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* If Literature / Prose: Select Author/Essay */}
        {category === 'prose' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[var(--text-dim)] mr-1">Text:</span>
            {[
              ['Alan Turing', 'Alan Turing'],
              ['Ada Lovelace', 'Ada Lovelace'],
              ['Donald Knuth', 'Donald Knuth'],
              ['Unix Philosophy', 'Unix Philosophy'],
            ].map(([author, label]) => (
              <button
                key={author}
                onClick={() => setSubCategory(author)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  subCategory.includes(author)
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-elevated)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Distraction-free shortcut badge */}
        <div className="hidden md:flex items-center gap-2 text-[var(--text-dim)] text-[11px] ml-auto">
          <span>Restart: <kbd className="font-mono bg-[var(--bg-elevated)] px-1 py-0.5 rounded border border-[var(--border-subtle)]">Tab</kbd> + <kbd className="font-mono bg-[var(--bg-elevated)] px-1 py-0.5 rounded border border-[var(--border-subtle)]">Enter</kbd></span>
        </div>
      </div>
    </div>
  );
};
