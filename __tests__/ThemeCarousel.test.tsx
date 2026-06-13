import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { ThemeCarousel } from '@/src/features/settings/ThemeCarousel';
import { ThemePreviewScreen } from '@/src/features/settings/ThemePreviewScreen';
import { THEME_CAROUSEL_ORDER, THEME_PREVIEW_PAGE, ITEM_SLOT_WIDTH } from '@/src/features/settings/themeCarouselConfig';
import { themes } from '@/src/theme/theme';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

describe('ThemeCarousel', () => {
  beforeEach(() => resetStore());

  it('renders all theme previews and selects a new theme', () => {
    const onSelect = jest.fn();
    render(<ThemeCarousel language="en" themeId="garden" onSelect={onSelect} />);

    expect(screen.getByText('Garden')).toBeTruthy();
    expect(screen.getByText('1 / 5')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Chromatic'));
    expect(onSelect).toHaveBeenCalledWith('chromatic');
  });

  it('steps through themes without wrapping past the last item', () => {
    const onSelect = jest.fn();
    render(<ThemeCarousel language="en" themeId="fadedGold" onSelect={onSelect} />);

    expect(screen.getByText('5 / 5')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Next theme'));
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.press(screen.getByLabelText('Previous theme'));
    expect(onSelect).toHaveBeenCalledWith('parchment');
  });

  it('keeps arrow state in sync after swiping the carousel', () => {
    const onSelect = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <ThemeCarousel language="en" themeId="garden" onSelect={onSelect} />,
    );
    const FlatList = require('react-native').FlatList;
    const list = UNSAFE_getAllByType(FlatList)[0];

    act(() => {
      fireEvent.scroll(list, {
        nativeEvent: {
          contentOffset: { x: ITEM_SLOT_WIDTH * 2, y: 0 },
          contentSize: { height: 230, width: 640 },
          layoutMeasurement: { height: 230, width: 350 },
        },
      });
    });
    act(() => {
      fireEvent(list, 'onScrollEndDrag', {
        nativeEvent: { contentOffset: { x: ITEM_SLOT_WIDTH * 2, y: 0 } },
      });
    });

    expect(screen.getByText('3 / 5')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Next theme'));
    expect(onSelect).toHaveBeenCalledWith('rose');
  });

  it('renders preview screens for each mapped page', () => {
    THEME_CAROUSEL_ORDER.forEach((id) => {
      const { unmount } = render(
        <ThemePreviewScreen colors={themes[id].colors} page={THEME_PREVIEW_PAGE[id]} />,
      );
      unmount();
    });
  });

  it('updates the focused label in Urdu', () => {
    useMisbahaStore.setState({ language: 'ur' });
    render(<ThemeCarousel language="ur" themeId="rose" onSelect={jest.fn()} />);
    expect(screen.getByText('گلاب')).toBeTruthy();
  });
});
