import { createContext, PropsWithChildren, useContext } from 'react';
import { useFonts } from 'expo-font';
import {
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_700Bold,
} from '@expo-google-fonts/noto-naskh-arabic';

const UrduFontContext = createContext(true);

export function UrduFontProvider({ children }: PropsWithChildren) {
  const [loaded] = useFonts({ NotoNaskhArabic_400Regular, NotoNaskhArabic_700Bold });
  return <UrduFontContext.Provider value={loaded}>{children}</UrduFontContext.Provider>;
}

export function useUrduFontsReady() {
  return useContext(UrduFontContext);
}
