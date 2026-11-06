# TypeForge — Code & Syntax Typing Practice Application

A distraction-free, cross-platform typing practice and speed training application tailored for developers, students, and touch typists, featuring code syntax challenges, warm-up drills, structured non-code lessons, customizable difficulty levels, real-time WPM/accuracy telemetry, Web Audio mechanical switch soundscapes, and comprehensive historical analytics with offline PWA support.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences have been incorporated into the project blueprint:

- **Expanded Content Spectrum (Code + Warmup + Non-Code Lessons)**:
  1. **Code Syntax Practice**: 8+ programming languages (JavaScript, TypeScript, Python, Rust, Go, HTML/CSS, SQL, C++) across Junior, Mid, and Senior difficulty tiers.
  2. **Warmup Drills Mode**: Quick finger-activation exercises including Home Row stretches, common n-grams/digraphs (`th`, `er`, `on`, `re`, `in`, `st`), symbol row runs, and number-pad rhythm training.
  3. **Non-Code Lessons & Snippets**: Structured typing lessons (Beginner Home Row to Advanced Punctuation), Tech Literature & Historical Essays (Turing, Lovelace, Knuth, RFCs), Famous Literary & Philosophy Quotes, and English 200/1000 speed bursts.
  4. **Custom Mode**: Paste any custom snippet, interview prompt, or reading passage to practice immediately.
- **Visual Aesthetic & Theming**: **Multi-theme switcher** featuring:
  1. *Dark Minimal* (deep slate `#0d1117`, cool white/gray typography, crisp teal caret)
  2. *Cyberpunk* (obsidian `#090a10`, neon lime `#22c55e` and electric cyan `#06b6d4` highlights)
  3. *Paper Light* (editorial warm travertine `#f8fafc`, crisp slate `#0f172a`, deep blue accents)
- **Audio Feedback**: **Mechanical keyboard audio soundscape** using the Web Audio API with realistic switch acoustic profiles (Blue clicky, Brown tactile, Red linear) and an instant one-click mute/volume control.
- **Cross-Platform & Offline**: Full PWA support (Web App Manifest, standalone mobile/desktop install prompts, offline caching, and responsive layouts).

---

### 1. Overview & Core Concept

- **What It Does**: TypeForge combines the best of code syntax training (developer ergonomics, brackets, indentations, operators) with classic touch-typing fundamentals (warmup finger gym, structured lessons, and rich prose/quote modes).
- **Target Audience / Persona**: Programmers, CS students, tech writers, and keyboard enthusiasts seeking both developer-specific muscle memory and foundational typing endurance.
- **Key Value**: One unified application for daily finger warmups, guided progression lessons, real code syntax mastery, and high-speed prose tests, backed by deep telemetry, error heatmap analysis, and zero-distraction design.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Quick Practice Launch**: Instantly type upon page load. Mode selectors (Warmup, Code, Lessons, Prose, Custom) allow effortless 1-click category switching.
  2. **Warmup Arena**: Rapid 30-second drills designed to wake up fingers before long sessions (e.g. `fj dk sl a;` home-row agility, `th-er-in-ed-re` n-gram rhythm, bracket pairs `{[( )]}`).
  3. **Structured Lesson Path**: Interactive progressive curriculum (1. Home Row Basics $\rightarrow$ 2. Top Row & Vowels $\rightarrow$ 3. Bottom Row $\rightarrow$ 4. Shift & Numbers $\rightarrow$ 5. Developer Symbols).
  4. **Live Visual & Audio Feedback**: Smooth gliding cursor, character-level verification (correct, typo, pending), realtime pace indicator, and physical mechanical switch acoustic clicks.
  5. **Post-Session Telemetry**: Net WPM, Raw WPM, Accuracy %, Consistency rating, detailed mistake keys distribution, and time-series pace curve.
  6. **Historical Analytics**: Long-term records, average speeds by category, personal bests, daily streak counter, and downloadable session history.

- **Visual Identity & Theme**:
  - *Anti-Slop Restraint*: Unboxed metadata with typographic separators (`·`), strict one-row top bar contract, zero decorative pulsing dots or fake scorecards, single-elevation surfaces, and tabular monospace numerals.
  - *Color Palette Tokens*:
    - **Dark Minimal (Default)**: Canvas `#0B0F17`, Surface `#111827`, Hairline `#1F2937`, Accent `#38BDF8`, Correct `#4ADE80`, Error `#F87171`.
    - **Cyberpunk**: Canvas `#08090E`, Surface `#0F121C`, Hairline `#1E2438`, Accent `#F43F5E` & `#06B6D4`, Correct `#22C55E`, Error `#EF4444`.
    - **Paper Light**: Canvas `#F8FAFC`, Surface `#FFFFFF`, Hairline `#E2E8F0`, Accent `#2563EB`, Correct `#15803D`, Error `#DC2626`.
  - *Typography*: Clean display headers, legible body sans, and high-clarity monospace with tabular numerals for the typing surface.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Unified Multi-Category Engine (Code, Warmups, Lessons, Quotes)**
  - *Chosen Approach*: Build a modular content generator with dedicated collections for Warmup drills, Structured Lessons, Multi-language Code, Literature/Quotes, and Custom imports.
  - *Why*: Gives users a complete training ecosystem in one app—warm up for 2 minutes, run a 5-minute code drill, test top-speed on prose, and review progress.
  - *Alternatives Considered*: Restricting only to raw code files, which leaves out touch-typing beginners and pre-session finger loosening.

- **Decision 2: Zero-Lag Web Audio Keystroke Synthesis**
  - *Chosen Approach*: Synthesize mechanical switch clicks in real time with Web Audio API nodes (oscillators + noise bursts + bandpass filters).
  - *Why*: Ultra-fast response (<5ms latency), works 100% offline, zero external audio asset download issues, and offers multiple switch sound profiles (Blue, Brown, Red).

- **Decision 3: Offline-First Local Storage with Export/Import**
  - *Chosen Approach*: Persist all session stats, user achievements, bests, and preferences in `localStorage` with JSON export/import.
  - *Why*: Instant speed, no login wall required, privacy-respecting, and completely functional offline in PWA standalone mode.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TypeForge App                             │
├────────────────────────────────┬───────────────────────────────────────┤
│ Top Bar Contract               │  Brand ("TypeForge")                  │
│                                │  Mode Nav: [ Practice · Stats · Info ]│
│                                │  Actions: [ Sound · Theme · Install ] │
├────────────────────────────────┴───────────────────────────────────────┤
│ Category & Difficulty Selector Toolbar                                 │
│ [ Warmup | Code | Lessons | Prose/Quotes | Custom ]                    │
│ [ Sub-selector: Language / Drill Type / Lesson Level / Timer Mode ]    │
├────────────────────────────────────────────────────────────────────────┤
│ Active Viewport                                                        │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Typing Arena Engine                                                │ │
│ │ - Real-Time Telemetry: Live WPM, Accuracy, Progress, Timer         │ │
│ │ - Dynamic Monospace Code & Text Surface with Smooth Caret          │ │
│ │ - Virtual Keyboard / Finger Guide (Toggleable for Warmup/Lessons)  │ │
│ │ - Web Audio Mechanical Sound Engine (Blue / Brown / Red / Mute)    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Detailed Statistics & History Modal / View                         │ │
│ │ - WPM / Accuracy Trajectory Chart & Consistency Score              │ │
│ │ - Problem Key Matrix (slowest & error-prone characters)            │ │
│ │ - Complete History Log with Category Filtering                     │ │
│ │ - Export / Import / Reset Local Data Controls                      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ PWA & Responsive Layer: Service Worker + Web App Manifest + Install UI │
└────────────────────────────────────────────────────────────────────────┘
```

#### Key State Entities:
- `Category`: `'code' | 'warmup' | 'lesson' | 'prose' | 'custom'`
- `ContentSnippet`: Title, category, language/tag, difficulty, text, author/description.
- `TypingState`: Buffer, currentIndex, errorCount, mistakeMap, startTime, elapsedTime, liveWpm, liveAccuracy.
- `SessionRecord`: ID, timestamp, category, title, difficulty, duration, wpm, rawWpm, accuracy, consistency, mistakes.
- `SettingsState`: Theme (`dark`, `cyberpunk`, `paper`), switchType (`clicky`, `tactile`, `linear`, `mute`), volume, showKeyboardGuide, liveWpmDisplay.
