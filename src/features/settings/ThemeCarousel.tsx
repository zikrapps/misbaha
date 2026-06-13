import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { Icon } from '@/src/components/Icon';
import {
  ITEM_SLOT_WIDTH,
  THEME_CAROUSEL_ORDER,
  THEME_PREVIEW_PAGE,
} from '@/src/features/settings/themeCarouselConfig';
import { ThemePreviewScreen } from '@/src/features/settings/ThemePreviewScreen';
import { formatNumber } from '@/src/i18n/format';
import { themeLabels } from '@/src/i18n/strings';
import { Language, ThemeId } from '@/src/types/misbaha';
import { radii, spacing, themes, useTheme } from '@/src/theme/theme';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ThemeId>);
const THEME_COUNT = THEME_CAROUSEL_ORDER.length;
const SNAP_OFFSETS = THEME_CAROUSEL_ORDER.map((_, index) => index * ITEM_SLOT_WIDTH);

type ThemeCarouselProps = {
  language: Language;
  themeId: ThemeId;
  onSelect: (id: ThemeId) => void;
};

type ThemeCarouselItemProps = {
  id: ThemeId;
  index: number;
  language: Language;
  scrollX: SharedValue<number>;
  isCentered: boolean;
  onPress: () => void;
};

function ThemeCarouselItem({ id, index, language, scrollX, isCentered, onPress }: ThemeCarouselItemProps) {
  const option = themes[id];
  const labels = themeLabels(language, id);
  const animatedStyle = useAnimatedStyle(() => {
    const center = index * ITEM_SLOT_WIDTH;
    const offset = (scrollX.value - center) / ITEM_SLOT_WIDTH;
    const abs = Math.abs(offset);
    return {
      opacity: interpolate(abs, [0, 1, 2], [1, 0.72, 0.38], Extrapolation.CLAMP),
      transform: [
        { perspective: 1000 },
        {
          rotateY: `${interpolate(offset, [-2, 0, 2], [48, 0, -48], Extrapolation.CLAMP)}deg`,
        },
        {
          scale: interpolate(abs, [0, 1, 2], [1, 0.82, 0.66], Extrapolation.CLAMP),
        },
      ],
      zIndex: Math.round(4 - abs),
    };
  });

  return (
    <Pressable
      accessibilityLabel={labels.name}
      accessibilityRole="button"
      accessibilityState={{ selected: isCentered }}
      onPress={onPress}
      style={styles.itemSlot}
    >
      <Animated.View style={[styles.item, animatedStyle]}>
        <View style={styles.previewWrap}>
          {isCentered ? (
            <View style={[styles.selectedBadge, { backgroundColor: option.colors.oliveDark }]}>
              <Icon name="check" color={option.colors.white} size={10} strokeWidth={2.4} />
            </View>
          ) : null}
          <View
            style={[
              styles.previewFrame,
              isCentered && {
                borderColor: option.colors.oliveDark,
                borderWidth: 2.5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 18,
                elevation: 6,
              },
            ]}
          >
            <ThemePreviewScreen colors={option.colors} page={THEME_PREVIEW_PAGE[id]} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function SwatchStrip({ themeId }: { themeId: ThemeId }) {
  const colors = themes[themeId].colors;
  const swatches = [colors.oliveDeep, colors.sand, colors.blush];
  return (
    <View style={styles.swatchStrip}>
      {swatches.map((color) => (
        <View key={color} style={[styles.swatchDot, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

function CarouselSpacer({ width }: { width: number }) {
  return <View style={{ width }} />;
}

export function ThemeCarousel({ language, themeId, onSelect }: ThemeCarouselProps) {
  const theme = useTheme();
  const listRef = useRef<FlatList<ThemeId>>(null);
  const scrollX = useSharedValue(0);
  const listWidthRef = useRef(0);
  const carouselSelectedRef = useRef(false);
  const initialIndex = Math.max(0, THEME_CAROUSEL_ORDER.indexOf(themeId));
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);
  const [listWidth, setListWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const sidePadding = listWidth > 0 ? Math.max(0, (listWidth - ITEM_SLOT_WIDTH) / 2) : 0;
  const focusedThemeId = THEME_CAROUSEL_ORDER[focusedIndex] ?? themeId;
  const atStart = focusedIndex === 0;
  const atEnd = focusedIndex === THEME_COUNT - 1;

  const indexForOffset = useCallback((offsetX: number) => {
    return Math.max(0, Math.min(THEME_COUNT - 1, Math.round(offsetX / ITEM_SLOT_WIDTH)));
  }, []);

  const syncFocusedIndex = useCallback(
    (offsetX: number) => {
      const nextIndex = indexForOffset(offsetX);
      setFocusedIndex((current) => (current === nextIndex ? current : nextIndex));
    },
    [indexForOffset],
  );

  const commitSelection = useCallback(
    (offsetX: number) => {
      const nextIndex = indexForOffset(offsetX);
      setFocusedIndex(nextIndex);
      const nextId = THEME_CAROUSEL_ORDER[nextIndex];
      if (nextId && nextId !== themeId) {
        carouselSelectedRef.current = true;
        onSelect(nextId);
      }
    },
    [indexForOffset, onSelect, themeId],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(syncFocusedIndex)(event.contentOffset.x);
    },
  });

  const scrollToIndex = useCallback((index: number, animated = true) => {
    const clamped = Math.max(0, Math.min(THEME_COUNT - 1, index));
    listRef.current?.scrollToOffset({
      offset: clamped * ITEM_SLOT_WIDTH,
      animated,
    });
    scrollX.value = clamped * ITEM_SLOT_WIDTH;
  }, [scrollX]);

  const goToIndex = useCallback(
    (index: number, animated = true) => {
      const clamped = Math.max(0, Math.min(THEME_COUNT - 1, index));
      setFocusedIndex(clamped);
      scrollToIndex(clamped, animated);
      const nextId = THEME_CAROUSEL_ORDER[clamped];
      if (nextId && nextId !== themeId) {
        carouselSelectedRef.current = true;
        onSelect(nextId);
      }
    },
    [onSelect, scrollToIndex, themeId],
  );

  useEffect(() => {
    if (!ready || sidePadding <= 0) return;
    const index = THEME_CAROUSEL_ORDER.indexOf(themeId);
    if (index < 0) return;

    setFocusedIndex(index);

    if (carouselSelectedRef.current) {
      carouselSelectedRef.current = false;
      return;
    }

    requestAnimationFrame(() => scrollToIndex(index, false));
  }, [ready, scrollToIndex, sidePadding, themeId]);

  const handleListLayout = (width: number) => {
    if (width <= 0 || width === listWidthRef.current) return;
    listWidthRef.current = width;
    setListWidth(width);
    setReady(true);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    commitSelection(event.nativeEvent.contentOffset.x);
  };

  const handlePrev = () => {
    goToIndex(focusedIndex - 1);
  };

  const handleNext = () => {
    goToIndex(focusedIndex + 1);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ThemeId; index: number }) => (
      <ThemeCarouselItem
        id={item}
        index={index}
        isCentered={focusedIndex === index}
        language={language}
        onPress={() => goToIndex(index)}
        scrollX={scrollX}
      />
    ),
    [focusedIndex, goToIndex, language, scrollX],
  );

  const header = useMemo(() => <CarouselSpacer width={sidePadding} />, [sidePadding]);
  const footer = useMemo(() => <CarouselSpacer width={sidePadding} />, [sidePadding]);

  return (
    <View style={styles.wrap}>
      <View onLayout={(event) => handleListLayout(event.nativeEvent.layout.width)}>
        <AnimatedFlatList
          ref={listRef}
          horizontal
          data={THEME_CAROUSEL_ORDER}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            index,
            length: ITEM_SLOT_WIDTH,
            offset: sidePadding + ITEM_SLOT_WIDTH * index,
          })}
          keyExtractor={(item) => item}
          ListFooterComponent={footer}
          ListHeaderComponent={header}
          onMomentumScrollEnd={handleScrollEnd}
          onScroll={scrollHandler}
          onScrollEndDrag={handleScrollEnd}
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={SNAP_OFFSETS}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      </View>

      <View style={[styles.nav, theme.mirrorRow]}>
        <Pressable
          accessibilityLabel="Previous theme"
          accessibilityRole="button"
          accessibilityState={{ disabled: atStart }}
          disabled={atStart}
          onPress={handlePrev}
          style={({ pressed }) => [
            styles.navButton,
            { backgroundColor: theme.colors.parchment, borderColor: theme.colors.line },
            atStart && styles.navButtonDisabled,
            pressed && !atStart && styles.navButtonPressed,
          ]}
        >
          <Icon name="back" color={theme.colors.oliveDark} size={18} />
        </Pressable>

        <View style={styles.meta}>
          <Text
            style={[
              styles.navName,
              {
                color: theme.colors.ink,
                fontFamily: theme.labelFont,
                fontSize: theme.typo.subtitle,
              },
            ]}
          >
            {themeLabels(language, focusedThemeId).name}
          </Text>
          <Text
            style={[
              styles.navCount,
              {
                color: theme.colors.muted,
                fontFamily: theme.labelFont,
                fontSize: theme.typo.small,
              },
            ]}
          >
            {formatNumber(focusedIndex + 1)} / {formatNumber(THEME_COUNT)}
          </Text>
          <SwatchStrip themeId={focusedThemeId} />
        </View>

        <Pressable
          accessibilityLabel="Next theme"
          accessibilityRole="button"
          accessibilityState={{ disabled: atEnd }}
          disabled={atEnd}
          onPress={handleNext}
          style={({ pressed }) => [
            styles.navButton,
            { backgroundColor: theme.colors.parchment, borderColor: theme.colors.line },
            atEnd && styles.navButtonDisabled,
            pressed && !atEnd && styles.navButtonPressed,
          ]}
        >
          <View style={styles.nextIcon}>
            <Icon name="back" color={theme.colors.oliveDark} size={18} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -spacing.lg,
  },
  list: {
    minHeight: 230,
  },
  listContent: {
    paddingTop: spacing.sm,
  },
  itemSlot: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: ITEM_SLOT_WIDTH,
  },
  item: {
    alignItems: 'center',
  },
  previewWrap: {
    position: 'relative',
  },
  previewFrame: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  selectedBadge: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: -5,
    width: 18,
    zIndex: 2,
  },
  nav: {
    alignItems: 'center',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  navButton: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonPressed: {
    opacity: 0.85,
  },
  meta: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
    maxWidth: 200,
  },
  swatchStrip: {
    flexDirection: 'row',
    gap: 5,
  },
  swatchDot: {
    borderRadius: radii.pill,
    height: 10,
    width: 10,
  },
  navName: {
    fontWeight: '700',
    textAlign: 'center',
  },
  navCount: {
    textAlign: 'center',
  },
  nextIcon: {
    transform: [{ scaleX: -1 }],
  },
});
