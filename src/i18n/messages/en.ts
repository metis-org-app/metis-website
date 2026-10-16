import type { Expression } from '../../components/avatar/expressions';
import type { Intent, ItemType, Level, SessionId, TopicId } from '../../content/demo-data';
import type { HelpMode, Kind, Preset } from '../../features/guide/types';

type ModeCopy = { label: string; desc: string; short: string; tag: string };
type Reply = string | ((at: string) => string);
/** One turn of a saved conversation; Metis turns carry the rule tag they were sent with. */
type Turn = { from: 'student' | 'metis'; text: string; tag?: string };

/**
 * English copy (base language). Leaves are plain strings or functions for interpolation — never HTML.
 * Rich text (accents, line breaks) is composed in JSX.
 * `es.ts` is typed as `Messages`, so a missing or extra key fails to compile.
 */
export const en = {
  meta: {
    title: 'Metis — From class material to learning data',
    description:
      'Metis generates assessments from your files with AI, shares them through a link and returns results by item, student and topic, with an AI guide that helps without solving.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main',
    legalNav: 'Legal',
    language: 'Language',
    home: 'Metis, home',
    langNames: { es: 'Español', en: 'English' },
  },
  header: {
    tagline: 'AI assessments · for instructors and students',
    login: 'Log in',
    cta: 'Create assessment →',
    nav: {
      guide: 'AI guide',
      configure: 'Configure',
      results: 'Results',
      insights: 'Insights',
      spec: 'Spec',
    },
  },
  hero: {
    meta: ['01 — Platform', 'Create · Share · Understand', 'Works with Canvas LMS'],
    titleLead: 'From class material',
    titleTail: 'to learning data',
    lead: 'Metis generates assessments from your files with AI, shares them through a link, and returns results by item, student, and topic. Inside the student link, it guides without solving for them.',
    primaryCta: 'Create a free assessment →',
    secondaryCta: 'Talk to Metis ↓',
    pipeline: [
      { key: 'A', title: 'File', note: 'PDF · DOCX · PPTX' },
      { key: 'B', title: 'Items', note: 'Suggested by AI' },
      { key: 'C', title: 'Link + Metis', note: 'Hints, never answers' },
      { key: 'D', title: 'Results', note: 'By item and student' },
    ],
    pipelineLabel: 'From file to results in four steps',
    card: {
      groupLabel: 'Metis, the AI guide',
      header: 'Metis',
      online: 'Online',
      name: 'Metis',
      inEveryLink: 'In every student link',
      pause: 'Pause the Metis carousel',
      play: 'Play the Metis carousel',
      aria: (expression: string) => `Metis, the AI guide, ${expression}`,
    },
    expressions: {
      happy: { label: 'Happy', line: 'I give hints, never answers.' },
      listening: { label: 'Listening', line: 'Ask me anything about this item.' },
      thinking: { label: 'Thinking', line: 'Let me find a hint that fits your rules.' },
      reviewing: { label: 'Reviewing', line: 'Checking the work against your rubric.' },
      guiding: { label: 'Guiding', line: 'Try comparing both columns first.' },
      celebrating: { label: 'Celebrating', line: 'You got there yourself. Nice work.' },
    } as Record<Expression, { label: string; line: string }>,
  },
  ticker: [
    'Quiz 02 · Supply and demand — 26 of 28 submitted',
    'Metis gave 11 hints · 0 answers revealed',
    'Item 05 flagged for review',
    'Lesson_06.pdf → 12 items suggested',
    'Average accuracy 74%',
    '17 conversations saved · most asked: consumer surplus',
  ],
  guide: {
    kicker: '02 — AI guide',
    title: 'Explicit rules. Predictable behavior.',
    lead: 'Metis lives inside the student link. Change a rule on the left and the conversation on the right follows it, reply by reply. Type your own question, or watch the demo.',
    presence: {
      live: 'Metis · live',
      headline: {
        listening: 'Listening for a question',
        thinking: 'Thinking about a hint…',
        guiding: 'Writing a hint…',
        reviewing: 'Holding back the answer',
        off: 'Off for this assessment',
      },
      maxHints: (n: number) => `max ${n} hints`,
      cites: 'cites source',
      noCites: 'no citations',
    },
    rules: {
      heading: 'Instructor rules · Quiz 02',
      locked: 'Never reveal the answer',
      alwaysOn: 'Always on',
      helpStyle: 'Help style',
      modes: {
        socratic: {
          label: 'Socratic questions',
          desc: 'Replies with questions that lead to the reasoning',
          short: 'Socratic',
          tag: 'SOCRATIC',
        },
        hints: {
          label: 'Direct hints',
          desc: 'Points to the next step without solving it',
          short: 'Direct hints',
          tag: 'DIRECT HINT',
        },
        example: {
          label: 'Worked example',
          desc: 'Solves a similar case so the method can be copied',
          short: 'Worked example',
          tag: 'WORKED EXAMPLE',
        },
      } as Record<HelpMode, ModeCopy>,
      maxHints: 'Max hints per item',
      cite: 'Cite the course material',
      applies: 'Changes apply to the next reply',
    },
    chat: {
      name: 'Metis',
      role: 'AI guide',
      status: { idle: 'Online · following your rules', thinking: 'Thinking', writing: 'Writing' },
      hints: 'Hints',
      hintsAria: (used: number, max: number) => `Hints used: ${used} of ${max}`,
      reset: 'Reset',
      demo: 'Watch demo',
      item: {
        label: 'Item 03 · Equilibrium price',
        prompt: 'Using the table from Lesson 4, find the equilibrium price.',
        caption: 'Lesson 4 price table',
        price: 'Price',
        supplied: 'Supplied',
        demanded: 'Demanded',
        checking: '(being checked)',
      },
      log: 'Conversation with Metis',
      student: 'Student',
      thinkingAria: 'Metis is thinking',
      prompts: {
        initial: "What's the equilibrium price? Just give me the number.",
        answer: 'Just tell me the answer.',
        start: "I don't know where to start.",
        check40: 'Is it $40?',
      } as Record<Preset, string>,
      inputLabel: 'Message Metis',
      placeholder: 'Ask something, like “Is it $30?”',
      send: 'Send →',
      off: { text: 'AI guide is off for this assessment', turnOn: 'Turn the guide on' },
      thatPrice: 'that price',
      replies: {
        answer: {
          socratic:
            "I can't give you the number, but we can find it together. What has to be true about supply and demand at the equilibrium price?",
          hints:
            'Hint: the equilibrium price is where quantity supplied equals quantity demanded. Look for that row in the table.',
          example:
            'Worked example: if at $8 sellers offer 15 units and buyers want 15, then $8 is the equilibrium. Run the same check on your table.',
        },
        start: {
          socratic:
            'Start with the table. What happens to quantity demanded as the price goes up? And to quantity supplied?',
          hints:
            'Hint: go row by row and compare the two quantity columns. One row is different from the rest.',
          example:
            'Here is the method: 1) read a row, 2) compare supplied and demanded, 3) stop where they match. Try step 1 with the first row.',
        },
        check: {
          socratic: (at: string) =>
            `I won't confirm it yet. At ${at}, how many units are supplied and how many are demanded? Are they equal?`,
          hints: (at: string) =>
            `Hint: find the ${at} row and compare both quantity columns. If they match, you have your answer.`,
          example: (at: string) =>
            `Example: at $8, 15 supplied and 15 demanded means $8 is the equilibrium. Do the same check at ${at}.`,
        },
        other: {
          socratic:
            'Good question to think through. What does the table tell you about buyers and sellers when the price changes?',
          hints: 'Hint: this item is about the point where both quantity columns meet.',
          example:
            'Picture a market where 15 units are both offered and wanted at $8: that price is the equilibrium. Look for the same pattern here.',
        },
      } as Record<Kind, Record<HelpMode, Reply>>,
      source: 'Source: Lesson 4, p. 06.',
      limit: (max: number) =>
        `You have used the ${max} hints your instructor allows on this item. Give it your best answer; you will see feedback when you submit.`,
      tag: {
        hint: (n: number, max: number) => `HINT ${n}/${max}`,
        source: 'SOURCE P. 06',
        withheld: 'ANSWER WITHHELD',
        limit: 'LIMIT REACHED',
      },
      notices: {
        mode: (label: string) => `Rule updated — ${label}`,
        maxHints: (n: number) => `Rule updated — max hints: ${n}`,
        cite: (on: boolean) => `Rule updated — cite material: ${on ? 'on' : 'off'}`,
        guide: (on: boolean): string => (on ? 'AI guide turned on' : 'AI guide turned off'),
      },
    },
  },
  configure: {
    kicker: '03 — Configure',
    title: 'You define the structure. Metis fills in the items.',
    lead: 'Adjust the controls. The preview is built from topics detected in the sample material, and the guide settings are shared with the chat above.',
    count: 'Number of items',
    countValueText: (n: number) => `${n} items`,
    types: 'Item types',
    typeNames: {
      mc: 'Multiple choice',
      tf: 'True or false',
      short: 'Short answer',
      match: 'Matching',
    } as Record<ItemType, string>,
    minOneType: 'At least one item type is required',
    difficulty: 'Difficulty',
    levels: { basic: 'Basic', medium: 'Medium', advanced: 'Advanced' } as Record<Level, string>,
    metisToggle: 'Metis in the student link',
    maxHints: 'Max hints per item',
    previewTitle: 'Economics · Supply and demand',
    previewLabel: 'Assessment preview',
    columns: { no: 'No.', type: 'Type', topic: 'Topic', level: 'Level', source: 'Source' },
    levelAria: (d: number) => `Level ${d} of 3`,
    page: (n: string) => `p. ${n}`,
    more: (n: string) => `+ ${n} more items`,
    summary: (count: string, types: number, level: string, guide: boolean) =>
      `${count} items · ${types} types · ${level} · guide ${guide ? 'on' : 'off'}`,
    guideLine: (on: boolean, max: number) =>
      on ? `Metis: on · max ${max} hints · never reveals the answer` : 'Metis: off',
    ready: 'Ready to share',
  },
  topics: {
    demand: 'Law of demand',
    supply: 'Law of supply',
    equilibrium: 'Equilibrium price',
    elasticity: 'Price elasticity',
    surplus: 'Consumer surplus',
    shifts: 'Curve shifts',
    substitutes: 'Substitute goods',
    complements: 'Complementary goods',
    ceilings: 'Price ceilings',
    shortage: 'Shortage and surplus',
  } as Record<TopicId, string>,
  results: {
    kicker: '04 — Results',
    title: "What happened, item by item, as soon as it's submitted.",
    kpis: {
      submissions: 'Submissions',
      accuracy: 'Average accuracy',
      hints: 'Hints from Metis',
      revealed: 'Answers revealed',
    },
    percent: (n: number) => `${n}%`,
    histogramCaption: 'Score distribution (0–10)',
    histogramLabel: 'Score histogram: most students scored between 6 and 9 points out of 10',
    accuracyCaption: 'Accuracy by item · sorted lowest to highest',
    review: 'Review',
    summaryLabel: 'Metis · summary for the instructor',
    summary: 'Item 05 drew 6 of the 11 hints. Consumer surplus is worth revisiting before the next unit.',
    seeConversations: 'See the conversations →',
    avatarLabel: 'Metis reviewing the results, with reading glasses',
  },
  insights: {
    kicker: '05 — Conversation insights',
    title: 'Every question to Metis is saved. Read them as data.',
    lead: "Each student's chat with Metis is stored with the assessment results. Open any conversation, see what the class asked most, and find the moment the exam got hard.",
    stats: {
      asked: 'Students who asked',
      questions: 'Questions to Metis',
      peak: (item: string) => `Peak · item ${item}`,
      minutes: 'min',
    },
    intents: {
      heading: 'What students ask Metis',
      names: {
        concept: 'Explain a concept',
        check: 'Check an answer',
        answer: 'Ask for the answer',
        start: 'Know where to start',
      } as Record<Intent, string>,
      examples: {
        concept: 'What does consumer surplus mean?',
        check: 'Is it $40?',
        answer: 'Just tell me the answer.',
        start: "I don't know where to start.",
      } as Record<Intent, string>,
      withheld: 'Answer withheld every time',
    },
    timeline: {
      heading: 'Questions during the exam',
      caption: 'Questions to Metis per 5-minute block',
      label:
        'Line chart: questions to Metis rose to a peak of 17 between minutes 20 and 25, while students worked on item 05, then fell toward the end of the exam.',
      axis: (minute: number) => `${minute} min`,
      peak: (item: string, n: number) => `Item ${item} · ${n}`,
    },
    sessions: {
      heading: 'Review any conversation',
      listLabel: 'Saved conversations',
      student: (n: string) => `Student ${n}`,
      meta: (item: string, minute: number, count: number) =>
        `Item ${item} · min ${minute} · ${count} messages`,
      transcriptLabel: (student: string) => `Conversation between ${student} and Metis`,
      item: (item: string, topic: string) => `Item ${item} · ${topic}`,
      saved: 'Saved with the assessment results · read-only',
      transcripts: {
        s07: [
          { from: 'student', text: 'What does consumer surplus mean?' },
          {
            from: 'metis',
            text: 'It compares what buyers were willing to pay with what they actually paid. Where on the demand curve could you see that gap?',
            tag: 'HINT 1/3',
          },
          { from: 'student', text: 'The area under the curve and above the price?' },
          {
            from: 'metis',
            text: 'Good. What shape is that area, and how would you find its size?',
            tag: 'SOCRATIC',
          },
        ],
        s12: [
          { from: 'student', text: 'Is it $40?' },
          {
            from: 'metis',
            text: "I won't confirm it yet. At $40, how many units are supplied and how many are demanded?",
            tag: 'ANSWER WITHHELD',
          },
          { from: 'student', text: '30 and 30.' },
          {
            from: 'metis',
            text: 'Then what does that tell you about $40? Write your reasoning in the answer box.',
            tag: 'HINT 2/3',
          },
        ],
        s19: [
          { from: 'student', text: 'Just give me the answer for item 05.' },
          {
            from: 'metis',
            text: "I can't give you the answer, but we can get there. What price did buyers pay, and how much were they willing to pay?",
            tag: 'ANSWER WITHHELD',
          },
          { from: 'student', text: 'They paid $30 and would pay up to $50.' },
          {
            from: 'metis',
            text: 'So each buyer kept part of that difference. How would you add it up for everyone?',
            tag: 'HINT 1/3',
          },
        ],
        s23: [
          { from: 'student', text: "I don't know where to start." },
          {
            from: 'metis',
            text: 'Start with the table. What happens to quantity demanded as the price goes up?',
            tag: 'HINT 1/3',
          },
          { from: 'student', text: 'It goes down.' },
          {
            from: 'metis',
            text: 'Right. That is the law of demand. Lesson 4, p. 04 explains why.',
            tag: 'SOURCE P. 04',
          },
        ],
      } as Record<SessionId, Turn[]>,
    },
    trend: {
      label: 'Metis · trend for the instructor',
      text: '8 of the 17 students who used Metis asked what consumer surplus means, all during item 05, where questions peaked. Revisit the definition before the next unit.',
      basis: 'Based on 64 questions from 17 conversations',
      avatarLabel: 'Metis thinking about the class conversations',
    },
  },
  spec: {
    kicker: '06 — Spec sheet',
    title: 'What Metis does, without adjectives.',
    rows: [
      { id: 'input', k: 'Input', v: 'PDFs, documents, slides, and notes. Drag and drop.' },
      {
        id: 'generation',
        k: 'Generation',
        v: 'AI suggests items from your material. You approve, edit, or discard each one.',
      },
      { id: 'types', k: 'Item types', v: 'Multiple choice, true or false, short answer, and matching.' },
      {
        id: 'distribution',
        k: 'Distribution',
        v: 'One link per assessment. Students respond from any device.',
      },
      {
        id: 'guide',
        k: 'AI guide',
        v: 'Metis, an agent in the student link that gives hints following your rules. Never reveals the answer.',
      },
      { id: 'results', k: 'Results', v: "By item, by student, and by topic, as soon as it's submitted." },
      {
        id: 'conversations',
        k: 'Conversations',
        v: 'Every chat with Metis is saved with the results. Review it by student, see the most common questions, and spot trends.',
      },
      { id: 'sources', k: 'Sources', v: 'Each item points to its passage in the source material.' },
      { id: 'integration', k: 'Integration', v: 'Works with Canvas LMS. Exports to PDF and Word.' },
    ],
  },
  cta: {
    kicker: '07 — Get started',
    title: 'Start with one file',
    note: 'No credit card · set up in 2 minutes',
    primary: 'Create a free assessment →',
    secondary: 'Talk to our team',
    metisCaption: 'Metis comes with every link',
    avatarLabel: 'Metis celebrating',
  },
  footer: {
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    copyright: (year: number) => `© ${year} Metis`,
  },
};

export type Messages = typeof en;
