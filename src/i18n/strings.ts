import { BadgeFamilyId, BadgeMetric } from '@/src/data/badges';
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
  duaSearch: {
    placeholder: string;
    noResults: string;
    unsupportedLanguageWarning: string;
    addToGoalHint: string;
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
    salahDuas: string;
    reliefDuas: string;
    remembranceDuas: string;
    heartDuas: string;
    dailyDuas: string;
    ramadanDuas: string;
    notFound: string;
    back: string;
    counterHint: string;
    tapHint: (weight: number) => string;
    doubleTapHint: (weight: number) => string;
    expandedCountHint: (weight: number) => string;
    expandToCount: string;
    resetTitle: string;
    resetBody: (title: string) => string;
    expand: string;
    collapse: string;
    onQuran: string;
    onSunnah: string;
    tileEyebrows: {
      quranic: string;
      prayer: string;
      morning: string;
      night: string;
      salah: string;
      relief: string;
      remembrance: string;
      heart: string;
      daily: string;
      ramadan: string;
    };
    tileDescriptions: {
      quranic: string;
      prayer: string;
      morning: string;
      night: string;
      salah: string;
      relief: string;
      remembrance: string;
      heart: string;
      daily: string;
      ramadan: string;
    };
    tileDuaCount: (count: number) => string;
  };
  goals: {
    title: string;
    subtitle: string;
    yourPlans: string;
    suggested: string;
    suggestedHint: string;
    empty: string;
    planNew: string;
    planNewHint: string;
    surpriseNewGoal: string;
    surpriseNewGoalHint: string;
    todayLabel: string;
    dayProgress: (current: number, total: number, done: number) => string;
    durationDays: (days: number) => string;
    goalLibrary: {
      title: string;
      hint: string;
      oneDay: string;
      weekly: string;
      thirtyDay: string;
      ayyamBeed: string;
      newMoon: string;
    };
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
    goalNameLabel: string;
    goalNamePlaceholder: string;
    emptySlot: string;
    removeDay: string;
    saveGoal: string;
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
  badges: {
    title: string;
    progress: (earned: number, total: number) => string;
    revealHint: string;
    earnedCount: (count: number) => string;
    empty: string;
    viewEarned: string;
    viewAll: string;
    earnedTitle: string;
    allTitle: string;
    none: string;
    lockedLabel: string;
    earnedLabel: string;
    setDivider: (n: number) => string;
    unlockTitle: string;
    unlockCta: string;
    names: Record<BadgeFamilyId, { first: string; tiered: string }>;
    descriptions: Record<BadgeMetric, (n: number) => string>;
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
    yourGarden: string;
    todaysGrowth: string;
    dhikrWord: string;
    ofGoal: string;
  };
  journey: {
    modeGarden: string;
    modeEarth: string;
    modeSpace: string;
    yourEarth: string;
    yourCosmos: string;
    earthLabel: string;
    spaceLabel: string;
    walked: string;
    risen: string;
    fromMakkah: string;
    begin: string;
    reached: (label: string) => string;
    remainingTo: (distance: string, label: string) => string;
    inDhikr: (time: string) => string;
    units: { m: string; km: string; million: string };
    duration: {
      days: (n: number) => string;
      hours: (n: number) => string;
      minutes: (n: number) => string;
      seconds: (n: number) => string;
    };
    earthMilestones: Record<string, string>;
    spaceMilestones: Record<string, string>;
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
    restartTitle: string;
    restartBody: string;
    restartAction: string;
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
      categories: { title: string; body: string };
      expand: { title: string; body: string };
      count: { title: string; body: string };
      search: { title: string; body: string };
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
  duaSearch: {
    placeholder: 'Search by transliteration or Arabic',
    noResults: 'No matching dua found.',
    unsupportedLanguageWarning:
      'Searching by English is not supported — use transliteration or Arabic.',
    addToGoalHint: 'Tap a result to fill the first blank day, or replace in order.',
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
    salahDuas: 'In Prayer',
    reliefDuas: 'Hardship & Relief',
    remembranceDuas: 'Praise & Dhikr',
    heartDuas: 'Heart & Faith',
    dailyDuas: 'Through the Day',
    ramadanDuas: 'Fasting & Ramadan',
    notFound: 'Dua not found.',
    back: 'Back',
    counterHint: 'tap, double-tap, or hold the dua to count',
    tapHint: (weight) => `tap, double-tap, or hold to count • +${formatNumber(weight)} each`,
    doubleTapHint: (weight) => `double-tap anywhere to count • +${formatNumber(weight)} each`,
    expandedCountHint: (weight) =>
      `double-tap to count • hold 3s to complete • +${formatNumber(weight)} each`,
    expandToCount: 'Expand to count',
    resetTitle: 'Reset counter?',
    resetBody: (title) => `Reset ${title} back to 0?`,
    expand: 'Expand dua',
    collapse: 'Collapse dua',
    onQuran: 'on Quran.com',
    onSunnah: 'on Sunnah.com',
    tileEyebrows: {
      quranic: 'From the Quran',
      prayer: 'After every salah',
      morning: 'Begin your day',
      night: 'Before sleep',
      salah: 'Within your salah',
      relief: 'In times of hardship',
      remembrance: 'Glorify and remember',
      heart: 'Love and steadfastness',
      daily: 'Daily occasions',
      ramadan: 'Sawm and Ramadan',
    },
    tileDescriptions: {
      quranic: 'Supplications taught in the Quran',
      prayer: 'Recite after each obligatory prayer',
      morning: 'Morning remembrance and protection',
      night: 'Evening remembrance before rest',
      salah: 'Said during the prayer itself',
      relief: 'Turn to Allah in difficulty',
      remembrance: 'Tasbih, tahmid, and takbir',
      heart: 'Faith, gratitude, and a firm heart',
      daily: 'Duas for everyday moments',
      ramadan: 'Fasting and the blessed month',
    },
    tileDuaCount: (count) => `${formatNumber(count)} duas`,
  },
  goals: {
    title: 'Goals',
    subtitle: 'commit a week, ten days, a month',
    yourPlans: 'Your plans',
    suggested: 'Suggested goals',
    suggestedHint: 'Plans you have not started yet.',
    empty: 'No active plans yet — start a suggested goal or create your own.',
    planNew: 'Plan a new goal',
    planNewHint: 'Custom duration and daily dhikr',
    surpriseNewGoal: 'Surprise new goal',
    surpriseNewGoalHint: 'Random plan · 1–30 days',
    todayLabel: 'Today',
    dayProgress: (current, total, done) => `Day ${formatNumber(current)}/${formatNumber(total)} · ${formatNumber(done)} done`,
    durationDays: (days) => `${formatNumber(days)} days`,
    goalLibrary: {
      title: 'Goal library',
      hint: 'Each plan shuffles duas and tasbeeh across its days.',
      oneDay: 'One-day goals',
      weekly: 'Weekly goals',
      thirtyDay: '30-day goals',
      ayyamBeed: 'Ayyam al-Beed',
      newMoon: 'New moon goals',
    },
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
    customDescription: 'Pick your duas, remove any day, and search to fill blanks.',
    shuffle: 'Randomize daily tasbeehs',
    goalNameLabel: 'Goal name',
    goalNamePlaceholder: 'My custom dhikr plan',
    emptySlot: 'Empty day — search to add a dua',
    removeDay: 'Remove dua',
    saveGoal: 'Save goal',
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
  badges: {
    title: 'Badges',
    progress: (earned, total) => `${formatNumber(earned)} of ${formatNumber(total)} badges earned`,
    revealHint: 'Earn all ten badges to reveal the next ten.',
    earnedCount: (count) => (count === 1 ? '1 badge earned' : `${formatNumber(count)} badges earned`),
    empty: 'Count a tasbeeh or finish a goal to earn your first badge.',
    viewEarned: 'Badges earned',
    viewAll: 'All badges',
    earnedTitle: 'Badges earned',
    allTitle: 'All badges',
    none: 'No badges earned yet — start counting to unlock your first.',
    lockedLabel: 'Locked',
    earnedLabel: 'Earned',
    setDivider: (n) => `Set ${formatNumber(n)} of 20`,
    unlockTitle: 'New badge earned!',
    unlockCta: 'Continue',
    names: {
      bead: { first: 'First bead', tiered: 'Bead keeper' },
      praise: { first: 'Hundred praises', tiered: 'Daily praise' },
      rays: { first: 'Week of light', tiered: 'Days of light' },
      moon: { first: 'Full moon', tiered: 'Moonlit streak' },
      fruit: { first: 'First fruit', tiered: 'Harvest' },
      plant: { first: 'Gardener', tiered: 'Gardener' },
      dawn: { first: 'Dawn reciter', tiered: 'Dawn reciter' },
      lantern: { first: 'Night lantern', tiered: 'Night lantern' },
      burst: { first: 'Thousand lights', tiered: 'Sea of lights' },
      compass: { first: 'Explorer', tiered: 'Explorer' },
    },
    descriptions: {
      tasbeehs: (n) => (n === 1 ? 'Complete your first tasbeeh' : `Complete ${formatNumber(n)} tasbeehs`),
      bestDay: (n) => `Count ${formatNumber(n)} dhikr in one day`,
      activeDays: (n) => `Count dhikr on ${formatNumber(n)} days`,
      bestStreak: (n) => `Keep a ${formatNumber(n)}-day streak`,
      goalsCompleted: (n) => (n === 1 ? 'Complete your first goal' : `Complete ${formatNumber(n)} goals`),
      goalDays: (n) => `Meet ${formatNumber(n)} goal-day targets`,
      morningDays: (n) => `Morning adhkar on ${formatNumber(n)} days`,
      eveningDays: (n) => `Evening adhkar on ${formatNumber(n)} nights`,
      lifetime: (n) => `Reach ${formatNumber(n)} lifetime counts`,
      distinctDuas: (n) => `Recite ${formatNumber(n)} different duas`,
    },
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
    yourGarden: 'Your garden',
    todaysGrowth: "Today's Growth",
    dhikrWord: 'dhikr',
    ofGoal: 'Of goal',
  },
  journey: {
    modeGarden: 'Garden',
    modeEarth: 'Earth',
    modeSpace: 'Cosmos',
    yourEarth: 'Your earth',
    yourCosmos: 'Your cosmos',
    earthLabel: 'Walking from Makkah',
    spaceLabel: 'Rising from Makkah',
    walked: 'You have walked',
    risen: 'You have risen',
    fromMakkah: 'Setting out from Makkah',
    begin: 'Begin your dhikr to set out from Makkah',
    reached: (label) => `You have reached ${label}`,
    remainingTo: (distance, label) => `${distance} to reach ${label}`,
    inDhikr: (time) => `≈ ${time} in dhikr`,
    units: { m: 'm', km: 'km', million: 'million km' },
    duration: {
      days: (n) => `${formatNumber(n)} ${n === 1 ? 'day' : 'days'}`,
      hours: (n) => `${formatNumber(n)} ${n === 1 ? 'hour' : 'hours'}`,
      minutes: (n) => `${formatNumber(n)} ${n === 1 ? 'minute' : 'minutes'}`,
      seconds: (n) => `${formatNumber(n)} ${n === 1 ? 'second' : 'seconds'}`,
    },
    earthMilestones: {
      madinah: 'Madinah',
      quds: 'Al-Quds',
      istanbul: 'Istanbul',
      delhi: 'Delhi',
      cordoba: 'Córdoba',
      jakarta: 'Jakarta',
      newYork: 'New York',
      aroundEarth: 'Once around the Earth',
    },
    spaceMilestones: {
      atmosphere: 'Edge of the sky',
      lowOrbit: 'Low orbit',
      geoOrbit: 'Geostationary orbit',
      moon: 'The Moon',
      mars: 'Mars',
      sun: 'The Sun',
    },
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
    restartTitle: 'Restart required',
    restartBody:
      'Fully close the app and open it again once to finish resetting the layout engine. After that, Urdu text should align from the right.',
    restartAction: 'Reload now',
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
    fadedGold: {
      name: 'Faded Gold',
      description: 'Sun-bleached champagne — dusty wheat tones and quiet ceremonial warmth.',
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
        body: 'A calm counter for tasbeeh, daily goals, and visual journeys through dhikr. This quick tour covers browsing, counting, and planning.',
      },
      categories: {
        title: 'Browse by category',
        body: 'On Tasbeeh, tap a category tile — Quranic, morning & night adhkar, salah, and more — to open its dua list.',
      },
      expand: {
        title: 'Expand a dua',
        body: 'Inside a category, tap the chevron beside a dua to expand it. Counting only works while a row is expanded.',
      },
      count: {
        title: 'Count toward your target',
        body: 'Double-tap the expanded dua to add counts. A progress bar fills toward the target — hold for 3 seconds to complete the rest in one go.',
      },
      search: {
        title: 'Find any dua',
        body: 'Use the search bar on Tasbeeh or Goals to find a dua by transliteration or Arabic, then jump straight to it.',
      },
      duaDetail: {
        title: 'Full dua screen',
        body: 'Open a dua for the full view with references. Tap, double-tap, or hold anywhere to count — hold 3s to fill whatever remains.',
      },
      goals: {
        title: 'Goals & plans',
        body: 'On Goals, start a suggested plan, tap Surprise new goal for a random path, or Plan a new goal to pick your own duas and duration.',
      },
      goalDetail: {
        title: 'Count inside a goal',
        body: 'On a goal page, double-tap today’s dua to count toward that day. Hold 3s to finish the daily target. Swipe right anywhere to return to Goals.',
      },
      today: {
        title: 'Today dashboard',
        body: 'The Today tab shows your taps for the day, lifetime total, goal focus tiles, and an hourly activity chart.',
      },
      visualize: {
        title: 'Three ways to visualize',
        body: 'On Visualize, switch between Garden, Earth, and Cosmos. Lifetime dhikr grows trees, walks the world from Makkah, or lifts you into space.',
      },
      settings: {
        title: 'Tune your counter',
        body: 'In Settings, drag the count-per-tap dial or tap a preset, then pick theme, language, click sound, and haptics. Replay this tutorial anytime.',
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
  duaSearch: {
    placeholder: 'حرفی نقل یا عربی سے تلاش کریں',
    noResults: 'کوئی مماثل دعا نہیں ملی۔',
    unsupportedLanguageWarning:
      'اردو ترجمے سے تلاش سپورٹ نہیں — حرفی نقل یا عربی استعمال کریں۔',
    addToGoalHint: 'پہلے خالی دن میں شامل کرنے یا ترتیب سے بدلنے کے لیے نتیجہ پر ٹیپ کریں۔',
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
    salahDuas: 'نماز میں',
    reliefDuas: 'مصیبت اور راحت',
    remembranceDuas: 'حمد و ذکر',
    heartDuas: 'دل اور ایمان',
    dailyDuas: 'روزمرہ کی دعائیں',
    ramadanDuas: 'روزہ اور رمضان',
    notFound: 'دعا نہیں ملی۔',
    back: 'واپس',
    counterHint: 'شمار کے لیے دعا پر ٹیپ، دو بار ٹیپ، یا دبائیں',
    tapHint: (weight) => `شمار کے لیے ٹیپ، دو بار ٹیپ، یا دبائیں • ہر بار +${formatNumber(weight)}`,
    doubleTapHint: (weight) => `شمار کے لیے کہیں بھی دو بار ٹیپ کریں • ہر بار +${formatNumber(weight)}`,
    expandedCountHint: (weight) =>
      `شمار کے لیے دو بار ٹیپ کریں • 3 سیکنڈ دبائے رکھیں • ہر بار +${formatNumber(weight)}`,
    expandToCount: 'شمار کے لیے کھولیں',
    resetTitle: 'شمار کنندہ دوبارہ ترتیب دیں؟',
    resetBody: (title) => `${title} کا شمار 0 پر واپس کریں؟`,
    expand: 'دعا کھولیں',
    collapse: 'دعا بند کریں',
    onQuran: 'Quran.com پر',
    onSunnah: 'Sunnah.com پر',
    tileEyebrows: {
      quranic: 'قرآن سے',
      prayer: 'ہر نماز کے بعد',
      morning: 'اپنے دن کا آغاز',
      night: 'سونے سے پہلے',
      salah: 'اپنی نماز میں',
      relief: 'مشکل کے وقت',
      remembrance: 'اللہ کی حمد و ذکر',
      heart: 'محبت اور ثابت قدمی',
      daily: 'روزمرہ کے مواقع',
      ramadan: 'روزہ اور رمضان',
    },
    tileDescriptions: {
      quranic: 'قرآن میں سکھائی گئی دعائیں',
      prayer: 'ہر فرض نماز کے بعد پڑھیں',
      morning: 'صبح کا ذکر اور حفاظت',
      night: 'آرام سے پہلے شام کا ذکر',
      salah: 'نماز کے دوران پڑھی جانے والی',
      relief: 'مشکل میں اللہ کی طرف رجوع',
      remembrance: 'تسبیح، تحمید اور تکبیر',
      heart: 'ایمان، شکر اور مضبوط دل',
      daily: 'روزمرہ کے لمحات کی دعائیں',
      ramadan: 'روزہ اور بابرکت مہینہ',
    },
    tileDuaCount: (count) => `${formatNumber(count)} دعائیں`,
  },
  goals: {
    title: 'مقاصد',
    subtitle: 'ایک ہفتہ، دس دن، ایک ماہ کا عزم',
    yourPlans: 'آپ کے منصوبے',
    suggested: 'تجویز کردہ مقاصد',
    suggestedHint: 'وہ منصوبے جو آپ نے ابھی تک شروع نہیں کیے۔',
    empty: 'ابھی کوئی فعال منصوبہ نہیں — کوئی تجویز شدہ مقصد شروع کریں یا اپنا بنائیں۔',
    planNew: 'نیا مقصد بنائیں',
    planNewHint: 'اپنی مدت اور روزانہ ذکر',
    surpriseNewGoal: 'حیرت انگیز نیا مقصد',
    surpriseNewGoalHint: 'بے ترتیب منصوبہ · 1–30 دن',
    todayLabel: 'آج',
    dayProgress: (current, total, done) =>
      `دن ${formatNumber(current)}/${formatNumber(total)} · ${formatNumber(done)} مکمل`,
    durationDays: (days) => `${formatNumber(days)} دن`,
    goalLibrary: {
      title: 'مقاصد کی فہرست',
      hint: 'ہر منصوبے میں دنوں کے لیے دعائیں اور تسبیح بے ترتیب ترتیب دی جاتی ہیں۔',
      oneDay: 'ایک دن کے مقاصد',
      weekly: 'ہفتہ وار مقاصد',
      thirtyDay: '30 دن کے مقاصد',
      ayyamBeed: 'ایامِ بیض',
      newMoon: 'چاندِ نو کے مقاصد',
    },
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
    customDescription: 'دعائیں منتخب کریں، دن ہٹائیں، اور خالی جگہ تلاش سے بھریں۔',
    shuffle: 'روزانہ تسبیح بے ترتیب کریں',
    goalNameLabel: 'مقصد کا نام',
    goalNamePlaceholder: 'میرا ذاتی ذکر منصوبہ',
    emptySlot: 'خالی دن — دعا تلاش کر کے شامل کریں',
    removeDay: 'دعا ہٹائیں',
    saveGoal: 'مقصد محفوظ کریں',
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
  badges: {
    title: 'تمغے',
    progress: (earned, total) => `${formatNumber(total)} میں سے ${formatNumber(earned)} تمغے حاصل`,
    revealHint: 'اگلے دس تمغے دیکھنے کے لیے موجودہ دس تمغے حاصل کریں۔',
    earnedCount: (count) => `${formatNumber(count)} تمغے حاصل`,
    empty: 'پہلا تمغہ حاصل کرنے کے لیے تسبیح مکمل کریں یا کوئی ہدف پورا کریں۔',
    viewEarned: 'حاصل شدہ تمغے',
    viewAll: 'تمام تمغے',
    earnedTitle: 'حاصل شدہ تمغے',
    allTitle: 'تمام تمغے',
    none: 'ابھی کوئی تمغہ نہیں — اپنا پہلا تمغہ کھولنے کے لیے شمار شروع کریں۔',
    lockedLabel: 'بند',
    earnedLabel: 'حاصل',
    setDivider: (n) => `${formatNumber(n)} / 20 سیٹ`,
    unlockTitle: 'نیا تمغہ حاصل ہوا!',
    unlockCta: 'جاری رکھیں',
    names: {
      bead: { first: 'پہلا دانہ', tiered: 'دانوں کا امین' },
      praise: { first: 'سو تسبیحات', tiered: 'روزانہ حمد' },
      rays: { first: 'نور کا ہفتہ', tiered: 'نور کے دن' },
      moon: { first: 'پورا چاند', tiered: 'چاندنی تسلسل' },
      fruit: { first: 'پہلا پھل', tiered: 'فصل' },
      plant: { first: 'باغبان', tiered: 'باغبان' },
      dawn: { first: 'سحر کا ذاکر', tiered: 'سحر کا ذاکر' },
      lantern: { first: 'شب کی قندیل', tiered: 'شب کی قندیل' },
      burst: { first: 'ہزار چراغ', tiered: 'چراغوں کا سمندر' },
      compass: { first: 'مسافر', tiered: 'مسافر' },
    },
    descriptions: {
      tasbeehs: (n) => (n === 1 ? 'اپنی پہلی تسبیح مکمل کریں' : `${formatNumber(n)} تسبیحات مکمل کریں`),
      bestDay: (n) => `ایک دن میں ${formatNumber(n)} ذکر شمار کریں`,
      activeDays: (n) => `${formatNumber(n)} دنوں میں ذکر کریں`,
      bestStreak: (n) => `${formatNumber(n)} دن کا تسلسل برقرار رکھیں`,
      goalsCompleted: (n) => (n === 1 ? 'اپنا پہلا ہدف مکمل کریں' : `${formatNumber(n)} اہداف مکمل کریں`),
      goalDays: (n) => `${formatNumber(n)} ہدف دنوں کے نشانے پورے کریں`,
      morningDays: (n) => `${formatNumber(n)} دن صبح کے اذکار`,
      eveningDays: (n) => `${formatNumber(n)} راتیں شام کے اذکار`,
      lifetime: (n) => `کل ${formatNumber(n)} شمار تک پہنچیں`,
      distinctDuas: (n) => `${formatNumber(n)} مختلف دعائیں پڑھیں`,
    },
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
    yourGarden: 'آپ کا باغ',
    todaysGrowth: 'آج کی نشوونما',
    dhikrWord: 'ذکر',
    ofGoal: 'ہدف کا',
  },
  journey: {
    modeGarden: 'باغ',
    modeEarth: 'زمین',
    modeSpace: 'کائنات',
    yourEarth: 'آپ کی زمین',
    yourCosmos: 'آپ کی کائنات',
    earthLabel: 'مکہ سے پیدل سفر',
    spaceLabel: 'مکہ سے بلندی کی طرف',
    walked: 'آپ چل چکے ہیں',
    risen: 'آپ بلند ہو چکے ہیں',
    fromMakkah: 'مکہ سے روانگی',
    begin: 'مکہ سے روانہ ہونے کے لیے ذکر شروع کریں',
    reached: (label) => `آپ ${label} پہنچ گئے`,
    remainingTo: (distance, label) => `${label} تک ${distance} باقی`,
    inDhikr: (time) => `≈ ذکر میں ${time}`,
    units: { m: 'میٹر', km: 'کلومیٹر', million: 'ملین کلومیٹر' },
    duration: {
      days: (n) => `${formatNumber(n)} دن`,
      hours: (n) => `${formatNumber(n)} گھنٹے`,
      minutes: (n) => `${formatNumber(n)} منٹ`,
      seconds: (n) => `${formatNumber(n)} سیکنڈ`,
    },
    earthMilestones: {
      madinah: 'مدینہ',
      quds: 'القدس',
      istanbul: 'استنبول',
      delhi: 'دہلی',
      cordoba: 'قرطبہ',
      jakarta: 'جکارتہ',
      newYork: 'نیویارک',
      aroundEarth: 'پوری زمین کا چکر',
    },
    spaceMilestones: {
      atmosphere: 'فضا کا کنارہ',
      lowOrbit: 'نچلا مدار',
      geoOrbit: 'جیو سٹیشنری مدار',
      moon: 'چاند',
      mars: 'مریخ',
      sun: 'سورج',
    },
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
    restartTitle: 'دوبارہ شروع کرنا ضروری ہے',
    restartBody:
      'ترتیب کی پرانی سمت صاف کرنے کے لیے ایپ کو ایک بار مکمل بند کر کے دوبارہ کھولیں۔ اس کے بعد اردو متن دائیں سے شروع ہونا چاہیے۔',
    restartAction: 'ابھی دوبارہ لوڈ کریں',
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
    fadedGold: {
      name: 'مدھم سونا',
      description: 'دھوپ میں پھیکا شیمپین — گندم جیسے نرم رنگ اور پرسکون روحانی گرمجوشی۔',
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
        body: 'تسبیح، روزانہ مقاصد، اور ذکر کے بصری سفر کے لیے ایک پرسکون شمار کنندہ۔ یہ مختصر تعارف براؤزنگ، شمار، اور منصوبہ بندی سکھاتا ہے۔',
      },
      categories: {
        title: 'زمرے کے لحاظ سے براؤز کریں',
        body: 'تسبیح میں زمرے کی ٹائل پر ٹیپ کریں — قرآنی، صبح و شام کے اذکار، نماز، اور مزید — اس کی دعاؤں کی فہرست کھولنے کے لیے۔',
      },
      expand: {
        title: 'دعا کھولیں',
        body: 'زمرے کے اندر، دعا کے پاس والے تیر پر ٹیپ کر کے اسے کھولیں۔ شمار صرف کھلی ہوئی صف پر ہوتا ہے۔',
      },
      count: {
        title: 'اپنے ہدف کی طرف شمار',
        body: 'کھلی دعا پر دو بار ٹیپ کر کے شمار بڑھائیں۔ ہدف کی طرف ترقی کی پٹی بھرتی ہے — باقی ایک ساتھ مکمل کرنے کے لیے 3 سیکنڈ دبائے رکھیں۔',
      },
      search: {
        title: 'کوئی بھی دعا تلاش کریں',
        body: 'تسبیح یا مقاصد میں تلاش بار سے حرفی نقل یا عربی سے دعا ڈھونڈیں، پھر سیدھے اس پر جائیں۔',
      },
      duaDetail: {
        title: 'مکمل دعا اسکرین',
        body: 'حوالوں کے ساتھ مکمل منظر کے لیے دعا کھولیں۔ شمار کے لیے کہیں بھی ٹیپ، دو بار ٹیپ، یا دبائیں — باقی بھرنے کے لیے 3 سیکنڈ دبائے رکھیں۔',
      },
      goals: {
        title: 'مقاصد اور منصوبے',
        body: 'مقاصد میں تجویز شدہ منصوبہ شروع کریں، حیرت انگیز نیا مقصد سے بے ترتیب راستہ بنائیں، یا نیا مقصد بنائیں سے اپنی دعائیں اور مدت منتخب کریں۔',
      },
      goalDetail: {
        title: 'مقصد میں شمار',
        body: 'مقصد کے صفحے پر آج کی دعا پر دو بار ٹیپ کر کے اس دن کا شمار بڑھائیں۔ روزانہ ہدف مکمل کرنے کے لیے 3 سیکنڈ دبائیں۔ مقاصد پر واپس جانے کے لیے دائیں سوائپ کریں۔',
      },
      today: {
        title: 'آج کا ڈیش بورڈ',
        body: 'آج کا ٹیب دن کے ٹیپ، کُل شمار، مقصد کی ٹائلیں، اور گھنٹہ وار سرگرمی دکھاتا ہے۔',
      },
      visualize: {
        title: 'تین طریقے تصور کے',
        body: 'تصور میں باغ، زمین، اور کائنات کے درمیان بدلیں۔ کُل ذکر درخت اگاتا ہے، مکہ سے دنیا میں چلتا ہے، یا خلاء میں بلند کرتا ہے۔',
      },
      settings: {
        title: 'شمار کنندہ کی ترتیب',
        body: 'ترتیبات میں فی ٹیپ ڈائل گھمائیں یا پیش سیٹ پر ٹیپ کریں، پھر تھیم، زبان، آواز، اور لرزش منتخب کریں۔ یہ تعارف کبھی بھی دوبارہ چلائیں۔',
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
