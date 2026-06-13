# Misbaha

A tasbeeh and adhkar counter built with [Expo](https://expo.dev) (SDK 54) and React Native.

Published by **[Zikr Apps](mailto:salam@zikrapps.com)** — [salam@zikrapps.com](mailto:salam@zikrapps.com)

## Features

- Dua and tasbeeh counters with tap, double-tap, and long-press gestures
- Goals, insights, themes, English and Urdu
- On-device storage only (no backend)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- **iOS simulator (macOS only):** [Xcode](https://developer.apple.com/xcode/) with at least one iOS Simulator runtime installed (open Xcode once and accept the license if prompted)
- **Android emulator:** [Android Studio](https://developer.android.com/studio) with the Android SDK and a virtual device (AVD) created in **Device Manager**

### Install dependencies

```bash
npm install
```

### Run on iOS Simulator

From the project root:

```bash
npm run ios
```

This runs `expo run:ios`, which generates the native `ios/` project on first launch (if needed), builds the app, and opens it in the default iOS Simulator. The first build can take several minutes.

**Alternative:** start the dev server, then open the simulator from the terminal UI:

```bash
npm start
```

Press `i` to launch iOS.

### Run on Android Emulator

1. Start an Android virtual device in Android Studio (**Device Manager** → play on an AVD), or from the terminal:

   ```bash
   $ANDROID_HOME/emulator -avd <your-avd-name>
   ```

2. From the project root:

   ```bash
   npm run android
   ```

This runs `expo run:android`, which generates the native `android/` project on first launch (if needed), builds the app, and installs it on the running emulator.

**Alternative:** with the emulator already running:

```bash
npm start
```

Press `a` to launch Android.

### Other commands

```bash
npm run typecheck
npm test
```

## Store listings (Zikr Apps)

Play Store and App Store copy, plus EAS Metadata for Apple, live under [`store/`](./store/README.md).

- **App name:** Misbaha  
- **Publisher / developer:** Zikr Apps (set in Play Console and Apple Developer accounts)  
- **Push App Store metadata:** `npm run metadata:push`
- **Publish to the Apple App Store:** [docs/PUBLISHING-APPLE-APP-STORE.md](./docs/PUBLISHING-APPLE-APP-STORE.md)

## Android sideload (APK)

Build a signed release APK for direct install on Android devices (no Play Store):

```bash
npm install -g eas-cli
eas login
npm run build:sideload
```

When the EAS build finishes, download the `.apk` and install it:

- **USB:** `adb install -r path/to/misbaha.apk` (enable USB debugging on the device)
- **File transfer:** copy the APK to the phone, open it in Files, tap Install (allow “Install unknown apps” for that app if prompted)

Bump `expo.android.versionCode` in `app.json` before each new sideload update.

**Full guide:** [docs/PUBLISHING-ANDROID-SIDELOAD.md](./docs/PUBLISHING-ANDROID-SIDELOAD.md)

## License

Copyright © Zikr Apps. All rights reserved unless an open-source license file is added.
