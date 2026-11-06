import React, { useState } from 'react';
import { DifficultyLevel, Snippet } from '../types';
import { FileEdit, X, Play } from 'lucide-react';

interface CustomSnippetModalProps {
  onAddCustomSnippet: (snippet: Snippet) => void;
  onClose: () => void;
}

export const CustomSnippetModal: React.FC<CustomSnippetModalProps> = ({
  onAddCustomSnippet,
  onClose,
}) => {
  const [title, setTitle] = useState('My Custom Code');
  const [categoryTag, setCategoryTag] = useState('Custom');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('mid');
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedSeconds = Math.max(10, Math.round((wordCount / 50) * 60));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newSnippet: Snippet = {
      id: `custom-${Date.now()}`,
      title: title.trim() || 'Custom Practice',
      category: 'custom',
      subCategory: categoryTag.trim() || 'Custom',
      difficulty,
      text: text.trim(),
      description: `Custom text (${wordCount} words, ${charCount} chars)`,
    };

    onAddCustomSnippet(newSnippet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-7 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">Custom Typing Practice</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[var(--text-secondary)] font-medium">Exercise Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. React Reducer Function"
                className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[var(--text-secondary)] font-medium">Tag / Language</label>
              <input
                type="text"
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                placeholder="e.g. Rust or TypeScript"
                className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[var(--text-secondary)] font-medium">Practice Text or Code Snippet</label>
              <span className="text-[var(--text-dim)] font-mono">
                {wordCount} words · {charCount} chars · ~{estimatedSeconds}s
              </span>
            </div>
            <textarea
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste any code snippet, interview question, or prose passage here..."
              className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-code text-xs leading-relaxed focus:outline-none focus:border-[var(--accent)] resize-y"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-dim)]">Difficulty:</span>
              {(['junior', 'mid', 'senior'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`px-2.5 py-1 rounded capitalize text-xs font-medium transition-colors ${
                    difficulty === d
                      ? 'bg-[var(--accent)] text-slate-950 font-bold'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-slate-950 font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Practice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
