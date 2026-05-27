# Misbaha

A tasbeeh and adhkar counter built with [Expo](https://expo.dev) (SDK 54) and React Native.

Published by **[Zikr Apps](mailto:salam@zikrapps.com)** — [salam@zikrapps.com](mailto:salam@zikrapps.com)

## Features

- Dua and tasbeeh counters with tap, double-tap, and long-press gestures
- Goals, insights, themes, English and Urdu
- On-device storage only (no backend)

## Development

```bash
npm install
npm start
```

```bash
npm run typecheck
npm test
```

## Store listings (Zikr Apps)

Play Store and App Store copy, plus EAS Metadata for Apple, live under [`store/`](./store/README.md).

- **App name:** Misbaha  
- **Publisher / developer:** Zikr Apps (set in Play Console and Apple Developer accounts)  
- **Push App Store metadata:** `npm run metadata:push`

## Android APK (sideload)

```bash
npm install -g eas-cli
eas login
npm run build:apk
```

See [Expo EAS Build](https://docs.expo.dev/build/introduction/) for details.

## License

Copyright © Zikr Apps. All rights reserved unless an open-source license file is added.
