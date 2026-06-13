jest.unmock('@/src/theme/UrduFontProvider');

import { render, renderHook } from '@testing-library/react-native';
import { Text } from 'react-native';

import { UrduFontProvider, useUrduFontsReady } from '@/src/theme/UrduFontProvider';

describe('UrduFontProvider', () => {
  it('exposes font loading state to descendants', () => {
    const { result } = renderHook(() => useUrduFontsReady(), {
      wrapper: ({ children }) => <UrduFontProvider>{children}</UrduFontProvider>,
    });

    expect(result.current).toBe(true);
  });

  it('renders children while fonts load', () => {
    const { getByText } = render(
      <UrduFontProvider>
        <Text>اردو</Text>
      </UrduFontProvider>,
    );

    expect(getByText('اردو')).toBeTruthy();
  });
});
