/**
 * Generates src/data/duasArabic.ur.ts (Indo-Pak Arabic for Urdu locale).
 * Run: node scripts/generateDuasArabicUr.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const ADHKAR_INDOPAK = {
  'fajr-subhanallah': 'سُبْحَانَ اللّٰهِ',
  'fajr-alhamdulillah': 'الْحَمْدُ لِلّٰهِ',
  'dhuhr-allahuakbar': 'اللّٰهُ اَكْبَرُ',
  'asr-la-ilaha': 'لَاۤ اِلٰهَ اِلَّا اللّٰهُ',
  'maghrib-astaghfirullah': 'اَسْتَغْفِرُ اللّٰهَ',
  'isha-salat-nabi':
    'اللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَّعَلٰٓى اٰلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلٰٓى اٰلِ اِبْرَاهِيْمَ اِنَّكَ حَمِيْدٌ مَّجِيْدٌؕ اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَّعَلٰٓى اٰلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلٰٓى اٰلِ اِبْرَاهِيْمَ اِنَّكَ حَمِيْدٌ مَّجِيْدٌ',
  'prayer-refuge-cowardice-bukhari':
    'اللّٰهُمَّ اِنِّیْۤ اَعُوْذُ بِكَ مِنَ الْجُبْنِۙ وَاَعُوْذُ بِكَ مِنَ الْبُخْلِۙ وَاَعُوْذُ بِكَ مِنْ اَنْ اُرَدَّ اِلٰٓى اَرْذَلِ الْعُمُرِۙ وَاَعُوْذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ',
  'prayer-refuge-fire-tirmidhi':
    'اللّٰهُمَّ اِنِّیْۤ اَعُوْذُ بِكَ مِنْ فِتْنَةِ النَّارِ وَعَذَابِ النَّارِۙ وَعَذَابِ الْقَبْرِ وَفِتْنَةِ الْقَبْرِۙ وَمِنْ شَرِّ فِتْنَةِ الْغِنٰى وَمِنْ شَرِّ فِتْنَةِ الْفَقْرِۙ وَمِنْ شَرِّ فِتْنَةِ الْمَسِیْحِ الدَّجَّالِؕ اَللّٰهُمَّ اغْسِلْ خَطَايَاىَ بِمَاۤءِ الثَّلْجِ وَالْبَرَدِۙ وَنَقِّ قَلْبِیْ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْاَبْيَضَ مِنَ الدَّنَسِۙ وَبَاعِدْ بَيْنِیْ وَبَيْنَ خَطَايَاىَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِؕ اَللّٰهُمَّ اِنِّیْۤ اَعُوْذُ بِكَ مِنَ الْكَسَلِ وَالْهَرَمِ وَالْمَاْثَمِ وَالْمَغْرَمِ',
  'morning-sayyidul-istighfar':
    'اللّٰهُمَّ اَنْتَ رَبِّیْ لَاۤ اِلٰهَ اِلَّاۤ اَنْتَۚ خَلَقْتَنِیْ وَاَنَا عَبْدُكَۚ وَاَنَا عَلٰى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُۚ اَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُۚ اَبُوْۘئُ لَكَ بِنِعْمَتِكَ عَلَیَّ وَاَبُوْۘئُ لَكَ بِذَنْبِیْۚ فَاغْفِرْ لِیْ فَاِنَّهٗ لَا یَغْفِرُ الذُّنُوْبَ اِلَّاۤ اَنْتَ',
  'morning-hasbiyallah':
    'حَسْبِیَ اللّٰهُ لَاۤ اِلٰهَ اِلَّا هُوَ ؕ عَلَیۡهِ تَوَكَّلۡتُ​ ؕ وَهُوَ رَبُّ الۡعَرۡشِ الۡعَظِیۡمِ',
  'night-bismika': 'بِاسْمِكَ اللّٰهُمَّ اَمُوْتُ وَاَحْیَا',
  'night-ayat-kursi': null, // filled from 2:255
};

const MULTI_DUA_INDOPAK = {
  'rabbana-la-tuakhidhna': 'رَبَّنَا لَا تُؤَاخِذْنَاۤ اِنْ نَّسِيْنَاۤ اَوْ اَخْطَاْنَا',
  'rabbana-la-tahmil-isran':
    'رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَاۤ اِصْرًا كَمَا حَمَلْتَهٗ عَلَى الَّذِيْنَ مِنْ قَبْلِنَا',
  'rabbana-la-tuhammilna':
    'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهٖۚ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَاۚ اَنْتَ مَوْلٰىنَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكٰفِرِيْنَ',
};

function normalize(s) {
  return s
    .replace(/[\u0640\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u200B-\u200D\uFEFF]/g, '')
    .replace(/[ۚۖۗۘۙۛٱ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/ء/g, '')
    .replace(/[^\u0621-\u064A\u0660-\u0669]/g, '');
}

function charOffsetForNormIndex(text, normIndex) {
  let normPos = 0;
  for (let i = 0; i < text.length; i++) {
    if (normPos === normIndex) return i;
    normPos += normalize(text[i]).length;
  }
  return text.length;
}

function trimToDuaStart(text) {
  const nText = normalize(text);
  for (const anchor of ['ربنا', 'رب']) {
    const idx = nText.indexOf(anchor);
    if (idx >= 0) return text.slice(charOffsetForNormIndex(text, idx)).trim();
  }
  for (const pattern of ['اللّٰهُمَّ', 'اللّٰهُ', 'اللّٰه', 'ٱللَّهُ', 'اللَّه']) {
    const idx = text.indexOf(pattern);
    if (idx >= 0) return text.slice(idx).trim();
  }
  return text.trim();
}

function trimAllahResponse(text) {
  const markers = [' ۖ قَالَ ', ' قَالَ وَمَن ', ' قَالَ يَـٰٓأَتُهَا ', 'ؕ قَالَ '];
  let cut = text.length;
  for (const marker of markers) {
    const idx = text.indexOf(marker);
    if (idx > 20) cut = Math.min(cut, idx);
  }
  return text.slice(0, cut).trim();
}

function clipAtNextDua(text, throughEnd = false) {
  const trimmed = trimAllahResponse(trimToDuaStart(text));
  if (throughEnd) return trimmed;
  const next = trimmed.slice(10).search(/\s(?:رَبَّنَا|رَبِّ|رَبّ)\s/);
  if (next >= 0) return trimmed.slice(0, 10 + next).trim();
  return trimmed;
}

function refToKeys(ref) {
  const m = ref.match(/Quran (\d+):([\d-]+)/);
  if (!m) return [];
  const surah = m[1];
  const part = m[2];
  if (part.includes('-')) {
    const [a, b] = part.split('-').map(Number);
    return Array.from({ length: b - a + 1 }, (_, i) => `${surah}:${a + i}`);
  }
  return [`${surah}:${part}`];
}

function splitDuaSegments(text) {
  const indices = [];
  const regex = /(?:^|\s)(?=رَبَّنَا|رَبِّ|رَبّ)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const start = text[match.index] === ' ' ? match.index + 1 : match.index;
    indices.push(start);
    if (match.index === regex.lastIndex) regex.lastIndex++;
  }
  if (indices.length === 0) return [text.trim()];
  const segments = [];
  for (let i = 0; i < indices.length; i++) {
    segments.push(text.slice(indices[i], indices[i + 1] ?? text.length).trim());
  }
  return segments.filter((segment) => /^رَب/.test(segment));
}

function findMatchingSegment(segments, storedArabic) {
  const nStored = normalize(storedArabic);
  let best = null;
  let bestScore = 0;
  for (const segment of segments) {
    const nSeg = normalize(segment);
    for (const len of [nStored.length, 40, 30, 20, 15, 12, 10, 8]) {
      const probe = nStored.slice(0, len);
      if (probe.length < 6) break;
      if (nSeg.startsWith(probe) || nSeg.includes(probe)) {
        const score = probe.length + (nSeg.startsWith(probe) ? 100 : 0);
        if (score > bestScore) {
          best = segment;
          bestScore = score;
        }
      }
    }
  }
  return best;
}

function bestIndopakSegment(segments, storedArabic) {
  const direct = findMatchingSegment(segments, storedArabic);
  if (direct) return direct;

  const nStored = normalize(storedArabic);
  let best = null;
  let bestScore = 0;
  for (const segment of segments) {
    const nSeg = normalize(segment);
    for (let i = 0; i < nStored.length; i++) {
      for (let j = i + 6; j <= Math.min(i + 30, nStored.length); j++) {
        const sub = nStored.slice(i, j);
        if (nSeg.includes(sub) && sub.length > bestScore) {
          bestScore = sub.length;
          best = segment;
        }
      }
    }
  }
  return best;
}

function parseQuranicDuas(content) {
  return content.split(/quranDua\(\{/).slice(1).map((block) => {
    const pick = (key) => block.match(new RegExp(`${key}: '((?:\\\\'|[^'])*)'`))?.[1];
    return {
      id: pick('id'),
      arabic: pick('arabic'),
      quranReference: pick('quranReference'),
    };
  });
}

function parseMainDuas(content) {
  const ids = [...content.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
  return ids.filter((id) => !id.startsWith('rabbi-') && !id.startsWith('rabbana-') || ADHKAR_INDOPAK[id] !== undefined);
}

async function fetchIndopak(key) {
  const res = await fetch(`https://api.quran.com/api/v4/quran/verses/indopak?verse_key=${key}`);
  const json = await res.json();
  return json.verses?.[0]?.text_indopak;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function indopakForQuranicDua(dua) {
  if (MULTI_DUA_INDOPAK[dua.id]) return MULTI_DUA_INDOPAK[dua.id];

  const keys = refToKeys(dua.quranReference);
  let full = '';
  for (const key of keys) {
    const text = await fetchIndopak(key);
    if (!text) throw new Error(`Missing indopak for ${key}`);
    full += (full ? ' ' : '') + text;
    await sleep(80);
  }

  const segments = splitDuaSegments(full).map(trimAllahResponse);
  let match = bestIndopakSegment(segments, dua.arabic);
  if (!match) {
    const nStored = normalize(dua.arabic);
    const nFull = normalize(full);
    let idx = -1;
    for (const len of [nStored.length, 40, 30, 20, 15, 12, 10, 8]) {
      const probe = nStored.slice(0, len);
      if (probe.length < 6) break;
      idx = nFull.indexOf(probe);
      if (idx >= 0) break;
    }
    if (idx >= 0) {
      const sliced = full.slice(charOffsetForNormIndex(full, idx)).trim();
      match = bestIndopakSegment(splitDuaSegments(sliced), dua.arabic) ?? trimToDuaStart(sliced);
    }
  }
  if (!match) throw new Error(`Could not match indopak for ${dua.id}`);
  return clipAtNextDua(match, true);
}

function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function main() {
  const quranicPath = path.join(ROOT, 'src/data/quranicDuas.ts');
  const duasPath = path.join(ROOT, 'src/data/duas.ts');
  const outPath = path.join(ROOT, 'src/data/duasArabic.ur.ts');

  const quranic = parseQuranicDuas(fs.readFileSync(quranicPath, 'utf8'));
  const mainIds = [...fs.readFileSync(duasPath, 'utf8').matchAll(/id: '([^']+)'/g)].map((m) => m[1]);

  const map = { ...ADHKAR_INDOPAK };

  map['morning-hasbiyallah'] = ADHKAR_INDOPAK['morning-hasbiyallah'];
  map['night-ayat-kursi'] = await fetchIndopak('2:255');

  for (const dua of quranic) {
    map[dua.id] = await indopakForQuranicDua(dua);
    process.stderr.write(`indopak ${dua.id}\n`);
  }

  for (const id of mainIds) {
    if (map[id] == null) throw new Error(`Missing indopak entry for ${id}`);
  }

  const lines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, arabic]) => `  '${id}': '${escapeTs(arabic)}',`);

  fs.writeFileSync(
    outPath,
    `/** Indo-Pak Arabic script for Urdu locale. Generated by scripts/generateDuasArabicUr.mjs */\nexport const duasArabicUr: Record<string, string> = {\n${lines.join('\n')}\n};\n`,
  );

  console.log(`Wrote ${Object.keys(map).length} entries to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
