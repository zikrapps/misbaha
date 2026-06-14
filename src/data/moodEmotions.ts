import { GoalLibraryIconName } from '@/src/features/goals/goalLibraryIcons';

export const moodEmotionIds = [
  'happy',
  'sad',
  'thankful',
  'stressed',
  'grateful',
  'amazed',
  'ecstatic',
  'hopeful',
  'anxious',
  'fearful',
  'angry',
  'lonely',
  'overwhelmed',
  'regretful',
  'patient',
  'peaceful',
  'weary',
  'joyful',
  'loving',
  'humble',
] as const;

export type MoodEmotionId = (typeof moodEmotionIds)[number];

export type MoodEmotion = {
  id: MoodEmotionId;
  duaId: string;
  icon: GoalLibraryIconName;
  /** Gradient tile accent (from theme palette family). */
  palette: 'olive' | 'blush' | 'sand' | 'oliveDeep';
};

export const moodEmotions: MoodEmotion[] = [
  { id: 'happy', duaId: 'mood-happy', icon: 'gl-sunrise', palette: 'sand' },
  { id: 'sad', duaId: 'mood-sad', icon: 'gl-cloud', palette: 'oliveDeep' },
  { id: 'thankful', duaId: 'mood-thankful', icon: 'gl-hand', palette: 'olive' },
  { id: 'stressed', duaId: 'mood-stressed', icon: 'gl-wave', palette: 'blush' },
  { id: 'grateful', duaId: 'mood-grateful', icon: 'gl-gift', palette: 'olive' },
  { id: 'amazed', duaId: 'mood-amazed', icon: 'gl-star', palette: 'sand' },
  { id: 'ecstatic', duaId: 'mood-ecstatic', icon: 'gl-crown', palette: 'blush' },
  { id: 'hopeful', duaId: 'mood-hopeful', icon: 'gl-compass', palette: 'olive' },
  { id: 'anxious', duaId: 'mood-anxious', icon: 'gl-wind', palette: 'oliveDeep' },
  { id: 'fearful', duaId: 'mood-fearful', icon: 'gl-shield', palette: 'oliveDeep' },
  { id: 'angry', duaId: 'mood-angry', icon: 'gl-flame', palette: 'blush' },
  { id: 'lonely', duaId: 'mood-lonely', icon: 'gl-moon', palette: 'oliveDeep' },
  { id: 'overwhelmed', duaId: 'mood-overwhelmed', icon: 'gl-mount', palette: 'blush' },
  { id: 'regretful', duaId: 'mood-regretful', icon: 'gl-drop', palette: 'oliveDeep' },
  { id: 'patient', duaId: 'mood-patient', icon: 'gl-hourglass', palette: 'olive' },
  { id: 'peaceful', duaId: 'mood-peaceful', icon: 'gl-dove', palette: 'sand' },
  { id: 'weary', duaId: 'mood-weary', icon: 'gl-lantern', palette: 'oliveDeep' },
  { id: 'joyful', duaId: 'mood-joyful', icon: 'gl-sprout', palette: 'sand' },
  { id: 'loving', duaId: 'mood-loving', icon: 'gl-heart', palette: 'blush' },
  { id: 'humble', duaId: 'mood-humble', icon: 'gl-seed', palette: 'olive' },
];

export const moodEmotionsById = Object.fromEntries(moodEmotions.map((e) => [e.id, e])) as Record<
  MoodEmotionId,
  MoodEmotion
>;

export function isMoodEmotionId(value: string | undefined): value is MoodEmotionId {
  return Boolean(value && moodEmotionIds.includes(value as MoodEmotionId));
}
