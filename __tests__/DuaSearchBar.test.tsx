import { fireEvent, render, screen } from '@testing-library/react-native';

import { DuaSearchBar } from '@/src/features/duas/DuaSearchBar';
import { resetStore } from './helpers/store';

describe('DuaSearchBar', () => {
  beforeEach(resetStore);

  it('renders without crashing on goals and tasbeeh screens', () => {
    render(<DuaSearchBar onSelect={jest.fn()} />);
    expect(screen.getByLabelText('Search by transliteration or Arabic')).toBeTruthy();
  });

  it('highlights the matched keyword in autocomplete suggestions', () => {
    render(<DuaSearchBar onSelect={jest.fn()} />);
    fireEvent.changeText(screen.getByLabelText('Search by transliteration or Arabic'), 'dunya');

    expect(screen.getByText('dunya', { exact: false })).toBeTruthy();
    expect(screen.getByText(/Rabbana atina/i)).toBeTruthy();
  });

  it('warns when searching by English translation', () => {
    render(<DuaSearchBar onSelect={jest.fn()} />);
    fireEvent.changeText(screen.getByLabelText('Search by transliteration or Arabic'), 'Glory');

    expect(screen.getByText('No matching dua found.')).toBeTruthy();
    expect(
      screen.getByText('Searching by English is not supported — use transliteration or Arabic.'),
    ).toBeTruthy();
  });

  it('does not warn for unmatched transliteration queries', () => {
    render(<DuaSearchBar onSelect={jest.fn()} />);
    fireEvent.changeText(screen.getByLabelText('Search by transliteration or Arabic'), 'zzznomatch');

    expect(screen.getByText('No matching dua found.')).toBeTruthy();
    expect(
      screen.queryByText('Searching by English is not supported — use transliteration or Arabic.'),
    ).toBeNull();
  });
});
