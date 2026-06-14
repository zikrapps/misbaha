import { DuaRecord } from '@/src/types/misbaha';

/** Timeline-only supplications (not shown on Tasbeeh screen). All are time-of-day specific in Bukhari/Muslim. */
export const dayTimelineDuas: DuaRecord[] = [
  {
    id: 'timeline-morning-remembrance',
    title: 'Morning Remembrance',
    transliteration: 'Asbahna wa asbahal-mulku lillah',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌَ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا اليَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا اليَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الكَسَلِ وَسُؤِ الكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي القَبْرِ،',
    translation:
      'When the Prophet entered the morning he said: We have reached the morning and the whole kingdom of Allah has reached the morning. Praise is due to Allah. There is no god but Allah alone, without partner. My Lord, I ask You for the good of this day and the good that follows it, and I seek refuge in You from the evil of this day and the evil that follows it. My Lord, I seek refuge in You from laziness, the misery of old age, torment in the Fire and torment in the grave.',
    target: 1,
    category: 'morning',
    hadithReference: 'Sahih Muslim 2723a',
    hadithUrl: 'https://sunnah.com/muslim:2723a',
  },
  {
    id: 'timeline-evening-remembrance',
    title: 'Evening Remembrance',
    transliteration: 'Amsayna wa amsal-mulku lillah',
    arabic: 'أَمْسَيْنَا وَأَمْسَى المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌَ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الكَسَلِ وَسُؤِ الكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي القَبْرِ،',
    translation:
      'When the Prophet entered the evening he said: We have entered upon evening and the whole kingdom of Allah has entered upon evening. Praise is due to Allah. There is no god but Allah alone, without partner. My Lord, I ask You for the good of this night and I seek refuge in You from the evil of this night and the evil that follows it. My Lord, I seek refuge in You from laziness, the misery of old age, torment in the Fire and torment in the grave.',
    target: 1,
    category: 'morning',
    hadithReference: 'Sahih Muslim 2723a',
    hadithUrl: 'https://sunnah.com/muslim:2723a',
  },
  {
    id: 'timeline-morning-wake-praise',
    title: 'Upon Waking',
    transliteration: 'Alhamdu lillahil-ladhi ahyana',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَنَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النَّشُورُ،',
    translation:
      'When the Prophet woke up in the morning he said: All praise is due to Allah who revived us after He caused us to die, and to Him is the resurrection.',
    target: 1,
    category: 'morning',
    hadithReference: 'Sahih al-Bukhari 6325',
    hadithUrl: 'https://sunnah.com/bukhari:6325',
  },
  {
    id: 'timeline-comprehensive-tasbih',
    title: 'Tasbih After Fajr',
    transliteration: 'Subhan Allahi wa bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ،',
    translation:
      'After Fajr the Prophet said four words three times: Glory be to Allah and praise is due to Him, by the number of His creation, by His pleasure, by the weight of His Throne, and by the ink of His words.',
    target: 3,
    category: 'morning',
    hadithReference: 'Sahih Muslim 2726a',
    hadithUrl: 'https://sunnah.com/muslim:2726a',
  },
  {
    id: 'timeline-after-prayer',
    title: 'After Salah',
    transliteration: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الجَلَالِ وَالإِكْرَامِ،',
    translation:
      'When the Messenger of Allah finished his prayer he sought forgiveness three times and said: O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Glory and Honour.',
    target: 1,
    category: 'salah',
    hadithReference: 'Sahih Muslim 591',
    hadithUrl: 'https://sunnah.com/muslim:591',
  },
  {
    id: 'timeline-bedtime-surrender',
    title: 'At Bedtime',
    transliteration: 'Allahumma aslamtu wajhi ilayk',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَىَ مِنْكَ إِلَٗا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيَّكَ الَّذِي أَرْسَلْتَ،',
    translation:
      'When going to bed the Prophet said: O Allah, I surrender myself to You, entrust my affairs to You, and rely on You in hope and fear. There is no refuge and no escape from You except to You. I believe in Your Book which You revealed and in Your Prophet whom You sent.',
    target: 1,
    category: 'night',
    hadithReference: 'Sahih al-Bukhari 6311',
    hadithUrl: 'https://sunnah.com/bukhari:6311',
  },
  {
    id: 'timeline-tahajjud-opening',
    title: 'Opening of Tahajjud',
    transliteration: 'Allahumma laka al-hamd',
    arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ وَلَكَ الْحَمْدُ، لَكَ مُلْكُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَوَاتِ وَالأَرْضِ، وَلَكَ الْحَمْدُ أَنْتَ الْحَقُّ، وَوَعْدُكَ الْحَقُّ، وَلِقَاؤُكَ حَقٌّ، وَقَوْلُكَ حَقٌّ، وَالْجَنَّةُ حَقٌّ، وَالنَّارُ حَقٌّ، وَالنَّبِيُّونَ حَقٌّ، وَمُحَمَّدٌ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ حَقٌّ، وَالسَّاعَةُ حَقٌّ، اللَّهُمَّ لَكَ أَسْلَمْتُ، وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ، وَإِلَيْكَ أَنَبْتُ، وَبِكَ خَاصَمْتُ، وَإِلَيْكَ حَاكَمْتُ، فَاغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، أَنْتَ المُقَدِّمُ وَأَنْتَ المُؤَخِّرُ، لَا إِلَهَ إِلَٗا أَنْتَ',
    translation:
      'When the Prophet stood for night prayer (tahajjud) he would say: O Allah, all praise is due to You. You are the Maintainer of the heavens and the earth and all that is in them. To You belongs all praise. You are the Light of the heavens and the earth. O Allah, I surrender to You; I believe in You and depend on You. Forgive me my previous and future sins, what I conceal and what I reveal. There is no deity except You.',
    target: 1,
    category: 'night',
    hadithReference: 'Sahih al-Bukhari 1120',
    hadithUrl: 'https://sunnah.com/bukhari:1120',
  },
  {
    id: 'timeline-baqarah-closing',
    title: 'Protection of the Night',
    transliteration: 'Amana ar-rasoolu',
    arabic: 'آمَنَ الرَّسُلُ بِمَا أُنْزِلَ عَلَى رَبِّهِ وَالمُؤْمِنونَ كُلٌّ آمَنَ بِاللَّهِ وَملَائِكَتِهِ، لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَٗا وُسْعَهَا، رَبِّنَا لَا تُؤاخِذْنَا إِنْ نَسِنَا أَوْ أَخْطَأْنَا، رَبِّنَا لَا تُحْمِلْنَا وَاغْفِرْ لَنَا وَارْحَمْنَا، أَنْتَ مَوْلَانَا، فَانْصُرْنَا عَلَى القَوْمِ الكَافِرِينَ،',
    translation:
      'Whoever recites the last two verses of Surah al-Baqarah at night, they will suffice him. The Messenger has believed in what was revealed to him from his Lord, and so have the believers. Allah does not burden a soul beyond that it can bear. Our Lord, forgive us and have mercy upon us. You are our Protector.',
    target: 1,
    category: 'quranic',
    hadithReference: 'Sahih al-Bukhari 5009',
    hadithUrl: 'https://sunnah.com/bukhari:5009',
    quranReference: 'Quran 2:285–286',
    quranUrl: 'https://quran.com/2/285-286',
  },];

export const dayTimelineDuasById = Object.fromEntries(dayTimelineDuas.map((dua) => [dua.id, dua])) as Record<string, DuaRecord>;
