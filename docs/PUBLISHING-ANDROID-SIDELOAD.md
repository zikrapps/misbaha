# Sideloading Misbaha on Android

Guide for building and installing **Misbaha** (package `com.zikrapps.misbaha`) on Android phones and tablets **outside** the Google Play Store — for testers, family, or regions where Play distribution is not ready yet.

**Official references**

- [Expo: EAS Build setup](https://docs.expo.dev/build/setup/)
- [Expo: Android builds](https://docs.expo.dev/build-reference/apk/)
- [Expo: Internal distribution](https://docs.expo.dev/build/internal-distribution/)

---

## Overview

| Item | Value in this repo |
| --- | --- |
| App name | Misbaha |
| Publisher / legal entity | Zikr Apps |
| Android package | `com.zikrapps.misbaha` |
| Current version | `1.1.0` (`app.json` → `expo.version`) |
| Android version code | `2` (`app.json` → `expo.android.versionCode`) |
| EAS project ID | `0fabcd69-4005-4188-bed2-fb53d6f65b9d` |
| Support email | salam@zikrapps.com |

**High-level flow**

```text
Expo / EAS account
  → Pre-flight tests
  → EAS sideload (APK) build
  → Download .apk
  → Install on device (USB or file transfer)
  → Smoke-test
```

Sideload builds produce a **signed release APK** you can install directly. Play Store submission uses the **production** profile (`.aab`); sideload uses the **sideload** profile (`.apk`).

---

## Phase 1 — Prerequisites

### 1.1 Expo / EAS account

This project is already linked to EAS (`app.json` → `extra.eas.projectId`).

```bash
npm install -g eas-cli
eas login
eas whoami
```

Confirm the Expo account owns or has access to project `misbaha` on [expo.dev](https://expo.dev).

### 1.2 Android signing (first build only)

EAS creates and stores the Android keystore on the first cloud build. You do **not** need a local `.jks` file for cloud builds.

To inspect or rotate credentials later:

```bash
eas credentials --platform android
```

Choose the **sideload** (or **preview**) profile when prompted.

### 1.3 Checklist

- [ ] Logged into EAS CLI
- [ ] Expo account has access to this project

---

## Phase 2 — Versioning

[`eas.json`](../eas.json) uses `"appVersionSource": "local"`, so Android versioning is set in [`app.json`](../app.json):

| Field | Purpose | Example |
| --- | --- | --- |
| `expo.version` | User-visible version (`versionName`) | `1.1.0` |
| `expo.android.versionCode` | Integer build id; **must increase** for every installable update | `2` |

When you ship a new sideload build:

1. Bump `expo.version` for user-visible releases (e.g. `1.1.0` → `1.2.0`).
2. Increment `expo.android.versionCode` by at least **1** (e.g. `2` → `3`).

Android refuses to upgrade an installed APK if the new APK has the same or lower `versionCode`, even when `version` string changes.

Keep `expo.ios.buildNumber` in sync with your release cadence where practical (both are currently `2` for `1.1.0`).

---

## Phase 3 — Pre-flight quality gate

```bash
npm run typecheck
npm test
```

Fix failures before starting a cloud build.

### Checklist

- [ ] Typecheck passes
- [ ] Tests pass
- [ ] `version` and `versionCode` bumped if this is an update

---

## Phase 4 — Build the sideload APK

From the project root:

```bash
npm run build:sideload
```

This runs `eas build --platform android --profile sideload`, which sets `buildType: "apk"` and `distribution: "internal"`.

Monitor progress:

```bash
eas build:list
```

Or open the build URL printed in the terminal. First Android builds often take **10–20 minutes** on EAS queues.

When the build finishes, download the `.apk` from the Expo build page or:

```bash
eas build:download --platform android --profile sideload
```

### Checklist

- [ ] Build status: **Finished**
- [ ] Artifact is an **.apk** (not `.aab`)

---

## Phase 5 — Install on a device

### 5.1 Enable installation from unknown sources

On the target phone or tablet:

1. **Settings** → **Security** (or **Apps** / **Privacy**, varies by OEM).
2. Allow installs from the source you will use:
   - **Files** / **Downloads** (when opening the APK from storage)
   - **ADB** / **USB debugging** (developer installs)
   - **Chrome** (if downloading the APK in-browser)

On Android 8+, permission is per-app (“Install unknown apps”), not a single global toggle.

### 5.2 Option A — USB + ADB (recommended for developers)

1. Enable **Developer options** → **USB debugging** on the device.
2. Connect via USB and confirm the device is visible:

   ```bash
   adb devices
   ```

3. Install:

   ```bash
   adb install -r path/to/misbaha.apk
   ```

   Use `-r` to replace an existing install when upgrading.

### 5.3 Option B — Transfer the APK file

1. Copy the `.apk` to the device (AirDrop alternative: Google Drive, email, USB file transfer, etc.).
2. Open the file with the system **Files** app or a file manager.
3. Tap **Install** and confirm.

### 5.4 Option C — QR code from EAS (internal distribution)

If your Expo account has internal distribution enabled, the finished build page may show a QR code. Scan it on the Android device to download and install the APK in one step.

### Checklist

- [ ] App appears in the launcher as **Misbaha**
- [ ] Cold launch succeeds (splash → home)

---

## Phase 6 — Smoke-test on device

Verify on a physical device before sharing the APK widely:

- Cold launch and splash
- Counting gestures (tap, double-tap, long-press)
- Goals, PDF export, sharing
- Urdu fonts and RTL layout
- Insights scenes
- Settings / theme persistence after force-quit
- Audio / haptics if enabled

---

## Phase 7 — Sharing updates

When you publish a new sideload build:

1. Increment `expo.android.versionCode` in `app.json`.
2. Bump `expo.version` if the release is user-visible.
3. Run tests, then `npm run build:sideload`.
4. Distribute the new `.apk`.
5. Tell testers to install over the old build (`adb install -r` or tap the new APK).

**Note:** Sideload users do **not** get automatic updates. Each release is a manual install unless you later ship on Google Play.

---

## Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Different signing key than installed app | Uninstall old build, reinstall; or keep the same EAS keystore |
| `INSTALL_FAILED_VERSION_DOWNGRADE` | `versionCode` not incremented | Bump `expo.android.versionCode` and rebuild |
| `App not installed` (generic) | Corrupt download or blocked source | Re-download APK; check “Install unknown apps” for Files/Chrome |
| `adb: device unauthorized` | USB debugging not accepted | Accept the RSA prompt on the device |
| Build queue slow | EAS shared workers | Wait, or use a paid EAS plan for priority |

---

## Play Store vs sideload

| Profile | Output | Use |
| --- | --- | --- |
| `sideload` | `.apk` | Direct install on devices |
| `preview` | `.apk` | Same as sideload (legacy alias) |
| `production` | `.aab` | Google Play submission |

Play Store listing copy lives under [`store/`](../store/README.md). For Play submission use `eas build --platform android --profile production`, not the sideload profile.

---

## Quick command reference

```bash
# Login
eas login

# Quality gate
npm run typecheck && npm test

# Build sideload APK
npm run build:sideload

# List / download builds
eas build:list
eas build:download --platform android --profile sideload

# Android signing
eas credentials --platform android

# Install via USB
adb install -r misbaha.apk
```

---

## Related docs in this repo

- [`README.md`](../README.md) — development setup
- [`store/README.md`](../store/README.md) — Play Store listings
- [`docs/PUBLISHING-APPLE-APP-STORE.md`](./PUBLISHING-APPLE-APP-STORE.md) — iOS App Store guide

---

**Contact:** [salam@zikrapps.com](mailto:salam@zikrapps.com) · **Zikr Apps**
