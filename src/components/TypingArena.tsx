import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CaretStyle, DurationLimit, SessionStats, Snippet, WpmSample } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { AlertCircle, RotateCcw, Clock } from 'lucide-react';

interface TypingArenaProps {
  snippet: Snippet;
  durationLimit: DurationLimit;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  caretStyle: CaretStyle;
  showLiveWpm: boolean;
  onComplete: (stats: SessionStats) => void;
  onActiveKeyChange?: (key: string | null, targetChar: string | null) => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  snippet,
  durationLimit,
  fontSize,
  caretStyle,
  showLiveWpm,
  onComplete,
  onActiveKeyChange,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);
  const [mistakeKeys, setMistakeKeys] = useState<Record<string, number>>({});
  const [wpmSamples, setWpmSamples] = useState<WpmSample[]>([]);
  const [totalKeyStrokes, setTotalKeyStrokes] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const currentCharRef = useRef<HTMLSpanElement | null>(null);

  const targetText = snippet.text;
  const isTimed = durationLimit !== 'snippet';
  const timeLimitSeconds = isTimed ? parseInt(durationLimit, 10) : null;

  // Font size class mapping
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base sm:text-lg leading-relaxed';
      case 'lg':
        return 'text-xl sm:text-2xl leading-relaxed';
      case 'xl':
        return 'text-2xl sm:text-3xl leading-loose';
      default:
        return 'text-lg sm:text-xl leading-relaxed';
    }
  };

  // Reset arena state when snippet or duration changes
  const resetArena = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setMistakeKeys({});
    setWpmSamples([]);
    setTotalKeyStrokes(0);
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = '';
      hiddenInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    resetArena();
  }, [snippet.id, durationLimit, resetArena]);

  // Real-time WPM calculation
  const calculateMetrics = useCallback(
    (input: string, elapsed: number) => {
      if (elapsed <= 0 || input.length === 0) {
        return { wpm: 0, rawWpm: 0, accuracy: 100 };
      }

      let correct = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === targetText[i]) {
          correct++;
        }
      }

      const minutes = elapsed / 60;
      const rawWpm = Math.round(input.length / 5 / minutes);
      const netWpm = Math.max(0, Math.round(correct / 5 / minutes));
      const accuracy = input.length > 0 ? Math.round((correct / input.length) * 1000) / 10 : 100;

      return { wpm: netWpm, rawWpm, accuracy };
    },
    [targetText]
  );

  // Finish session handler
  const handleSessionFinish = useCallback(() => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const duration = Math.max(1, elapsedSeconds);
    const { wpm, rawWpm, accuracy } = calculateMetrics(userInput, duration);

    let correctChars = 0;
    let incorrectChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    // Consistency score (inverse variance of rolling samples)
    let consistency = 95;
    if (wpmSamples.length > 2) {
      const sampleWpms = wpmSamples.map((s) => s.wpm);
      const mean = sampleWpms.reduce((a, b) => a + b, 0) / sampleWpms.length;
      const variance =
        sampleWpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sampleWpms.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(20, Math.min(100, Math.round(100 - (stdDev / (mean || 1)) * 40)));
    }

    const finalStats: SessionStats = {
      wpm,
      rawWpm: Math.max(wpm, rawWpm),
      accuracy,
      consistency,
      elapsedSeconds: duration,
      totalCharacters: userInput.length,
      correctCharacters: correctChars,
      incorrectCharacters: incorrectChars,
      mistakeKeys,
      wpmOverTime: wpmSamples,
    };

    onComplete(finalStats);
  }, [calculateMetrics, elapsedSeconds, mistakeKeys, onComplete, targetText, userInput, wpmSamples]);

  // Second-by-second telemetry interval
  useEffect(() => {
    if (!startTime) return;

    timerIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.max(1, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(elapsed);

      // Check if timed mode expired
      if (timeLimitSeconds && elapsed >= timeLimitSeconds) {
        handleSessionFinish();
        return;
      }

      // Collect sample for trajectory curve
      const current = calculateMetrics(hiddenInputRef.current?.value || '', elapsed);
      setWpmSamples((prev) => [
        ...prev,
        {
          second: elapsed,
          wpm: current.wpm,
          rawWpm: current.rawWpm,
          errors: Object.values(mistakeKeys).reduce((a, b) => a + b, 0),
        },
      ]);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, [startTime, timeLimitSeconds, calculateMetrics, handleSessionFinish, mistakeKeys]);

  // Keydown input handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Detect caps lock
    setCapsLockOn(e.getModifierState('CapsLock'));

    // Check for Tab + Enter shortcut to restart
    if (e.key === 'Tab') {
      e.preventDefault();
      // If code expects a tab, allow user to type it!
      const nextExpected = targetText[userInput.length];
      if (nextExpected === '\t') {
        processTypedChar('\t');
        return;
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      resetArena();
      return;
    }

    // Pass active key to keyboard guide
    if (onActiveKeyChange) {
      onActiveKeyChange(e.key, targetText[userInput.length] || null);
    }
  };

  const handleKeyUp = () => {
    if (onActiveKeyChange) {
      onActiveKeyChange(null, targetText[userInput.length] || null);
    }
  };

  const processTypedChar = (char: string) => {
    const nextIdx = userInput.length;
    if (nextIdx >= targetText.length) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setTotalKeyStrokes((prev) => prev + 1);
    const expected = targetText[nextIdx];
    const isError = char !== expected;

    // Trigger mechanical audio
    soundEngine.playKey(char, isError);

    if (isError) {
      setMistakeKeys((prev) => ({
        ...prev,
        [expected]: (prev[expected] || 0) + 1,
      }));
    }

    const newInput = userInput + char;
    setUserInput(newInput);

    // If reached end of snippet
    if (newInput.length >= targetText.length) {
      setTimeout(() => {
        handleSessionFinish();
      }, 50);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // User pressed Backspace
    if (val.length < userInput.length) {
      soundEngine.playKey('Backspace', false);
      setUserInput(val);
      return;
    }

    // New characters typed
    const newChars = val.slice(userInput.length);
    for (const ch of newChars) {
      processTypedChar(ch);
    }
  };

  // Keep hidden textarea focused
  const focusArena = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
    setIsFocused(true);
  };

  // Scroll current character into view if needed
  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      const charEl = currentCharRef.current;
      const contEl = containerRef.current;
      const charOffset = charEl.offsetTop - contEl.offsetTop;
      if (charOffset > contEl.clientHeight * 0.7 || charOffset < contEl.scrollTop) {
        contEl.scrollTo({
          top: charOffset - contEl.clientHeight * 0.3,
          behavior: 'smooth',
        });
      }
    }
  }, [userInput.length]);

  const liveStats = calculateMetrics(userInput, Math.max(1, elapsedSeconds));
  const progressPercent = Math.min(100, Math.round((userInput.length / targetText.length) * 100));
  const remainingTime = timeLimitSeconds ? Math.max(0, timeLimitSeconds - elapsedSeconds) : null;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 select-none relative">
      {/* Live Telemetry Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--text-secondary)] font-mono border-b border-[var(--border-subtle)] pb-2.5 px-2">
        <div className="flex items-center gap-4 sm:gap-6">
          {showLiveWpm && (
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-dim)] uppercase text-[10px] tracking-wider font-sans">WPM</span>
              <span className="font-semibold text-lg text-[var(--accent)] tabular-nums">
                {liveStats.wpm}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-dim)] uppercase text-[10px] tracking-wider font-sans">ACC</span>
            <span className="font-semibold text-base sm:text-lg text-[var(--text-primary)] tabular-nums">
              {liveStats.accuracy}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-dim)] uppercase text-[10px] tracking-wider font-sans">
              {isTimed ? 'TIME LEFT' : 'TIME'}
            </span>
            <span className="font-medium text-[var(--text-primary)] tabular-nums flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--text-dim)]" />
              {isTimed ? `${remainingTime}s` : `${elapsedSeconds}s`}
            </span>
          </div>
        </div>

        {/* Progress & CapsLock Indicator */}
        <div className="flex items-center gap-4">
          {capsLockOn && (
            <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>CAPS LOCK</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="w-20 sm:w-28 h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-dim)] tabular-nums">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Code / Text Arena Card */}
      <div
        ref={containerRef}
        onClick={focusArena}
        className={`w-full min-h-[220px] max-h-[380px] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border transition-all duration-200 cursor-text relative font-code ${getFontSizeClass()} ${
          isFocused
            ? 'border-[var(--border-focus)] shadow-lg shadow-[var(--accent-glow)]'
            : 'border-[var(--border-subtle)] opacity-85'
        }`}
      >
        {/* Hidden capturing Textarea */}
        <textarea
          ref={hiddenInputRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 opacity-0 pointer-events-none resize-none"
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />

        {/* Unfocused Click Prompt */}
        {!isFocused && (
          <div className="absolute inset-0 bg-[var(--bg-canvas)]/75 backdrop-blur-xs flex items-center justify-center rounded-2xl z-10">
            <span className="text-xs sm:text-sm font-sans font-medium text-[var(--text-primary)] bg-[var(--bg-elevated)] px-4 py-2 rounded-xl border border-[var(--border-subtle)] shadow-md">
              Click anywhere or press any key to focus
            </span>
          </div>
        )}

        {/* Monospace Character Stream with Smooth Caret */}
        <div className="whitespace-pre-wrap break-words leading-relaxed tracking-normal relative">
          {targetText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const typedChar = userInput[index];
            const isCorrect = isTyped && typedChar === char;
            const isError = isTyped && typedChar !== char;

            return (
              <span
                key={index}
                ref={isCurrent ? currentCharRef : null}
                className={`relative inline transition-colors duration-75 ${
                  isCorrect
                    ? 'text-[var(--char-correct)] bg-[var(--char-correct-bg)]'
                    : isError
                    ? 'text-[var(--char-error)] bg-[var(--char-error-bg)] rounded-xs underline decoration-red-400 decoration-2'
                    : 'text-[var(--char-pending)]'
                }`}
              >
                {/* Active Caret Cursor */}
                {isCurrent && isFocused && (
                  <span
                    className={`absolute -left-[1px] top-0 pointer-events-none caret-pulse ${
                      caretStyle === 'block'
                        ? 'w-2.5 h-full bg-[var(--caret-color)] opacity-60'
                        : caretStyle === 'underline'
                        ? 'w-full h-[3px] -bottom-0.5 bg-[var(--caret-color)]'
                        : 'w-[2px] h-full bg-[var(--caret-color)] shadow-[0_0_8px_var(--caret-color)]'
                    }`}
                  />
                )}
                {char === '\n' ? (
                  <>
                    <span className="opacity-30 text-xs">↵</span>
                    {'\n'}
                  </>
                ) : (
                  char
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Snippet Context Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--text-dim)] px-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--text-secondary)]">{snippet.title}</span>
          <span>·</span>
          <span>{snippet.subCategory}</span>
          {snippet.description && (
            <>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline truncate max-w-xs">{snippet.description}</span>
            </>
          )}
        </div>

        <button
          onClick={resetArena}
          className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors focus:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
