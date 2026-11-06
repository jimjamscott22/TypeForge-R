import { Snippet } from '../types';

export const SNIPPETS: Snippet[] = [
  // ==========================================
  // 1. DEVELOPER CODE: TYPESCRIPT / JAVASCRIPT
  // ==========================================
  {
    id: 'ts-junior-1',
    title: 'Array Filter & Map',
    category: 'code',
    subCategory: 'TypeScript',
    language: 'typescript',
    difficulty: 'junior',
    description: 'Transforming and filtering a list of user objects',
    text: `const activeUsers = users
  .filter((user) => user.isActive && user.age >= 18)
  .map((user) => ({ id: user.id, name: user.name.trim() }));`
  },
  {
    id: 'ts-junior-2',
    title: 'Async Fetch Function',
    category: 'code',
    subCategory: 'TypeScript',
    language: 'typescript',
    difficulty: 'junior',
    description: 'Basic async/await data fetching with try/catch',
    text: `async function fetchUserData(userId: string) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) throw new Error("User not found");
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  }
}`
  },
  {
    id: 'ts-mid-1',
    title: 'Custom React Debounce Hook',
    category: 'code',
    subCategory: 'TypeScript',
    language: 'typescript',
    difficulty: 'mid',
    description: 'Generic debounce hook with cleanup timer',
    text: `function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}`
  },
  {
    id: 'ts-mid-2',
    title: 'Promise Concurrency Pool',
    category: 'code',
    subCategory: 'TypeScript',
    language: 'typescript',
    difficulty: 'mid',
    description: 'Execute async operations with limited concurrency',
    text: `export async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing = new Set<Promise<void>>();

  for (let i = 0; i < items.length; i++) {
    const p = Promise.resolve().then(() => fn(items[i], i)).then((res) => {
      results[i] = res;
    });
    executing.add(p);
    p.finally(() => executing.delete(p));
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}`
  },
  {
    id: 'ts-senior-1',
    title: 'Deep Readonly & Nested Keys Type',
    category: 'code',
    subCategory: 'TypeScript',
    language: 'typescript',
    difficulty: 'senior',
    description: 'Recursive conditional types, mapped types and template literals',
    text: `type DeepReadonly<T> = T extends Function | boolean | number | string
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };

type PathKeys<T> = T extends object
  ? { [K in keyof T & string]: \`\${K}\` | \`\${K}.\${PathKeys<T[K]>}\` }[keyof T & string]
  : never;`
  },

  // ==========================================
  // 2. DEVELOPER CODE: PYTHON
  // ==========================================
  {
    id: 'py-junior-1',
    title: 'List Comprehensions & Dictionaries',
    category: 'code',
    subCategory: 'Python',
    language: 'python',
    difficulty: 'junior',
    description: 'Transform numbers and create structured lookup dictionaries',
    text: `def square_evens(numbers: list[int]) -> dict[int, int]:
    return {n: n ** 2 for n in numbers if n % 2 == 0 and n > 0}`
  },
  {
    id: 'py-mid-1',
    title: 'Memoization Decorator',
    category: 'code',
    subCategory: 'Python',
    language: 'python',
    difficulty: 'mid',
    description: 'Functional decorator with cache and args packing',
    text: `from functools import wraps

def memoize(fn):
    cache = {}
    @wraps(fn)
    def wrapper(*args, **kwargs):
        key = (args, frozenset(kwargs.items()))
        if key not in cache:
            cache[key] = fn(*args, **kwargs)
        return cache[key]
    return wrapper`
  },
  {
    id: 'py-senior-1',
    title: 'Async Generator & Context Manager',
    category: 'code',
    subCategory: 'Python',
    language: 'python',
    difficulty: 'senior',
    description: 'Context manager handling database transactions and stream generation',
    text: `from contextlib import asynccontextmanager

@asynccontextmanager
async def transaction_scope(session_factory):
    session = await session_factory()
    try:
        yield session
        await session.commit()
    except Exception as exc:
        await session.rollback()
        raise exc
    finally:
        await session.close()`
  },

  // ==========================================
  // 3. DEVELOPER CODE: RUST
  // ==========================================
  {
    id: 'rust-junior-1',
    title: 'Option Matching & Enums',
    category: 'code',
    subCategory: 'Rust',
    language: 'rust',
    difficulty: 'junior',
    description: 'Idiomatic pattern matching on Option and vector iteration',
    text: `fn find_first_positive(values: &[i32]) -> Option<i32> {
    values.iter().copied().find(|&x| x > 0)
}`
  },
  {
    id: 'rust-mid-1',
    title: 'Error Handling with Result',
    category: 'code',
    subCategory: 'Rust',
    language: 'rust',
    difficulty: 'mid',
    description: 'Custom error enum and question mark operator propagation',
    text: `#[derive(Debug)]
pub enum ConfigError {
    MissingKey(String),
    ParseFailure(std::num::ParseIntError),
}

pub fn parse_port(raw: Option<&str>) -> Result<u16, ConfigError> {
    let s = raw.ok_or_else(|| ConfigError::MissingKey("PORT".into()))?;
    s.parse::<u16>().map_err(ConfigError::ParseFailure)
}`
  },
  {
    id: 'rust-senior-1',
    title: 'Thread-Safe Arc Mutex Buffer',
    category: 'code',
    subCategory: 'Rust',
    language: 'rust',
    difficulty: 'senior',
    description: 'Concurrent memory sharing with lifetimes and trait bounds',
    text: `use std::sync::{Arc, Mutex};
use std::thread;

pub struct SharedQueue<T: Send + 'static> {
    inner: Arc<Mutex<Vec<T>>>,
}

impl<T: Send + 'static> SharedQueue<T> {
    pub fn push(&self, item: T) {
        let mut lock = self.inner.lock().unwrap();
        lock.push(item);
    }
}`
  },

  // ==========================================
  // 4. DEVELOPER CODE: GO
  // ==========================================
  {
    id: 'go-junior-1',
    title: 'Structs & Methods',
    category: 'code',
    subCategory: 'Go',
    language: 'go',
    difficulty: 'junior',
    description: 'Defining struct types and pointer receivers',
    text: `type Account struct {
\tOwner   string
\tBalance float64
}

func (a *Account) Deposit(amount float64) bool {
\tif amount <= 0 {
\t\treturn false
\t}
\ta.Balance += amount
\treturn true
}`
  },
  {
    id: 'go-mid-1',
    title: 'Goroutines & Channels',
    category: 'code',
    subCategory: 'Go',
    language: 'go',
    difficulty: 'mid',
    description: 'Worker pool processing jobs across buffered channels',
    text: `func worker(id int, jobs <-chan int, results chan<- int) {
\tfor j := range jobs {
\t\ttime.Sleep(time.Millisecond * 50)
\t\tresults <- j * 2
\t}
}

func RunPool(count int) {
\tjobs := make(chan int, 100)
\tresults := make(chan int, 100)
\tfor w := 1; w <= 3; w++ {
\t\tgo worker(w, jobs, results)
\t}
}`
  },

  // ==========================================
  // 5. DEVELOPER CODE: SQL
  // ==========================================
  {
    id: 'sql-mid-1',
    title: 'Window Functions & Aggregation',
    category: 'code',
    subCategory: 'SQL',
    language: 'sql',
    difficulty: 'mid',
    description: 'Calculate running total and row ranking across partitions',
    text: `WITH RankedOrders AS (
  SELECT
    customer_id,
    order_id,
    total_amount,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) AS order_rank,
    SUM(total_amount) OVER (PARTITION BY customer_id) AS lifetime_value
  FROM orders
  WHERE status = 'completed'
)
SELECT * FROM RankedOrders WHERE order_rank <= 3;`
  },

  // ==========================================
  // 6. DEVELOPER CODE: C++
  // ==========================================
  {
    id: 'cpp-mid-1',
    title: 'Smart Pointers & Lambda Algorithms',
    category: 'code',
    subCategory: 'C++',
    language: 'cpp',
    difficulty: 'mid',
    description: 'Modern C++ unique pointers, templates, and STL transform',
    text: `template <typename T>
std::vector<T> filter_and_scale(const std::vector<T>& data, T threshold, T scale) {
    std::vector<T> results;
    std::copy_if(data.begin(), data.end(), std::back_inserter(results), [threshold](const T& val) {
        return val >= threshold;
    });
    std::transform(results.begin(), results.end(), results.begin(), [scale](T val) {
        return val * scale;
    });
    return results;
}`
  },

  // ==========================================
  // 7. WARMUP MODE (FINGER AGILITY & DRILLS)
  // ==========================================
  {
    id: 'warmup-home-row',
    title: 'Home Row Agility',
    category: 'warmup',
    subCategory: 'Home Row',
    difficulty: 'junior',
    description: 'Activate your index and resting fingers on ASDF JKL;',
    text: 'asdf jkl; asdf jkl; fdsa ;lkj fjdk sla; jfkd lsa; aass ddff jjkk ll;; flash salad flask falls'
  },
  {
    id: 'warmup-ngrams',
    title: 'High-Frequency N-Grams',
    category: 'warmup',
    subCategory: 'Digraphs',
    difficulty: 'junior',
    description: 'Train common English letter pairings for flow and momentum',
    text: 'the and tha ent ion tio for nde has nce edt tis oft sth men there stand point enter condition'
  },
  {
    id: 'warmup-brackets-1',
    title: 'Developer Brackets & Delimiters',
    category: 'warmup',
    subCategory: 'Code Symbols',
    difficulty: 'mid',
    description: 'Wake up finger muscle memory for brackets, parens, and braces',
    text: '{ [ ( ) ] } { [ ( ) ] } (a + b) * [c - d] {key: [1, 2, 3]} () => {} [item] {id, value}'
  },
  {
    id: 'warmup-symbols-senior',
    title: 'Syntax Operators & Punctuation',
    category: 'warmup',
    subCategory: 'Operators',
    difficulty: 'senior',
    description: 'Extreme symbols: arrows, strict equality, ternary, and nullish coalescing',
    text: '=== !== <= >= => -> :: && || ?? !! ~= += -= *= /= const x: string | number = y ?? "fallback";'
  },
  {
    id: 'warmup-numbers',
    title: 'Number Row & Arithmetic',
    category: 'warmup',
    subCategory: 'Numbers',
    difficulty: 'mid',
    description: 'Stretch the top row without looking at the keyboard',
    text: '12345 67890 1024 2048 4096 8192 100% $250.00 3.14159 42 0x7FFF #FF00FF 1984 2026'
  },

  // ==========================================
  // 8. DEFAULT / COMMON WORDS MODE
  // ==========================================
  {
    id: 'words-top-100',
    title: 'Top 100 Fast Words',
    category: 'words',
    subCategory: 'Core 100',
    difficulty: 'junior',
    description: 'Pure speed burst testing fundamental rhythm and hand balance',
    text: 'the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us'
  },
  {
    id: 'words-tech-vocabulary',
    title: 'Software Developer Vocabulary',
    category: 'words',
    subCategory: 'Dev Words',
    difficulty: 'mid',
    description: 'Common developer keywords, tools, and terminology',
    text: 'deploy commit branch merge repository refactor compile runtime interface component pipeline container cluster latency bandwidth database query index schema protocol proxy gateway cache thread process mutex socket server client framework library package module syntax token parser'
  },

  // ==========================================
  // 9. STRUCTURED LESSONS (BEGINNER TO PRO)
  // ==========================================
  {
    id: 'lesson-1-homerow',
    title: 'Lesson 1: The Home Row Keys',
    category: 'lessons',
    subCategory: 'Fundamentals',
    difficulty: 'junior',
    description: 'Master resting posture: Left hand A-S-D-F, Right hand J-K-L-;',
    text: 'aaa sss ddd fff jjj kkk lll ;;; as df jk l; fdsa ;lkj dad fad lad fall flask alas salad alfalfa'
  },
  {
    id: 'lesson-2-toprow',
    title: 'Lesson 2: Top Row & Key Vowels',
    category: 'lessons',
    subCategory: 'Top Row',
    difficulty: 'junior',
    description: 'Reach up to Q, W, E, R, T and Y, U, I, O, P smoothly',
    text: 'rewq poiuy tree wire port type write quiet output equip report wire power route utility'
  },
  {
    id: 'lesson-3-bottomrow',
    title: 'Lesson 3: Bottom Row Shift',
    category: 'lessons',
    subCategory: 'Bottom Row',
    difficulty: 'mid',
    description: 'Curling down to Z, X, C, V, B and N, M, comma, period',
    text: 'zxcv bnm,. zoom civic mixer carbon valid brave matrix nexus calm balance volume dynamic'
  },
  {
    id: 'lesson-4-punctuation',
    title: 'Lesson 4: Capitalization & Punctuation',
    category: 'lessons',
    subCategory: 'Punctuation',
    difficulty: 'mid',
    description: 'Shift key synchronization and quotation discipline',
    text: 'Hello, World! Did you check the "main" branch? Always test twice, commit once; speed follows accuracy.'
  },
  {
    id: 'lesson-5-code-symbols',
    title: 'Lesson 5: Essential Code Symbols',
    category: 'lessons',
    subCategory: 'Symbols',
    difficulty: 'senior',
    description: 'Crucial braces, brackets, and logical operators for programmers',
    text: 'function sum(arr: number[]): number { return arr.reduce((acc, curr) => acc + curr, 0); }'
  },

  // ==========================================
  // 10. NON-CODE PROSE, LITERATURE & QUOTES
  // ==========================================
  {
    id: 'prose-turing',
    title: 'Alan Turing — Can Machines Think?',
    category: 'prose',
    subCategory: 'History of Computing',
    difficulty: 'mid',
    description: 'Excerpt from Computing Machinery and Intelligence (1950)',
    text: 'I propose to consider the question, "Can machines think?" This should begin with definitions of the meaning of the terms "machine" and "think". We may hope that machines will eventually compete with men in all purely intellectual fields.'
  },
  {
    id: 'prose-lovelace',
    title: 'Ada Lovelace — Analytical Engine',
    category: 'prose',
    subCategory: 'History of Computing',
    difficulty: 'mid',
    description: 'Notes on Charles Babbage\'s Analytical Engine (1843)',
    text: 'The Analytical Engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves. In enabling mechanism to combine together general symbols, a uniting link is established between the operations of matter and abstract mental processes.'
  },
  {
    id: 'prose-unix',
    title: 'The Unix Philosophy',
    category: 'prose',
    subCategory: 'Architecture & Design',
    difficulty: 'junior',
    description: 'Foundational tenets formulated by Doug McIlroy and Ken Thompson',
    text: 'Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface.'
  },
  {
    id: 'prose-knuth',
    title: 'Donald Knuth — On Optimization',
    category: 'prose',
    subCategory: 'Software Engineering',
    difficulty: 'junior',
    description: 'Structured Programming with Go To Statements (1974)',
    text: 'Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs. Premature optimization is the root of all evil in programming.'
  }
];
