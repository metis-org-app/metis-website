import type { Expression } from '../../components/avatar/expressions';
import type {
  AuditCategory,
  ItemType,
  Level,
  MeaningClusterId,
  MisconceptionId,
  SessionId,
  TopicId,
} from '../../content/demo-data';
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
    title: 'Metis: from class material to learning data',
    description:
      "Metis uses AI to turn your class files into assessments, shares them through a link, and reports results by item, student, and topic. Students can ask its AI guide for hints, and it won't give them the answer.",
    ogDescription:
      "AI assessments from your files, shared through a link. Its AI guide gives students hints and won't give them the answer.",
    ogImageAlt: 'Metis, the AI guide, drawn as a student with a laurel crown, an owl and books',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main',
    legalNav: 'Legal',
    language: 'Language',
    home: 'Metis, home',
    langNames: { es: 'Español', en: 'English' },
  },
  sampleData: 'Sample data · Quiz 02, Supply and demand',
  header: {
    login: 'Log in',
    cta: 'Create assessment →',
    ctaShort: 'Start free →',
    menu: 'Menu',
    nav: {
      guide: 'AI guide',
      configure: 'Configure',
      results: 'Results',
      insights: 'Insights',
      spec: 'Spec',
    },
  },
  hero: {
    titleLead: 'From class material',
    titleTail: 'to learning data',
    lead: "Metis uses AI to turn your files into an assessment, shares it through a link, and reports results by item, student, and topic. Inside the link, students can ask Metis for hints; it won't give them the answer.",
    primaryCta: 'Create a free assessment →',
    secondaryCta: 'Talk to Metis ↓',
    pipeline: [
      { key: 'file', title: 'File', note: 'PDF · DOCX · PPTX' },
      { key: 'items', title: 'Items', note: 'Suggested by AI' },
      { key: 'link', title: 'Link + Metis', note: 'Hints, never answers' },
      { key: 'results', title: 'Results', note: 'By item and student' },
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
  guide: {
    title: 'Metis follows the rules you set.',
    lead: 'Metis works inside the student link. Change a rule and the next reply in the chat follows it. Ask your own question or watch the demo.',
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
          desc: 'Solves a similar case so the student can copy the method',
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
            'Look at the table. What does it tell you about buyers and sellers when the price changes?',
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
        mode: (label: string) => `Rule updated: ${label}`,
        maxHints: (n: number) => `Rule updated: max hints ${n}`,
        cite: (on: boolean) => `Rule updated: cite material ${on ? 'on' : 'off'}`,
        guide: (on: boolean): string => (on ? 'AI guide turned on' : 'AI guide turned off'),
      },
    },
  },
  configure: {
    title: 'You set the structure and Metis writes the items.',
    lead: 'The preview uses topics Metis found in the sample material. The guide settings here are the same ones the chat above uses.',
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
    title: 'See how each item went as soon as students submit.',
    kpis: {
      submissions: 'Submissions',
      accuracy: 'Average accuracy',
      hints: 'Hints from Metis',
      revealed: 'Answers revealed',
    },
    percent: (n: number) => `${n}%`,
    histogramCaption: 'Score distribution (0–10)',
    histogramLegend: 'Score of 4 or less',
    histogramLabel: 'Score histogram: most students scored between 6 and 9 points out of 10',
    accuracyCaption: 'Accuracy by item · sorted lowest to highest',
    review: 'Review',
    summaryLabel: 'Metis · summary for the instructor',
    summary: 'Item 05 drew 6 of the 11 hints. Consumer surplus is worth revisiting before the next unit.',
    seeConversations: 'See the conversations →',
    avatarLabel: 'Metis reviewing the results, with reading glasses',
  },
  insights: {
    title: 'Every question students ask Metis is saved.',
    lead: "Chats are stored with the assessment results. You can read any student's conversation, see what the class asked about, check that Metis never gave an answer away and follow how students rely on it from one assessment to the next.",
    stats: {
      asked: 'Students who asked',
      questions: 'Questions to Metis',
      peak: (item: string) => `Peak · item ${item}`,
      minutes: 'min',
    },
    analyses: {
      heading: 'What Metis analyzes in the conversations',
      carousel: 'carousel',
      slide: 'slide',
      tabsLabel: 'Analyses',
      position: (n: number, total: number) => `${n} of ${total}`,
      previous: 'Previous analysis',
      next: 'Next analysis',
      pause: 'Pause the analyses carousel',
      play: 'Play the analyses carousel',
      computes: 'What Metis calculates',
      showData: 'See the data',
      slides: {
        integrity: {
          tab: 'Integrity',
          kicker: 'Integrity and trust in AI',
          title: 'A second model reviewed all 64 replies from Metis. None gave the answer away.',
          points: [
            'Each reply is checked against your rules: whether it revealed the answer, kept to the help style and cited the material.',
            'Metis counts the attempts to get the answer out of it, and how many it held back.',
            'Student answers that copy the wording of Metis are flagged.',
          ],
          method: 'Each reply is checked against the rules that were active when it was sent.',
        },
        semantic: {
          tab: 'What they ask',
          kicker: 'What students really talk about',
          title: 'Questions pile up on page 08 of Lesson 4, while students work on item 05.',
          points: [
            'Questions are grouped by meaning, even when students word them differently.',
            'Each question is linked to the passage of the material that answers it.',
            'Unclear item wording and terms students mix up show up on their own.',
          ],
          method: 'Questions and course material are compared by meaning with language-model embeddings.',
        },
        evidence: {
          tab: 'With evidence',
          kicker: 'Interpretation with evidence',
          title: 'Three misconceptions explain 11 of the 14 wrong answers on item 05.',
          points: [
            'A language model reads what each student wrote and names the belief behind it.',
            'Every finding links to the conversations it comes from.',
            'The teaching recommendation cites its sources, so you can check it.',
          ],
          method: 'Conversations are read next to the submitted answers; each finding keeps its quotes.',
        },
        longitudinal: {
          tab: 'Over time',
          kicker: 'Across the course',
          title: 'Questions to Metis per student fell from 3 to 1 between Quiz 01 and Quiz 04.',
          points: [
            'Reliance on Metis is tracked for each student and for the class, assessment after assessment.',
            'Help on a topic is checked against later answers on that same topic.',
            'Students who keep asking for answers, show frustration and score low are flagged early.',
          ],
          method: 'Median and middle 50% of the same group of students in each assessment.',
        },
      },
      integrity: {
        caption: 'Audit of the replies from Metis · each square is one reply',
        legend: {
          cited: 'Followed your rules and cited the material',
          followed: 'Followed your rules, no citation',
          offMode: 'Drifted from the help style',
          revealed: 'Revealed the answer',
        } as Record<AuditCategory, string>,
        summary: (total: number, cited: number, followed: number, offMode: number, revealed: number) =>
          `${total} replies: ${cited} followed the rules and cited the material, ${followed} followed the rules without a citation, ${offMode} drifted from the help style and ${revealed} revealed the answer.`,
        revealed: 'Answers revealed',
        revealedValue: (n: number, total: number) => `${n} of ${total}`,
        attempts: 'Attempts to get the answer',
        attemptsNote: (n: number) => `all ${n} held back`,
        copied: 'Answers that copy Metis',
        columns: { category: 'Category', replies: 'Replies' },
      },
      semantic: {
        caption: 'Questions by item and page of Lesson 4',
        item: (item: string) => `Item ${item}`,
        page: (page: string) => `p. ${page}`,
        legend: 'Questions per cell',
        hottest: 'Most questions',
        summary: (total: number, max: number, item: string, page: string) =>
          `Heat map of ${total} questions by item and page of Lesson 4. The most, ${max}, are about page ${page} during item ${item}.`,
        clustersTitle: 'Largest groups of questions',
        questions: (n: number) => `${n} questions`,
        clusters: {
          surplus: {
            label: 'What consumer surplus means',
            quote: 'Is it what they paid or what they were willing to pay?',
          },
          table: { label: 'How to read the price table', quote: 'Which column is the quantity demanded?' },
          prompt: {
            label: 'What item 04 is asking for',
            quote: 'Do they want the number or the explanation?',
          },
        } as Record<MeaningClusterId, { label: string; quote: string }>,
        columns: { item: 'Item', total: 'Total' },
      },
      evidence: {
        caption: 'Beliefs behind the wrong answers on item 05',
        names: {
          pricePaid: 'Mixes up surplus with the price paid',
          wholeArea: 'Takes the whole area under the demand curve',
          quantities: 'Subtracts quantities instead of prices',
          unclear: 'No clear pattern',
        } as Record<MisconceptionId, string>,
        students: (n: number) => `${n} students`,
        summary: (named: number, incorrect: number) =>
          `Bar chart: three misconceptions explain ${named} of the ${incorrect} wrong answers on item 05; the largest is mixing up surplus with the price paid.`,
        quotesTitle: 'Evidence',
        quotes: [
          { who: 'Student 04 · min 22', text: 'So the surplus is the $30 they paid, right?' },
          { who: 'Student 15 · min 24', text: 'I added up everything under the demand curve.' },
        ],
        teachTitle: 'What to teach on Monday',
        teach:
          'Go back to the definition with the price table on page 08. Ask what each buyer was willing to pay, then compare it with the price they paid.',
        columns: { belief: 'Belief', students: 'Students' },
      },
      longitudinal: {
        caption: 'Questions to Metis per student (median)',
        band: 'Middle 50% of students',
        quiz: (quiz: string) => `Quiz ${quiz}`,
        current: 'This assessment',
        summary: (from: string, to: string) =>
          `Line chart: the median number of questions to Metis per student went from ${from} in Quiz 01 to ${to} in Quiz 04, and the spread between students narrowed.`,
        answerRequests: 'Requests for the answer',
        transfer: 'Right on surplus in Quiz 03 after asking about it',
        earlyWarning: 'Students to reach out to',
        columns: { quiz: 'Assessment', median: 'Median', range: 'Middle 50%' },
      },
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
        v: 'Metis, an agent in the student link. It gives hints under your rules and never reveals the answer.',
      },
      { id: 'results', k: 'Results', v: 'By item, student, and topic, as soon as students submit.' },
      {
        id: 'conversations',
        k: 'Conversations',
        v: 'Each chat with Metis is saved with the results. You can read it, see the most common questions, and follow trends.',
      },
      { id: 'sources', k: 'Sources', v: 'Each item points to its passage in the source material.' },
      { id: 'export', k: 'Export', v: 'PDF and Word.' },
    ],
  },
  cta: {
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
