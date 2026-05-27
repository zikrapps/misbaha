import { formatNumber } from '@/src/i18n/format';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { Language, normalizeLanguage, ThemeId } from '@/src/types/misbaha';

export type { Language };
export { normalizeLanguage };

export const languages: Record<Language, { id: Language; name: string; nativeName: string }> = {
  en: { id: 'en', name: 'English', nativeName: 'English' },
  ur: { id: 'ur', name: 'Urdu', nativeName: 'اردو' },
};

export type Strings = {
  common: {
    done: string;
    cancel: string;
    save: string;
    start: string;
    reset: string;
    today: string;
    lifetime: string;
    days: string;
    day: string;
    complete: string;
    completed: string;
    back: string;
    open: string;
    tree: string;
    trees: string;
    linkUnavailable: string;
  };
  tabs: {
    today: string;
    tasbeeh: string;
    goals: string;
    visualize: string;
  };
  today: {
    title: string;
    todayTaps: string;
    lifetime: string;
    goalFocus: string;
    dailyActivity: string;
    todaysTaps: string;
    hourlyHint: string;
    dailyGoal: string;
    weeklyGoal: string;
    monthlyGoal: string;
    presetGoal: string;
    customGoal: string;
    dailyTasbeeh: string;
    chart12am: string;
    chart6am: string;
    chart12pm: string;
    chart6pm: string;
    chart1159pm: string;
  };
  duas: {
    title: string;
    subtitle: string;
    totalTaps: string;
    fivePrayers: string;
    moreDuas: string;
    speaker: string;
    allPrayers: string;
    morningAdhkar: string;
    nightAdhkar: string;
    quranicDuas: string;
    notFound: string;
    back: string;
    counterHint: string;
    tapHint: (weight: number) => string;
    doubleTapHint: (weight: number) => string;
    expandToCount: string;
    resetTitle: string;
    resetBody: (title: string) => string;
    expand: string;
    collapse: string;
    onQuran: string;
    onSunnah: string;
  };
  goals: {
    title: string;
    subtitle: string;
    yourPlans: string;
    suggested: string;
    suggestedHint: string;
    empty: string;
    planNew: string;
    surpriseNewGoal: string;
    surpriseNewGoalHint: string;
    todayLabel: string;
    dayProgress: (current: number, total: number, done: number) => string;
    durationDays: (days: number) => string;
  };
  goalDetail: {
    notFound: string;
    backToGoals: string;
    dayOf: (day: number, total: number) => string;
    todaysTasbeeh: string;
    openCounter: (weight: number) => string;
    thePlan: string;
    references: string;
    noReferences: string;
    findOnSunnah: string;
    export: string;
    previewPortrait: string;
    previewLandscape: string;
    pdfPreview: string;
    a4Portrait: string;
    landscape118: string;
    calendarView: string;
    calendarHint: string;
    day: string;
    moreRows: (count: number) => string;
    cancelPreview: string;
    generatePdf: string;
    exportFailedTitle: string;
    exportFailedBody: string;
    pdfShareUnavailableTitle: string;
    pdfShareUnavailableBody: string;
    calendarPlan: string;
    duasInPlan: string;
    moreDuas: (count: number) => string;
  };
  goalCreate: {
    title: string;
    subtitle: string;
    durationQuestion: string;
    planQuestion: string;
    surpriseTitle: string;
    surpriseDescription: string;
    customTitleLabel: string;
    customDescription: string;
    shuffle: string;
    plansFor: (days: number) => string;
    startPlan: string;
    moreDays: (count: number) => string;
    begin: string;
    surpriseTitlePattern: (days: number) => string;
    customTitle: (days: number) => string;
    gardenTitle: (days: number) => string;
    surpriseDescriptionGenerated: string;
    customDescriptionGenerated: string;
    gardenDescriptionGenerated: string;
  };
  insights: {
    title: string;
    subtitle: string;
    today: string;
    activeDays: string;
    perDay: string;
    thirtyDaysAgo: string;
    todayLabel: string;
    tasbeehByPrayer: string;
  };
  garden: {
    lifetime: string;
    barren: string;
    perHundred: string;
    treesPlanted: (count: number) => string;
    moreToRanges: (count: number) => string;
    barrenRanges: string;
    mountainRanges: (count: number) => string;
    oneRange: string;
  };
  settings: {
    title: string;
    subtitle: string;
    countPerTap: string;
    perTap: string;
    tapStatement: (n: number) => string;
    tapHint: string;
    theme: string;
    themeAccessibility: (name: string, description: string) => string;
    feedback: string;
    clickSound: string;
    clickSoundHint: string;
    haptic: string;
    hapticHint: string;
    reset: string;
    resetTitle: string;
    resetHint: string;
    resetConfirmTitle: string;
    resetConfirmBody: string;
    resetConfirmAction: string;
    language: string;
    languageHint: string;
    about: string;
    publishedBy: (entity: string) => string;
    contact: string;
    contactHint: string;
    help: string;
    tutorialTitle: string;
    tutorialHint: string;
  };
  themes: Record<ThemeId, { name: string; description: string }>;
  tutorial: {
    skip: string;
    next: string;
    finish: string;
    stepOf: (current: number, total: number) => string;
    steps: {
      welcome: { title: string; body: string };
      expand: { title: string; body: string };
      doubleTap: { title: string; body: string };
      duaDetail: { title: string; body: string };
      goals: { title: string; body: string };
      goalDetail: { title: string; body: string };
      today: { title: string; body: string };
      visualize: { title: string; body: string };
      settings: { title: string; body: string };
    };
  };
};

const enStrings: Strings = {
  common: {
    done: 'Done',
    cancel: 'Cancel',
    save: 'Save',
    start: 'Start',
    reset: 'Reset',
    today: 'Today',
    lifetime: 'Lifetime',
    days: 'days',
    day: 'Day',
    complete: 'complete',
    completed: 'done',
    back: 'Back',
    open: 'Open',
    tree: 'tree',
    trees: 'trees',
    linkUnavailable: 'This link cannot be opened on this device.',
  },
  tabs: {
    today: 'Today',
    tasbeeh: 'Tasbeeh',
    goals: 'Goals',
    visualize: 'Visualize',
  },
  today: {
    title: 'Today',
    todayTaps: 'Today’s taps',
    lifetime: 'Lifetime',
    goalFocus: 'Goal Focus',
    dailyActivity: 'Daily Activity',
    todaysTaps: 'Today’s Taps',
    hourlyHint: 'Hourly activity from 12:00am through 11:59pm.',
    dailyGoal: 'Daily goal',
    weeklyGoal: 'Weekly goal',
    monthlyGoal: 'Monthly goal',
    presetGoal: 'Preset goal',
    customGoal: 'Custom goal',
    dailyTasbeeh: 'Daily Tasbeeh',
    chart12am: '12am',
    chart6am: '6am',
    chart12pm: '12pm',
    chart6pm: '6pm',
    chart1159pm: '11:59pm',
  },
  duas: {
    title: 'Tasbeeh',
    subtitle: 'tap, hold, repeat',
    totalTaps: 'Total taps',
    fivePrayers: 'Five daily prayers',
    moreDuas: 'More duas',
    speaker: 'Speaker',
    allPrayers: 'All prayers',
    morningAdhkar: 'Adhkar Subha',
    nightAdhkar: 'Adhkar Layl',
    quranicDuas: 'Quranic Duas',
    notFound: 'Dua not found.',
    back: 'Back',
    counterHint: 'tap, double-tap, or hold the dua to count',
    tapHint: (weight) => `tap, double-tap, or hold to count • +${formatNumber(weight)} each`,
    doubleTapHint: (weight) => `double-tap anywhere to count • +${formatNumber(weight)} each`,
    expandToCount: 'Expand to count',
    resetTitle: 'Reset counter?',
    resetBody: (title) => `Reset ${title} back to 0?`,
    expand: 'Expand dua',
    collapse: 'Collapse dua',
    onQuran: 'on Quran.com',
    onSunnah: 'on Sunnah.com',
  },
  goals: {
    title: 'Goals',
    subtitle: 'commit a week, ten days, a month',
    yourPlans: 'Your plans',
    suggested: 'Suggested goals',
    suggestedHint: 'Plans you have not started yet.',
    empty: 'No active plans yet — start a suggested goal or create your own.',
    planNew: 'Plan a new goal',
    surpriseNewGoal: 'Surprise new goal',
    surpriseNewGoalHint: 'Random plan · 1–30 days',
    todayLabel: 'Today',
    dayProgress: (current, total, done) => `Day ${formatNumber(current)}/${formatNumber(total)} · ${formatNumber(done)} done`,
    durationDays: (days) => `${formatNumber(days)} days`,
  },
  goalDetail: {
    notFound: 'Goal not found',
    backToGoals: 'Back to goals',
    dayOf: (day, total) => `Day ${formatNumber(day)} of ${formatNumber(total)}`,
    todaysTasbeeh: 'Today’s tasbeeh',
    openCounter: (weight) => `Open counter → +${formatNumber(weight)}`,
    thePlan: 'The plan',
    references: 'References',
    noReferences: 'No Sahih Muslim or Sahih al-Bukhari reference is attached to this goal yet.',
    findOnSunnah: 'Find close match on Sunnah.com',
    export: 'Export',
    previewPortrait: 'Preview A4 portrait',
    previewLandscape: 'Preview 11×8 landscape',
    pdfPreview: 'PDF preview',
    a4Portrait: 'A4 portrait',
    landscape118: '11×8 landscape',
    calendarView: 'Calendar View',
    calendarHint: 'The printed plan includes one calendar cell for every day in this goal.',
    day: 'Day',
    moreRows: (count) => `+ ${formatNumber(count)} more rows in the PDF`,
    cancelPreview: 'Cancel preview',
    generatePdf: 'Generate PDF',
    exportFailedTitle: 'Export failed',
    exportFailedBody: 'The PDF could not be created right now.',
    pdfShareUnavailableTitle: 'PDF ready',
    pdfShareUnavailableBody: 'Sharing is not available here. The PDF was saved on your device.',
    calendarPlan: 'calendar plan',
    duasInPlan: 'Duas in this plan',
    moreDuas: (count) => `+ ${formatNumber(count)} more duas`,
  },
  goalCreate: {
    title: 'Plan a new goal',
    subtitle: 'choose a pace and begin',
    durationQuestion: 'How long do you want to commit?',
    planQuestion: 'How would you like to plan it?',
    surpriseTitle: 'Surprise me',
    surpriseDescription: 'App suggests a different dua per day.',
    customTitleLabel: 'Custom',
    customDescription: 'Reshuffle the rotation before starting.',
    shuffle: 'Randomize daily tasbeehs',
    plansFor: (days) => `Plans for ${formatNumber(days)} days`,
    startPlan: 'Start this plan',
    moreDays: (count) => `+ ${formatNumber(count)} more days`,
    begin: 'Begin',
    surpriseTitlePattern: (days) => `${formatNumber(days)}-Day Surprise`,
    customTitle: (days) => `${formatNumber(days)}-Day Custom Path`,
    gardenTitle: (days) => `${formatNumber(days)}-Day Garden`,
    surpriseDescriptionGenerated: 'A suggested plan with a different tasbeeh each day.',
    customDescriptionGenerated: 'A custom rotation you can reshuffle before beginning.',
    gardenDescriptionGenerated: 'A randomized plan with a different remembrance every day.',
  },
  insights: {
    title: 'Visualize',
    subtitle: 'a garden of dhikr',
    today: 'Today',
    activeDays: 'Active days',
    perDay: 'Per day',
    thirtyDaysAgo: '30 days ago',
    todayLabel: 'today',
    tasbeehByPrayer: 'All tasbeehs by prayer direction',
  },
  garden: {
    lifetime: 'Lifetime',
    barren: 'Barren slopes — reach 100 on a dua to plant a tree',
    perHundred: '1 per 100 counts',
    treesPlanted: (count) =>
      `${formatNumber(count)} ${count === 1 ? 'tree' : 'trees'} · 1 per 100 counts`,
    moreToRanges: (count) => `${formatNumber(count)} more to reveal distant ranges`,
    barrenRanges: 'barren ranges — keep counting to plant across the vista',
    mountainRanges: (count) => `${formatNumber(count)} mountain ranges`,
    oneRange: '1 range',
  },
  settings: {
    title: 'Settings',
    subtitle: 'tune the counter',
    countPerTap: 'Count per tap',
    perTap: 'per tap',
    tapStatement: (n) => `Each tap adds ${formatNumber(n)} to your count.`,
    tapHint: 'Drag the dial in spirit: tap a preset to make the counter heavier.',
    theme: 'Theme',
    themeAccessibility: (name, description) => `${name} theme. ${description}`,
    feedback: 'Feedback',
    clickSound: 'Click sound',
    clickSoundHint: 'A soft tick on each tap and dial notch.',
    haptic: 'Haptic feedback',
    hapticHint: 'Subtle vibration on every count.',
    reset: 'Reset',
    resetTitle: 'Reset counter',
    resetHint: 'Clear all dua counts and activity history.',
    resetConfirmTitle: 'Reset all counters?',
    resetConfirmBody: 'This clears dua counts, daily activity, and goal progress.',
    resetConfirmAction: 'Reset counters',
    language: 'Language',
    languageHint: 'Choose the language for app labels and text.',
    about: 'About',
    publishedBy: (entity) => `Published by ${entity}`,
    contact: 'Contact',
    contactHint: 'Questions, feedback, or security reports',
    help: 'Help',
    tutorialTitle: 'Gesture tutorial',
    tutorialHint: 'Walk through counting gestures and app features.',
  },
  themes: {
    garden: {
      name: 'Garden',
      description: 'Cream parchment, olive ink, soft devotional warmth.',
    },
    chromatic: {
      name: 'Chromatic',
      description: 'Cool indigo-violet base with teal accents — readable and vivid.',
    },
    rose: {
      name: 'Rose',
      description: 'Warm rose clay, date-palm green, and softer rounded type.',
    },
    parchment: {
      name: 'Parchment',
      description: 'Warm grey parchment — ink on paper, entirely greyscale.',
    },
  },
  tutorial: {
    skip: 'Skip',
    next: 'Next',
    finish: 'Get started',
    stepOf: (current, total) => `Step ${formatNumber(current)} of ${formatNumber(total)}`,
    steps: {
      welcome: {
        title: 'Welcome to Misbaha',
        body: 'A calm counter for tasbeeh, daily goals, and a growing garden of dhikr. This quick tour shows how to count and navigate.',
      },
      expand: {
        title: 'Expand a dua',
        body: 'On Tasbeeh, tap the chevron beside a dua to expand it. Counting only works while a row is expanded.',
      },
      doubleTap: {
        title: 'Double-tap to count',
        body: 'Double-tap anywhere on the expanded dua to add to your count. A raindrop splash marks each count.',
      },
      duaDetail: {
        title: 'Full dua screen',
        body: 'Open a dua for the full view. Tap once to count, double-tap for two, or press and hold for a steady count.',
      },
      goals: {
        title: 'Goals & plans',
        body: 'On Goals, start suggested plans or tap Surprise new goal for a random 1–30 day plan built for you.',
      },
      goalDetail: {
        title: 'Count inside a goal',
        body: 'On a goal detail page, double-tap today’s dua to count toward that day. Swipe right anywhere to return to Goals.',
      },
      today: {
        title: 'Today dashboard',
        body: 'The Today tab shows your taps for the day, lifetime total, goal focus tiles, and an hourly activity chart.',
      },
      visualize: {
        title: 'Visualize your garden',
        body: 'Visualize turns lifetime counts into trees and mountain ranges — every 100 on a dua plants another tree.',
      },
      settings: {
        title: 'Tune your counter',
        body: 'In Settings, set count per tap, theme, language, click sound, and haptics. Replay this tutorial anytime.',
      },
    },
  },
};

const urStrings: Strings = {
  common: {
    done: 'مکمل',
    cancel: 'منسوخ کریں',
    save: 'محفوظ کریں',
    start: 'شروع کریں',
    reset: 'دوبارہ ترتیب',
    today: 'آج',
    lifetime: 'کُل',
    days: 'دن',
    day: 'دن',
    complete: 'مکمل',
    completed: 'مکمل',
    back: 'واپس',
    open: 'کھولیں',
    tree: 'درخت',
    trees: 'درخت',
    linkUnavailable: 'یہ لنک اس ڈیوائس پر نہیں کھل سکتا۔',
  },
  tabs: {
    today: 'آج',
    tasbeeh: 'تسبیح',
    goals: 'مقاصد',
    visualize: 'تصور',
  },
  today: {
    title: 'آج',
    todayTaps: 'آج کے ٹیپ',
    lifetime: 'کُل',
    goalFocus: 'مقصد پر توجہ',
    dailyActivity: 'روزانہ سرگرمی',
    todaysTaps: 'آج کے ٹیپ',
    hourlyHint: '12:00 بجے شب سے 11:59 بجے شب تک گھنٹہ وار سرگرمی۔',
    dailyGoal: 'روزانہ مقصد',
    weeklyGoal: 'ہفتہ وار مقصد',
    monthlyGoal: 'ماہانہ مقصد',
    presetGoal: 'تجویز کردہ مقصد',
    customGoal: 'ذاتی مقصد',
    dailyTasbeeh: 'روزانہ تسبیح',
    chart12am: '12 بجے رات',
    chart6am: '6 بجے صبح',
    chart12pm: '12 بجے دوپہر',
    chart6pm: '6 بجے شام',
    chart1159pm: '11:59 بجے رات',
  },
  duas: {
    title: 'تسبیح',
    subtitle: 'ٹیپ کریں، دبائیں، دہرائیں',
    totalTaps: 'کل ٹیپ',
    fivePrayers: 'پانچ روزانہ نمازیں',
    moreDuas: 'مزید دعائیں',
    speaker: 'کہنے والے',
    allPrayers: 'تمام نمازیں',
    morningAdhkar: 'اذکارِ صبح',
    nightAdhkar: 'اذکارِ شب',
    quranicDuas: 'قرآنی دعائیں',
    notFound: 'دعا نہیں ملی۔',
    back: 'واپس',
    counterHint: 'شمار کے لیے دعا پر ٹیپ، دو بار ٹیپ، یا دبائیں',
    tapHint: (weight) => `شمار کے لیے ٹیپ، دو بار ٹیپ، یا دبائیں • ہر بار +${formatNumber(weight)}`,
    doubleTapHint: (weight) => `شمار کے لیے کہیں بھی دو بار ٹیپ کریں • ہر بار +${formatNumber(weight)}`,
    expandToCount: 'شمار کے لیے کھولیں',
    resetTitle: 'شمار کنندہ دوبارہ ترتیب دیں؟',
    resetBody: (title) => `${title} کا شمار 0 پر واپس کریں؟`,
    expand: 'دعا کھولیں',
    collapse: 'دعا بند کریں',
    onQuran: 'Quran.com پر',
    onSunnah: 'Sunnah.com پر',
  },
  goals: {
    title: 'مقاصد',
    subtitle: 'ایک ہفتہ، دس دن، ایک ماہ کا عزم',
    yourPlans: 'آپ کے منصوبے',
    suggested: 'تجویز کردہ مقاصد',
    suggestedHint: 'وہ منصوبے جو آپ نے ابھی تک شروع نہیں کیے۔',
    empty: 'ابھی کوئی فعال منصوبہ نہیں — کوئی تجویز شدہ مقصد شروع کریں یا اپنا بنائیں۔',
    planNew: 'نیا مقصد بنائیں',
    surpriseNewGoal: 'حیرت انگیز نیا مقصد',
    surpriseNewGoalHint: 'بے ترتیب منصوبہ · 1–30 دن',
    todayLabel: 'آج',
    dayProgress: (current, total, done) =>
      `دن ${formatNumber(current)}/${formatNumber(total)} · ${formatNumber(done)} مکمل`,
    durationDays: (days) => `${formatNumber(days)} دن`,
  },
  goalDetail: {
    notFound: 'مقصد نہیں ملا',
    backToGoals: 'مقاصد پر واپس',
    dayOf: (day, total) => `دن ${formatNumber(day)} از ${formatNumber(total)}`,
    todaysTasbeeh: 'آج کی تسبیح',
    openCounter: (weight) => `شمار کنندہ کھولیں ← +${formatNumber(weight)}`,
    thePlan: 'منصوبہ',
    references: 'حوالہ جات',
    noReferences: 'اس مقصد سے ابھی تک صحیح مسلم یا صحیح بخاری کا حوالہ منسلک نہیں ہے۔',
    findOnSunnah: 'Sunnah.com پر قریبی حوالہ تلاش کریں',
    export: 'برآمد',
    previewPortrait: 'A4 عمودی پیش نظارہ',
    previewLandscape: '11×8 افقی پیش نظارہ',
    pdfPreview: 'PDF پیش نظارہ',
    a4Portrait: 'A4 عمودی',
    landscape118: '11×8 افقی',
    calendarView: 'کیلنڈر منظر',
    calendarHint: 'چھپائی شدہ منصوبے میں اس مقصد کے ہر دن کے لیے ایک خانہ شامل ہے۔',
    day: 'دن',
    moreRows: (count) => `PDF میں مزید ${formatNumber(count)} قطاریں`,
    cancelPreview: 'پیش نظارہ منسوخ کریں',
    generatePdf: 'PDF بنائیں',
    exportFailedTitle: 'برآمد ناکام',
    exportFailedBody: 'PDF ابھی نہیں بن سکی۔',
    pdfShareUnavailableTitle: 'PDF تیار ہے',
    pdfShareUnavailableBody: 'یہاں شیئرنگ دستیاب نہیں۔ PDF آپ کے ڈیوائس پر محفوظ ہو گئی ہے۔',
    calendarPlan: 'کیلنڈر منصوبہ',
    duasInPlan: 'اس منصوبے کی دعائیں',
    moreDuas: (count) => `+ ${formatNumber(count)} مزید دعائیں`,
  },
  goalCreate: {
    title: 'نیا مقصد بنائیں',
    subtitle: 'رفتار منتخب کریں اور شروع کریں',
    durationQuestion: 'آپ کتنے عرصے کا عزم کرنا چاہتے ہیں؟',
    planQuestion: 'آپ منصوبہ کیسے بنانا چاہتے ہیں؟',
    surpriseTitle: 'مجھے حیران کریں',
    surpriseDescription: 'ایپ ہر دن مختلف دعا تجویز کرے گی۔',
    customTitleLabel: 'ذاتی',
    customDescription: 'شروع کرنے سے پہلے ترتیب بدلیں۔',
    shuffle: 'روزانہ تسبیح بے ترتیب کریں',
    plansFor: (days) => `${formatNumber(days)} دن کے منصوبے`,
    startPlan: 'یہ منصوبہ شروع کریں',
    moreDays: (count) => `+ ${formatNumber(count)} مزید دن`,
    begin: 'شروع کریں',
    surpriseTitlePattern: (days) => `${formatNumber(days)} دن کا سرپرائز`,
    customTitle: (days) => `${formatNumber(days)} دن کا ذاتی راستہ`,
    gardenTitle: (days) => `${formatNumber(days)} دن کا باغ`,
    surpriseDescriptionGenerated: 'ہر دن مختلف تسبیح کے ساتھ تجویز شدہ منصوبہ۔',
    customDescriptionGenerated: 'شروع کرنے سے پہلے آپ بدل سکتے ہیں۔',
    gardenDescriptionGenerated: 'ہر دن مختلف ذکر کے ساتھ بے ترتیب منصوبہ۔',
  },
  insights: {
    title: 'تصور',
    subtitle: 'ذکر کا باغ',
    today: 'آج',
    activeDays: 'فعال دن',
    perDay: 'فی دن',
    thirtyDaysAgo: '30 دن پہلے',
    todayLabel: 'آج',
    tasbeehByPrayer: 'نماز کے لحاظ سے تمام تسبیح',
  },
  garden: {
    lifetime: 'کُل',
    barren: 'خالی پہاڑیاں — درخت لگانے کے لیے کسی دعا پر 100 تک پہنچیں',
    perHundred: 'ہر 100 شمار پر 1',
    treesPlanted: (count) => `${formatNumber(count)} درخت · ہر 100 شمار پر 1`,
    moreToRanges: (count) => `دور کی سلسلہ کوہ دکھانے کے لیے مزید ${formatNumber(count)}`,
    barrenRanges: 'خالی سلسلہ کوہ — منظر بھرنے کے لیے شمار جاری رکھیں',
    mountainRanges: (count) => `${formatNumber(count)} سلسلہ کوہ`,
    oneRange: '1 سلسلہ کوہ',
  },
  settings: {
    title: 'ترتیبات',
    subtitle: 'شمار کرنے والے کی تشکیل',
    countPerTap: 'فی ٹیپ شمار',
    perTap: 'فی ٹیپ',
    tapStatement: (n) => `ہر ٹیپ آپ کے شمار میں ${formatNumber(n)} کا اضافہ کرتا ہے۔`,
    tapHint: 'پیش سیٹ پر ٹیپ کریں تاکہ شمار کنندہ بھاری ہو جائے۔',
    theme: 'تھیم',
    themeAccessibility: (name, description) => `${name} تھیم۔ ${description}`,
    feedback: 'فیڈ بیک',
    clickSound: 'کلک کی آواز',
    clickSoundHint: 'ہر ٹیپ پر نرم سی ٹک ٹک۔',
    haptic: 'ہیپٹک فیڈ بیک',
    hapticHint: 'ہر شمار پر ہلکی سی لرزش۔',
    reset: 'دوبارہ ترتیب',
    resetTitle: 'شمار کنندہ دوبارہ ترتیب دیں',
    resetHint: 'تمام دعا کے شمار اور سرگرمی کی تاریخ صاف کریں۔',
    resetConfirmTitle: 'تمام شمار کنندے دوبارہ ترتیب دیں؟',
    resetConfirmBody: 'یہ دعا کے شمار، روزانہ سرگرمی اور مقصد کی پیش رفت صاف کر دے گا۔',
    resetConfirmAction: 'شمار کنندے دوبارہ ترتیب دیں',
    language: 'زبان',
    languageHint: 'ایپ کے لیبلز اور متن کی زبان منتخب کریں۔',
    about: 'تعارف',
    publishedBy: (entity) => `${entity} کی جانب سے`,
    contact: 'رابطہ',
    contactHint: 'سوالات، فیڈ بیک، یا سیکیورٹی رپورٹس',
    help: 'مدد',
    tutorialTitle: 'اشاروں کا تعارف',
    tutorialHint: 'شمار کے اشارے اور ایپ کی خصوصیات دیکھیں۔',
  },
  themes: {
    garden: {
      name: 'باغ',
      description: 'کریم پرچمنٹ، زیتونی سیاہی، نرم روحانی گرمجوشی۔',
    },
    chromatic: {
      name: 'رنگین',
      description: 'ٹھنڈا نیلا-جامنی بنیاد فیروزی لہجوں کے ساتھ — واضح اور روشن۔',
    },
    rose: {
      name: 'گلاب',
      description: 'گرم گلابی مٹی، کھجور سبز، اور نرم گول ٹائپ۔',
    },
    parchment: {
      name: 'پرچمنٹ',
      description: 'گرم سرمئی پرچمنٹ — سیاہی اور کاغذ، مکمل طور پر سیاہ و سفید۔',
    },
  },
  tutorial: {
    skip: 'چھوڑیں',
    next: 'اگلا',
    finish: 'شروع کریں',
    stepOf: (current, total) => `قدم ${formatNumber(current)} از ${formatNumber(total)}`,
    steps: {
      welcome: {
        title: 'مسبحة میں خوش آمدید',
        body: 'تسبیح، روزانہ مقاصد، اور بڑھتے ذکر کے باغ کے لیے ایک پرسکون شمار کنندہ۔ یہ مختصر تعارف شمار اور نیویگیشن سکھاتا ہے۔',
      },
      expand: {
        title: 'دعا کھولیں',
        body: 'تسبیح میں دعا کے پاس والے تیر پر ٹیپ کر کے اسے کھولیں۔ شمار صرف کھلی ہوئی صف پر ہوتا ہے۔',
      },
      doubleTap: {
        title: 'شمار کے لیے دو بار ٹیپ',
        body: 'کھلی دعا پر کہیں بھی دو بار ٹیپ کریں۔ ہر شمار پر بارش کی بوند کا نشان دکھائی دیتا ہے۔',
      },
      duaDetail: {
        title: 'مکمل دعا اسکرین',
        body: 'مکمل منظر کے لیے دعا کھولیں۔ ایک بار ٹیپ سے شمار، دو بار ٹیپ سے دو، یا دبا کر رکھیں تو مسلسل شمار۔',
      },
      goals: {
        title: 'مقاصد اور منصوبے',
        body: 'مقاصد میں تجویز شدہ منصوبے شروع کریں یا حیرت انگیز نیا مقصد سے 1–30 دن کا بے ترتیب منصوبہ بنائیں۔',
      },
      goalDetail: {
        title: 'مقصد میں شمار',
        body: 'مقصد کی تفصیل میں آج کی دعا پر دو بار ٹیپ کریں۔ مقاصد پر واپس جانے کے لیے دائیں سوائپ کریں۔',
      },
      today: {
        title: 'آج کا ڈیش بورڈ',
        body: 'آج کا ٹیب دن کے ٹیپ، کُل شمار، مقصد کی ٹائلیں، اور گھنٹہ وار سرگرمی دکھاتا ہے۔',
      },
      visualize: {
        title: 'اپنا باغ دیکھیں',
        body: 'تصور کُل شمار کو درختوں اور پہاڑی سلسلوں میں بدلتا ہے — ہر 100 شمار پر ایک درخت لگتا ہے۔',
      },
      settings: {
        title: 'شمار کنندہ کی ترتیب',
        body: 'ترتیبات میں فی ٹیپ شمار، تھیم، زبان، آواز، اور لرزش بدلیں۔ یہ تعارف کبھی بھی دوبارہ چلائیں۔',
      },
    },
  },
};

export const strings: Record<Language, Strings> = {
  en: enStrings,
  ur: urStrings,
};

export function getStrings(language: Language): Strings {
  return strings[normalizeLanguage(language)];
}

export function useT(): Strings {
  const language = useMisbahaStore((state) => state.language);
  return getStrings(language);
}

export function useLanguage(): Language {
  return useMisbahaStore((state) => state.language);
}

export function themeLabels(language: Language, themeId: ThemeId) {
  return getStrings(language).themes[themeId];
}
