import React from 'react';
import { SNIPPETS } from '../data/snippets';
import { Snippet } from '../types';
import { BookOpen, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface LessonsViewProps {
  onSelectSnippet: (snippet: Snippet) => void;
}

const LESSON_DESCRIPTIONS = [
  {
    subCategory: 'Fundamentals',
    title: 'Lesson 1: Home Row Foundations',
    level: 'Beginner',
    fingers: 'Left: A-S-D-F · Right: J-K-L-;',
    tip: 'Keep wrists elevated and gently rest index fingers on the tactile bumps of F and J.',
  },
  {
    subCategory: 'Top Row',
    title: 'Lesson 2: Top Row & Key Vowels',
    level: 'Beginner',
    fingers: 'Q, W, E, R, T and Y, U, I, O, P',
    tip: 'Reach up with the corresponding finger without lifting your entire palm off position.',
  },
  {
    subCategory: 'Bottom Row',
    title: 'Lesson 3: Bottom Row Shift',
    level: 'Intermediate',
    fingers: 'Z, X, C, V, B and N, M, ,, .',
    tip: 'Curl your fingers inward towards your palm smoothly; avoid shifting the wrist sideways.',
  },
  {
    subCategory: 'Punctuation',
    title: 'Lesson 4: Capitalization & Punctuation',
    level: 'Intermediate',
    fingers: 'Shift, quotes, semicolons, exclamation marks',
    tip: 'Use the opposite hand Shift key: hold Right Shift when typing left-hand capitals.',
  },
  {
    subCategory: 'Symbols',
    title: 'Lesson 5: Essential Code Symbols',
    level: 'Advanced',
    fingers: '{ } [ ] ( ) => && || === ;',
    tip: 'Crucial for programmers: practice muscle memory for nested curly braces and arrow syntax.',
  },
];

export const LessonsView: React.FC<LessonsViewProps> = ({ onSelectSnippet }) => {
  const lessonSnippets = SNIPPETS.filter((s) => s.category === 'lessons');

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4 animate-in fade-in duration-150">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--accent)]" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Touch Typing Curriculum
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Progressive, muscle-memory building lessons designed to eliminate looking down at the keyboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {LESSON_DESCRIPTIONS.map((desc, idx) => {
          const matchingSnippet =
            lessonSnippets.find((s) => s.subCategory === desc.subCategory) || lessonSnippets[0];

          return (
            <div
              key={desc.subCategory}
              className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--accent)] border border-[var(--border-subtle)]">
                    0{idx + 1}
                  </span>
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">{desc.title}</h2>
                  <span className="text-xs text-[var(--text-dim)]">· {desc.level}</span>
                </div>

                <p className="text-xs text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">Finger Focus:</strong> {desc.fingers}
                </p>

                <p className="text-xs text-[var(--text-dim)] italic">
                  💡 {desc.tip}
                </p>

                {matchingSnippet && (
                  <div className="mt-1 font-mono text-xs text-[var(--text-dim)] bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-subtle)] truncate max-w-xl">
                    {matchingSnippet.text.slice(0, 70)}...
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectSnippet(matchingSnippet)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--accent)] text-slate-950 hover:opacity-90 transition-opacity whitespace-nowrap self-end sm:self-center shadow-xs"
              >
                <span>Start Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
