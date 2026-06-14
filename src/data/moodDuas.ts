import { DuaRecord } from '@/src/types/misbaha';

/** Supplications from Sahih al-Bukhari and Sahih Muslim, sourced via sunnah.com. */
export const moodDuas: DuaRecord[] = [
  {
    id: 'mood-happy',
    title: 'Praise Upon Waking',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    translation:
      'All praise is for Allah who gave us life after having taken it from us, and to Him is the resurrection.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 6314',
    hadithUrl: 'https://sunnah.com/bukhari:6314',
    hadithNarration:
      'Hudhaifa reported that when the Prophet (ﷺ) went to bed at night he would say, "O Allah, in Your name I die and I live," and when he woke he would say, "All praise is for Allah who gave us life after having taken it from us, and to Him is the resurrection."',
  },
  {
    id: 'mood-sad',
    title: 'Relief From Grief',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    translation:
      'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, from being heavily in debt, and from being overpowered by men.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 6369',
    hadithUrl: 'https://sunnah.com/bukhari:6369',
    hadithNarration:
      'Anas bin Malik reported that the Prophet (ﷺ) used to say, "O Allah! I seek refuge with You from worry and grief, from incapacity and laziness, from cowardice and miserliness, from being heavily in debt and from being overpowered by (other) men."',
  },
  {
    id: 'mood-thankful',
    title: 'Praise After Eating',
    transliteration: 'Alhamdu lillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    translation: 'All praise is for Allah.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2734a',
    hadithUrl: 'https://sunnah.com/muslim:2734',
    hadithNarration:
      'Anas b. Malik reported that Allah\'s Messenger (ﷺ) said: Allah is pleased with His servant who says Al-Hamdu lillah while taking a morsel of food and while drinking.',
  },
  {
    id: 'mood-stressed',
    title: 'At a Time of Distress',
    transliteration: 'La ilaha illallahul-azimul-halim',
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    translation:
      'There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne. There is no god but Allah, Lord of the heavens and the earth, and Lord of the Noble Throne.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2730a',
    hadithUrl: 'https://sunnah.com/muslim:2730',
    hadithNarration:
      'Ibn \'Abbas reported that Allah\'s Apostle (ﷺ) used to supplicate during the time of trouble with these words.',
  },
  {
    id: 'mood-grateful',
    title: 'Praise Beyond Counting',
    transliteration: 'Subhanallahi wa bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
    translation:
      'How perfect Allah is and I praise Him by the number of His creation, by His pleasure, by the weight of His throne, and by the ink of His words.',
    target: 3,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2726a',
    hadithUrl: 'https://sunnah.com/muslim:2726',
    hadithNarration:
      'Juwairiya reported that the Prophet (ﷺ) said he recited these four words three times after leaving her, and if weighed against what she had recited since morning they would outweigh them.',
  },
  {
    id: 'mood-amazed',
    title: 'The Best Words',
    transliteration: 'Subhanallahi wa bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    translation: 'How perfect Allah is and I praise Him.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2731a',
    hadithUrl: 'https://sunnah.com/muslim:2731',
    hadithNarration:
      'Abu Dharr reported that Allah\'s Messenger (ﷺ) was asked which words were the best. He said: "Those for which Allah made a choice for His angels and His servants: Hallowed be Allah and praise is due to Him."',
  },
  {
    id: 'mood-ecstatic',
    title: 'Takbeer of Joy',
    transliteration: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    translation: 'Allah is the Greatest.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 6384',
    hadithUrl: 'https://sunnah.com/bukhari:6384',
    hadithNarration:
      'Abu Musa reported that on a journey, whenever they ascended a high place they used to say Takbir in a loud voice. The Prophet (ﷺ) said, "Be kind to yourselves, for you are calling upon an All-Hearer and an All-Seer."',
  },
  {
    id: 'mood-hopeful',
    title: 'Guide Me to the Truth',
    transliteration: 'Allahumma Rabba Jibreela wa Mika\'eela wa Israfeel',
    arabic:
      'اللَّهُمَّ رَبَّ جِبْرَائِيلَ وَمِيكَائِيلَ وَإِسْرَافِيلَ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ أَنْتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِيمَا كَانُوا فِيهِ يَخْتَلِفُونَ اهْدِنِي لِمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ بِإِذْنِكَ إِنَّكَ تَهْدِي مَنْ تَشَاءُ إِلَى صِرَاطٍ مُسْتَقِيمٍ',
    translation:
      'O Allah, Lord of Jibreel, Mikaeel, and Israfeel, Originator of the heavens and the earth, Knower of the unseen and the seen, You judge between Your servants concerning that in which they differ. Guide me to the truth concerning that about which there is disagreement, by Your permission. Indeed, You guide whom You will to a straight path.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 770',
    hadithUrl: 'https://sunnah.com/muslim:770',
    hadithNarration:
      '\'A\'isha reported that when the Messenger of Allah (ﷺ) got up at night to pray, he would commence his prayer with this supplication.',
  },
  {
    id: 'mood-anxious',
    title: 'Refuge in Perfect Words',
    transliteration: 'A\'udhu bi kalimatillahit-tammati min kulli shaytanin wa hammah',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    translation:
      'I seek refuge in the perfect words of Allah from every devil and poisonous pest, and from every evil, envious eye.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 3371',
    hadithUrl: 'https://sunnah.com/bukhari:3371',
    hadithNarration:
      'Ibn \'Abbas reported that the Prophet (ﷺ) used to seek refuge with Allah for Al-Hasan and Al-Husain, saying that Ibrahim used to seek refuge with these words for Isma\'il and Ishaq.',
  },
  {
    id: 'mood-fearful',
    title: 'Refuge From Cowardice',
    transliteration: 'Allahumma inni a\'udhu bika minal-jubn',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ',
    translation:
      'O Allah, I seek refuge in You from cowardice, from being returned to the worst stage of old age, from the trials of this world, and from the punishment of the grave.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 2822',
    hadithUrl: 'https://sunnah.com/bukhari:2822',
    hadithNarration:
      'Sa\'d used to teach his sons that Allah\'s Messenger (ﷺ) used to seek refuge with these words at the end of every prayer.',
  },
  {
    id: 'mood-angry',
    title: 'Refuge From Satan',
    transliteration: 'A\'udhu billahi min ash-shaytan',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ',
    translation: 'I seek refuge in Allah from Satan.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 3282',
    hadithUrl: 'https://sunnah.com/bukhari:3282',
    hadithNarration:
      'While Sulaiman bin Surd was sitting with the Prophet (ﷺ), two men abused each other until one became furious. The Prophet (ﷺ) said, "I know a word which, if he says it, all his anger will go away: I seek refuge in Allah from Satan."',
  },
  {
    id: 'mood-lonely',
    title: 'I Surrender to You',
    transliteration: 'Allahumma laka aslamtu wa bika amantu',
    arabic:
      'اللَّهُمَّ لَكَ أَسْلَمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَإِلَيْكَ أَنَبْتُ وَبِكَ خَاصَمْتُ اللَّهُمَّ إِنِّي أَعُوذُ بِعِزَّتِكَ لَا إِلَهَ إِلَّا أَنْتَ أَنْ تُضِلَّنِي أَنْتَ الْحَيُّ الَّذِي لَا يَمُوتُ وَالْجِنُّ وَالْإِنْسُ يَمُوتُونَ',
    translation:
      'O Allah, unto You I surrender myself. I affirm my faith in You and repose my trust in You and turn to You in repentance. With Your help I fought my adversaries. O Allah, I seek refuge in You with Your Power; there is no god but You, lest You lead me astray. You are the Ever-Living Who does not die, while the jinn and mankind die.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2717',
    hadithUrl: 'https://sunnah.com/muslim:2717',
    hadithNarration:
      'Ibn \'Abbas reported that Allah\'s Messenger (ﷺ) used to say this supplication.',
  },
  {
    id: 'mood-overwhelmed',
    title: 'No Might Except by Allah',
    transliteration: 'La hawla wa la quwwata illa billah',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    translation: 'There is no might nor power except with Allah.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 6384',
    hadithUrl: 'https://sunnah.com/bukhari:6384',
    hadithNarration:
      'Abu Musa reported that the Prophet (ﷺ) came to him while he was reciting "La hawla wa la quwwata illa billah" silently and said, "Say it, for it is one of the treasures of Paradise."',
  },
  {
    id: 'mood-regretful',
    title: 'The Master Supplication for Forgiveness',
    transliteration: 'Allahumma anta Rabbi la ilaha illa anta',
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    translation:
      'O Allah, You are my Lord, there is none worthy of worship except You. You created me and I am Your servant, and I am faithful to Your covenant and promise as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessings upon me and I admit my sins, so forgive me, for none forgives sins except You.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 6306',
    hadithUrl: 'https://sunnah.com/bukhari:6306',
    hadithNarration:
      'Shaddad bin Aus reported that the Prophet (ﷺ) said this is the most superior way of asking for forgiveness from Allah, and whoever recites it during the day or night with firm faith and dies before the next period will be among the people of Paradise.',
  },
  {
    id: 'mood-patient',
    title: 'At a Time of Calamity',
    transliteration: 'Inna lillahi wa inna ilayhi raji\'un',
    arabic:
      'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
    translation:
      'Indeed, to Allah we belong and to Him we shall return. O Allah, reward me for my affliction and replace it for me with something better.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 918a',
    hadithUrl: 'https://sunnah.com/muslim:918',
    hadithNarration:
      'Umm Salama reported that the Messenger of Allah (ﷺ) said: If any Muslim who suffers some calamity says what Allah has commanded him, Allah will give him something better than it in exchange.',
  },
  {
    id: 'mood-peaceful',
    title: 'You Are Peace',
    transliteration: 'Allahumma antas-salamu wa minkas-salam',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ',
    translation: 'O Allah, You are Peace, and from You comes peace. Blessed are You, O Possessor of Glory and Honour.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 591',
    hadithUrl: 'https://sunnah.com/muslim:591',
    hadithNarration:
      'Thauban reported that when the Messenger of Allah (ﷺ) finished his prayer he begged forgiveness three times and said this supplication.',
  },
  {
    id: 'mood-weary',
    title: 'Dhikr Before Sleep',
    transliteration: 'Allahu Akbar, Subhan Allah, Alhamdu lillah',
    arabic:
      'اللَّهُ أَكْبَرُ (٣٤) سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣)',
    translation:
      'Allah is the Greatest (34 times), Glory be to Allah (33 times), All praise is for Allah (33 times).',
    target: 100,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2727a',
    hadithUrl: 'https://sunnah.com/muslim:2727',
    hadithNarration:
      'The Prophet (ﷺ) taught \'Ali and Fatima that when they go to bed they should say Takbir thirty-four times, Tasbih thirty-three times, and Tahmid thirty-three times — better for them than a servant.',
  },
  {
    id: 'mood-joyful',
    title: 'Set Right All My Affairs',
    transliteration: 'Allahumma aslih li dini wa dunyaya wa akhirati',
    arabic:
      'اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
    translation:
      'O Allah, set right for me my religion which is the safeguard of my affairs. Set right for me the affairs of my world wherein is my living. Set right for me my Hereafter on which depends my after-life. Make life for me a source of abundance for every good and make my death a source of comfort protecting me against every evil.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2720',
    hadithUrl: 'https://sunnah.com/muslim:2720',
    hadithNarration:
      'Abu Huraira reported that Allah\'s Messenger (ﷺ) used to supplicate with these words.',
  },
  {
    id: 'mood-loving',
    title: 'Send Blessings Upon the Prophet',
    transliteration: 'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammad',
    arabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translation:
      'O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.',
    target: 1,
    category: 'mood',
    hadithReference: 'Sahih al-Bukhari 6357',
    hadithUrl: 'https://sunnah.com/bukhari:6357',
    hadithNarration:
      'Ka\'b bin \'Ujra met \'Abdur-Rahman bin Abi Laila and said the companions asked the Prophet (ﷺ) how to send Salat upon him, and he taught them this supplication.',
  },
  {
    id: 'mood-humble',
    title: 'Seeking Forgiveness',
    transliteration: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    translation: 'I seek forgiveness from Allah.',
    target: 100,
    category: 'mood',
    hadithReference: 'Sahih Muslim 2702a',
    hadithUrl: 'https://sunnah.com/muslim:2702',
    hadithNarration:
      'Al-Agharr al-Muzani reported that Allah\'s Messenger (ﷺ) said: There is at times some sort of shade upon my heart, and I seek forgiveness from Allah a hundred times a day.',
  },
];
