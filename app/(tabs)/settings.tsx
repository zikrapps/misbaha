import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Icon } from '@/src/components/Icon';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { APP_DISPLAY_NAME, LEGAL_ENTITY, SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/src/constants/legal';
import { TapWeightDial } from '@/src/features/settings/TapWeightDial';
import { ThemeCarousel } from '@/src/features/settings/ThemeCarousel';
import { reloadApp, syncLayoutDirection } from '@/src/i18n/rtl';
import { languages, useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { AppTypography, radii, spacing, useTheme } from '@/src/theme/theme';
import { Language } from '@/src/types/misbaha';
import { openExternalUrl } from '@/src/utils/openExternalUrl';

export default function SettingsScreen() {
  const theme = useTheme();
  const t = useT();
  const tapWeight = useMisbahaStore((state) => state.tapWeight);
  const themeId = useMisbahaStore((state) => state.themeId);
  const language = useMisbahaStore((state) => state.language);
  const { typo, labelFont, proseLayout, proseInlineLayout, proseCenterLayout } = theme;
  const styles = useMemo(() => createStyles(typo), [language, typo.body, typo.subtitle, typo.small]);
  const clickSoundEnabled = useMisbahaStore((state) => state.clickSoundEnabled);
  const hapticsEnabled = useMisbahaStore((state) => state.hapticsEnabled);
  const setTapWeight = useMisbahaStore((state) => state.setTapWeight);
  const setThemeId = useMisbahaStore((state) => state.setThemeId);
  const setLanguage = useMisbahaStore((state) => state.setLanguage);
  const setHapticsEnabled = useMisbahaStore((state) => state.setHapticsEnabled);
  const openTutorial = useMisbahaStore((state) => state.openTutorial);
  const resetAllCounters = useMisbahaStore((state) => state.resetAllCounters);

  const confirmReset = () => {
    Alert.alert(t.settings.resetConfirmTitle, t.settings.resetConfirmBody, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.settings.resetConfirmAction, style: 'destructive', onPress: resetAllCounters },
    ]);
  };

  const chooseLanguage = (id: Language) => {
    if (id === language) return;
    setLanguage(id);
    // Switching to/from Urdu changes RTL: React Native must reload for native
    // text alignment and tab order to flip.
    if (syncLayoutDirection(id)) {
      Alert.alert(t.settings.restartTitle, t.settings.restartBody, [
        { text: t.settings.restartAction, onPress: reloadApp },
      ]);
    }
  };

  const doneAction = (
    <Pressable
      accessibilityLabel={t.common.done}
      accessibilityRole="button"
      onPress={() => router.back()}
      style={({ pressed }) => [
        styles.donePill,
        theme.mirrorRow,
        { backgroundColor: theme.colors.parchment, borderColor: theme.colors.line },
        pressed && styles.donePillPressed,
      ]}
    >
      <Icon name="back" color={theme.colors.oliveDark} size={16} />
      <Text style={[styles.donePillText, proseInlineLayout, { color: theme.colors.oliveDark, fontFamily: labelFont }]}>
        {t.common.done}
      </Text>
    </Pressable>
  );

  return (
    <Screen title={t.settings.title} subtitle={t.settings.subtitle} action={doneAction}>
      <Card style={styles.dialCard}>
        <SectionTitle>{t.settings.countPerTap}</SectionTitle>
        <Text style={[styles.statement, proseCenterLayout, { color: theme.colors.ink, fontFamily: labelFont, fontStyle: theme.proseFontStyle }]}>
          {t.settings.tapStatement(tapWeight)}
        </Text>
        <TapWeightDial value={tapWeight} clickSoundEnabled={clickSoundEnabled} onChange={setTapWeight} />
        <Text style={[styles.hint, proseCenterLayout, { color: theme.colors.muted, fontFamily: labelFont }]}>
          {t.settings.tapHint}
        </Text>
      </Card>

      <SectionTitle>{t.settings.language}</SectionTitle>
      <Card style={styles.languageCard}>
        <Text style={[styles.languageHint, proseLayout, { color: theme.colors.muted, fontFamily: labelFont }]}>
          {t.settings.languageHint}
        </Text>
        <View style={styles.languageRow}>
          {(Object.keys(languages) as Language[]).map((id) => {
            const option = languages[id];
            const selected = language === id;
            return (
              <Pressable
                key={id}
                accessibilityLabel={option.name}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => chooseLanguage(id)}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor: selected ? theme.colors.oliveDeep : theme.colors.parchment,
                    borderColor: selected ? theme.colors.oliveDark : theme.colors.line,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageName,
                    proseLayout,
                    {
                      color: selected ? theme.colors.card : theme.colors.ink,
                      fontFamily: labelFont,
                    },
                  ]}
                >
                  {option.name}
                </Text>
                <Text
                  style={[
                    styles.languageNative,
                    proseLayout,
                    {
                      color: selected ? theme.colors.sand : theme.colors.muted,
                      fontFamily: labelFont,
                    },
                  ]}
                >
                  {option.nativeName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <SectionTitle>{t.settings.theme}</SectionTitle>
      <ThemeCarousel language={language} themeId={themeId} onSelect={setThemeId} />

      <SectionTitle>{t.settings.feedback}</SectionTitle>
      <Card style={styles.feedback}>
        <View style={styles.row}>
          <View style={styles.rowCopyWrap}>
            <Icon name="haptic" color={theme.colors.oliveDark} size={21} />
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, proseLayout, { color: theme.colors.ink, fontFamily: labelFont }]}>
                {t.settings.haptic}
              </Text>
              <Text style={[styles.rowCopy, proseLayout, { color: theme.colors.muted, fontFamily: labelFont }]}>
                {t.settings.hapticHint}
              </Text>
            </View>
          </View>
          <Switch
            onValueChange={setHapticsEnabled}
            thumbColor={theme.colors.card}
            trackColor={{ false: theme.colors.line, true: theme.colors.olive }}
            value={hapticsEnabled}
          />
        </View>
      </Card>

      <SectionTitle>{t.settings.help}</SectionTitle>
      <Card>
        <Pressable onPress={openTutorial} style={styles.tutorialButton}>
          <Icon name="beads" color={theme.colors.oliveDark} size={22} />
          <View style={styles.tutorialCopy}>
            <Text style={[styles.rowTitle, proseLayout, { color: theme.colors.ink, fontFamily: labelFont }]}>
              {t.settings.tutorialTitle}
            </Text>
            <Text style={[styles.rowCopy, proseLayout, { color: theme.colors.muted, fontFamily: labelFont }]}>
              {t.settings.tutorialHint}
            </Text>
          </View>
        </Pressable>
      </Card>

      <SectionTitle>{t.settings.about}</SectionTitle>
      <Card style={styles.aboutCard}>
        <Text style={[styles.aboutEntity, proseLayout, { color: theme.colors.ink, fontFamily: labelFont }]}>
          {APP_DISPLAY_NAME} · {t.settings.publishedBy(LEGAL_ENTITY)}
        </Text>
        <Text style={[styles.rowCopy, proseLayout, { color: theme.colors.muted, fontFamily: labelFont }]}>
          {t.settings.contactHint}
        </Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${t.settings.contact}: ${SUPPORT_EMAIL}`}
          onPress={() => openExternalUrl(SUPPORT_MAILTO, t.common.linkUnavailable)}
          style={styles.contactRow}
        >
          <Icon name="link" color={theme.colors.olive} size={16} />
          <Text style={[styles.contactEmail, { color: theme.colors.olive, fontFamily: labelFont }]}>{SUPPORT_EMAIL}</Text>
        </Pressable>
      </Card>

      <SectionTitle>{t.settings.reset}</SectionTitle>
      <Card>
        <Pressable onPress={confirmReset} style={styles.resetButton}>
          <Icon name="reset" color={theme.colors.blush} size={22} />
          <View style={styles.resetCopy}>
            <Text style={[styles.resetTitle, proseLayout, { color: theme.colors.blush, fontFamily: labelFont }]}>
              {t.settings.resetTitle}
            </Text>
            <Text style={[styles.rowCopy, proseLayout, { color: theme.colors.muted, fontFamily: labelFont }]}>
              {t.settings.resetHint}
            </Text>
          </View>
        </Pressable>
      </Card>
    </Screen>
  );
}

function createStyles(typo: AppTypography) {
  return StyleSheet.create({
  donePill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    flexGrow: 0,
    flexShrink: 0,
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingLeft: 11,
    paddingRight: spacing.md,
    paddingVertical: 9,
  },
  donePillPressed: {
    opacity: 0.85,
  },
  donePillText: {
    fontSize: typo.subtitle,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dialCard: {
    alignItems: 'center',
    gap: spacing.md,
  },
  statement: {
    fontSize: typo.subtitle,
    fontStyle: 'italic',
    lineHeight: Math.round(typo.subtitle * 1.45),
    textAlign: 'center',
  },
  hint: {
    fontSize: typo.small,
    lineHeight: Math.round(typo.small * 1.45),
    textAlign: 'center',
  },
  languageCard: {
    gap: spacing.md,
  },
  languageHint: {
    fontSize: typo.small,
    lineHeight: Math.round(typo.small * 1.45),
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  languageOption: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1.5,
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  languageName: {
    fontSize: typo.body,
    fontWeight: '700',
  },
  languageNative: {
    fontSize: typo.subtitle + 2,
  },
  feedback: {
    gap: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowCopyWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: typo.body,
  },
  rowCopy: {
    fontSize: typo.small,
    lineHeight: Math.round(typo.small * 1.45),
    marginTop: spacing.xs,
  },
  resetButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  resetCopy: {
    flex: 1,
  },
  tutorialButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  tutorialCopy: {
    flex: 1,
  },
  resetTitle: {
    fontSize: typo.body,
  },
  aboutCard: {
    gap: spacing.sm,
  },
  aboutEntity: {
    fontSize: typo.body,
    fontWeight: '700',
  },
  contactRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  contactEmail: {
    fontSize: typo.body,
    fontWeight: '700',
  },
});
}
