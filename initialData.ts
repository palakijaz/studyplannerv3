import { Subject, Task, StudyPlan, FlashcardDeck, Note, StudySessionLog, UserStats } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-1',
    name: 'Computer Science & Algorithms',
    code: 'CS301',
    color: 'bg-indigo-600',
    targetHoursWeek: 10,
  },
  {
    id: 'subj-2',
    name: 'Organic Chemistry II',
    code: 'CHEM202',
    color: 'bg-emerald-600',
    targetHoursWeek: 8,
  },
  {
    id: 'subj-3',
    name: 'Calculus & Linear Algebra',
    code: 'MATH210',
    color: 'bg-amber-600',
    targetHoursWeek: 6,
  },
  {
    id: 'subj-4',
    name: 'World History & Civilizations',
    code: 'HIST105',
    color: 'bg-rose-600',
    targetHoursWeek: 5,
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review Binary Search Trees & Heap Sort Operations',
    subjectId: 'subj-1',
    dueDate: '2026-07-25',
    estimatedMinutes: 60,
    priority: 'high',
    status: 'todo',
    notes: 'Focus on min-heap insertion time complexity O(log N)',
    isAiGenerated: true,
  },
  {
    id: 'task-2',
    title: 'Solve Practice Problems on Reaction Mechanisms (E1 vs E2)',
    subjectId: 'subj-2',
    dueDate: '2026-07-24',
    estimatedMinutes: 45,
    priority: 'high',
    status: 'in_progress',
    notes: 'Pay attention to carbocation stability and solvent effects',
  },
  {
    id: 'task-3',
    title: 'Complete Vector Spaces & Matrix Eigenvalues Problem Set',
    subjectId: 'subj-3',
    dueDate: '2026-07-26',
    estimatedMinutes: 90,
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'task-4',
    title: 'Read Chapter 8: Industrial Revolution & Global Trade Systems',
    subjectId: 'subj-4',
    dueDate: '2026-07-27',
    estimatedMinutes: 40,
    priority: 'low',
    status: 'completed',
  },
  {
    id: 'task-5',
    title: 'Flashcard Drill: Organic Chemistry Key Reactions',
    subjectId: 'subj-2',
    dueDate: '2026-07-23',
    estimatedMinutes: 25,
    priority: 'high',
    status: 'in_progress',
    isAiGenerated: true,
  },
];

export const INITIAL_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'plan-1',
    title: 'CS301 Midterm Masterclass Plan',
    subjectId: 'subj-1',
    examDate: '2026-07-30',
    overview: 'Comprehensive 5-day mastery plan focusing on Data Structures, Time Complexity, Graph Algorithms, and Dynamic Programming.',
    createdAt: new Date().toISOString(),
    studyTips: [
      'Draw recursion trees on paper before writing code.',
      'Test edge cases: empty lists, single node, cycles.',
      'Take 5-minute Pomodoro breaks every 25 minutes to maintain focus.'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrays, Hash Tables & Two Pointers',
        objectives: ['Master O(1) hash map lookups', 'Implement Sliding Window pattern', 'Solve 3 LeetCode style problems'],
        sessions: [
          {
            id: 's-1-1',
            topic: 'Two Pointer Technique & Memory Management',
            durationMinutes: 45,
            activityType: 'reading',
            description: 'Read chapter notes on in-place array manipulation',
            completed: true,
          },
          {
            id: 's-1-2',
            topic: 'Hash Collisions & Chaining vs Open Addressing',
            durationMinutes: 30,
            activityType: 'practice',
            description: 'Solve 3 practice questions on collision resolution',
            completed: true,
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Binary Trees, BSTs & Heaps',
        objectives: ['In-order, Pre-order, Post-order Traversals', 'Balanced BST rotations', 'Build Max-Heap from array in O(N) time'],
        sessions: [
          {
            id: 's-2-1',
            topic: 'Tree Traversal Recursion vs Iterative Stacks',
            durationMinutes: 50,
            activityType: 'reading',
            description: 'Study iterative stack approach for BST traversal',
            completed: false,
          },
          {
            id: 's-2-2',
            topic: 'Flashcard Drill: Heap Operations',
            durationMinutes: 25,
            activityType: 'quiz',
            description: 'Run through 15 flashcards on heapify and priority queues',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Graph Theory & Shortest Path Algorithms',
        objectives: ['Dijkstra vs Bellman-Ford algorithms', 'BFS vs DFS traversal properties', 'Topological Sort for DAGs'],
        sessions: [
          {
            id: 's-3-1',
            topic: 'Graph Representation: Adjacency Matrix vs List',
            durationMinutes: 40,
            activityType: 'reading',
            description: 'Review space and time tradeoffs for dense vs sparse graphs',
            completed: false,
          },
          {
            id: 's-3-2',
            topic: 'Dijkstra Implementation & Priority Queue Optimization',
            durationMinutes: 60,
            activityType: 'practice',
            description: 'Trace algorithm steps on sample weighted graph',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Dynamic Programming Fundamentals',
        objectives: ['Identify Overlapping Subproblems & Optimal Substructure', 'Memoization (Top-down) vs Tabulation (Bottom-up)', '0/1 Knapsack Problem'],
        sessions: [
          {
            id: 's-4-1',
            topic: 'Fibonacci & Climbing Stairs DP State Transitions',
            durationMinutes: 45,
            activityType: 'practice',
            description: 'Write recurrence relations and base cases',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 5,
        title: 'Comprehensive Review & Practice Exam',
        objectives: ['Timed practice exam', 'Review weakest topics', 'Final flashcard blitz'],
        sessions: [
          {
            id: 's-5-1',
            topic: 'Timed Mock Test - 10 Questions',
            durationMinutes: 60,
            activityType: 'quiz',
            description: 'Simulate midterm testing environment',
            completed: false,
          }
        ]
      }
    ]
  }
];

export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'Data Structures & Big-O Complexity',
    subjectId: 'subj-1',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'c1',
        front: 'What is the average and worst-case time complexity of QuickSort?',
        back: 'Average case: O(N log N). Worst case: O(N^2) when pivot selection is poor (e.g. sorted array with first element pivot).',
        category: 'Algorithms',
        mastered: true,
      },
      {
        id: 'c2',
        front: 'What is the main difference between BFS and DFS?',
        back: 'BFS (Breadth-First Search) explores nodes level-by-level using a Queue (FIFO). DFS (Depth-First Search) explores as deep as possible before backtracking using a Stack or Recursion (LIFO).',
        category: 'Graph Search',
        mastered: false,
      },
      {
        id: 'c3',
        front: 'Why is searching in a Hash Table O(1) average time?',
        back: 'A hash function computes an array index directly from the key in O(1) time. Assuming good distribution with minimal collisions, access is instantaneous.',
        category: 'Data Structures',
        mastered: true,
      },
      {
        id: 'c4',
        front: 'What is a Balanced Binary Search Tree (e.g., AVL / Red-Black)?',
        back: 'A BST where the height difference between left and right subtrees is constrained (e.g., <= 1 for AVL), guaranteeing search, insertion, and deletion in O(log N) time.',
        category: 'Trees',
        mastered: false,
      }
    ]
  },
  {
    id: 'deck-2',
    title: 'Organic Reaction Mechanisms (SN1, SN2, E1, E2)',
    subjectId: 'subj-2',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'c2-1',
        front: 'What are the characteristics of an SN2 reaction mechanism?',
        back: 'Bimolecular nucleophilic substitution. One-step concerted mechanism with inversion of stereochemistry (Walden inversion). Favored by strong nucleophiles and polar aprotic solvents.',
        category: 'Substitution',
        mastered: false,
      },
      {
        id: 'c2-2',
        front: 'What solvent type favors SN1 / E1 reactions and why?',
        back: 'Polar protic solvents (like H2O, methanol, ethanol) because they stabilize the carbocation intermediate through dipole-dipole hydrogen bonding.',
        category: 'Solvents',
        mastered: true,
      },
      {
        id: 'c2-3',
        front: 'What is Zaitsev’s Rule in Elimination reactions?',
        back: 'In elimination reactions (E1/E2), the major alkene product is the most substituted, most thermodynamically stable alkene.',
        category: 'Elimination',
        mastered: false,
      }
    ]
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Dynamic Programming: Memoization vs Tabulation',
    subjectId: 'subj-1',
    content: `# Dynamic Programming Essentials

Dynamic Programming (DP) is an algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems and storing the results to avoid duplicate computation.

## Core Properties
1. **Overlapping Subproblems**: The same subproblems are solved repeatedly.
2. **Optimal Substructure**: The optimal solution to the problem contains optimal solutions to subproblems.

## Approaches
- **Memoization (Top-Down)**: Start from original problem, recursively solve subproblems, and cache results in a dictionary or lookup table.
- **Tabulation (Bottom-Up)**: Solve smallest subproblems first, fill an iterative DP table from base cases up to target index.

## Example: Fibonacci Sequence
- Naive Recursion: O(2^N) time, O(N) space.
- DP with Memoization: O(N) time, O(N) stack & cache space.
- Tabulation Space-Optimized: O(N) time, O(1) space keeping only previous two variables.`,
    summary: 'Dynamic Programming optimizes recursive algorithms by caching overlapping subproblem results. Top-down memoization uses recursion + hash/map lookup, while bottom-up tabulation fills a table iteratively from base cases.',
    keyTakeaways: [
      'Look for overlapping subproblems and optimal substructure before using DP.',
      'Top-down memoization is often easier to write recursively.',
      'Bottom-up tabulation avoids stack overflow risk and can often be space-optimized to O(1).'
    ],
    keyTerms: [
      { term: 'Memoization', definition: 'Top-down caching strategy storing function return values based on input arguments.' },
      { term: 'Tabulation', definition: 'Bottom-up iterative approach filling an array table starting from base cases.' },
      { term: 'Optimal Substructure', definition: 'A property where optimal solutions to subproblems lead directly to the global optimal solution.' }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-2',
    title: 'Stereochemistry & Reaction Rates',
    subjectId: 'subj-2',
    content: `# Organic Chemistry Reactions Summary

SN1 reactions proceed via a carbocation intermediate, leading to racemization (50% retention, 50% inversion). 
SN2 reactions involve backside attack by a strong nucleophile, causing 100% inversion of stereochemistry.

Steric hindrance significantly slows SN2 reactions (Tertiary substrates will NOT undergo SN2).`,
    summary: 'SN1 forms a flat carbocation intermediate yielding racemic mixture. SN2 proceeds via concerted backside attack causing stereochemical inversion.',
    keyTakeaways: [
      'Tertiary halides undergo SN1 or E1, never SN2.',
      'Aprotic solvents boost nucleophile reactivity for SN2.'
    ],
    keyTerms: [
      { term: 'Racemization', definition: 'Formation of an optically inactive 1:1 mixture of enantiomers.' },
      { term: 'Backside Attack', definition: 'Nucleophile attacks substrate from the opposite side of the leaving group in SN2.' }
    ],
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_STUDY_SESSIONS: StudySessionLog[] = [
  { id: 'sess-1', subjectId: 'subj-1', durationMinutes: 50, date: '2026-07-23', type: 'pomodoro', notes: 'Completed tree traversals' },
  { id: 'sess-2', subjectId: 'subj-2', durationMinutes: 45, date: '2026-07-23', type: 'pomodoro', notes: 'Reviewed SN1 vs SN2 flashcards' },
  { id: 'sess-3', subjectId: 'subj-3', durationMinutes: 30, date: '2026-07-22', type: 'custom', notes: 'Calculus derivatives refresher' },
  { id: 'sess-4', subjectId: 'subj-1', durationMinutes: 60, date: '2026-07-21', type: 'pomodoro', notes: 'Hash map implementation practice' },
  { id: 'sess-5', subjectId: 'subj-4', durationMinutes: 40, date: '2026-07-20', type: 'custom', notes: 'Read world history notes' },
];

export const INITIAL_USER_STATS: UserStats = {
  streakDays: 4,
  totalStudyMinutes: 385,
  todayStudyMinutes: 95,
  completedTasksCount: 12,
  quizzesTaken: 5,
};
