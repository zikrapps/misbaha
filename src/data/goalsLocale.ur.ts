export type GoalLocaleFields = {
  title: string;
  description: string;
};

export const goalsLocaleUr: Record<string, GoalLocaleFields> = {
  'daily-goal': {
    title: 'روزانہ تسبیح',
    description: 'آج سبحان اللہ مکمل کرنے کا روزانہ مقصد۔',
  },
  'preset-tasbih-fatimah': {
    title: 'تسبیح فاطمہؓ',
    description: 'فاطمہؓ کو سکھائی گئی رات کی یاد کے ایک ہفتے کا سلسلہ۔',
  },
  'preset-repentance': {
    title: 'توبہ کا راستہ',
    description: 'دس دن استغفار، تحلیل اور قرآنی دعاؤں پر مرکوز۔',
  },
  'preset-dhul-hijjah': {
    title: 'ذوالحجہ کے پہلے دس دن',
    description:
      'برکت والے پہلے دس دن: تسبیح، تحمید، تکبیر، تحلیل، استغفار، درود اور قرآنی دعائیں — عرفہ کے دن پر عروج۔',
  },
  'preset-garden': {
    title: 'باغ',
    description: 'تیس دن مختلف تسبیح، درود اور ربّنا دعاؤں کا سلسلہ۔',
  },
  'suggest-rabbana-week': {
    title: 'ربّنا ہفتہ',
    description: 'سات دن قرآنی ربّنا دعاؤں کے ساتھ ذکر۔',
  },
  'suggest-morning-adhkar': {
    title: 'اذکارِ صبح',
    description: 'دس دن صبح و شام کے اذکار۔',
  },
  'suggest-salawat-sprint': {
    title: 'درود کا سلسلہ',
    description: 'درود اور تحلیل پر مرکوز ایک ہفتہ۔',
  },
};
