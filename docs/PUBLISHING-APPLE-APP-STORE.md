# Publishing Misbaha to the Apple App Store

Step-by-step guide for shipping **Misbaha** (bundle ID `com.zikrapps.misbaha`) from this Expo SDK 54 project to the App Store under **Zikr Apps**.

**Official references**

- [Expo: Submit to the Apple App Store](https://docs.expo.dev/submit/ios/)
- [Expo: EAS Build setup](https://docs.expo.dev/build/setup/)
- [Expo: EAS Metadata](https://docs.expo.dev/eas/metadata/)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [App Store Connect](https://appstoreconnect.apple.com)

---

## Overview

| Item | Value in this repo |
| --- | --- |
| App name | Misbaha |
| Publisher / legal entity | Zikr Apps |
| Bundle identifier | `com.zikrapps.misbaha` |
| Current version | `1.1.0` (`app.json`) |
| EAS project ID | `0fabcd69-4005-4188-bed2-fb53d6f65b9d` |
| Support email | salam@zikrapps.com |
| Privacy policy URL | https://zikrapps.com/privacy |
| Listing metadata | [`store.config.json`](../store.config.json) |

**High-level flow**

```text
Apple Developer account
  → App Store Connect app record
  → Legal / privacy compliance
  → Screenshots + metadata
  → EAS production iOS build
  → TestFlight (recommended)
  → Submit for App Review
  → Release
```

Estimated calendar time for a first submission: **1–2 weeks** (mostly waiting on Apple enrollment, asset prep, and review). Build and upload usually take under an hour once prerequisites are done.

---

## Phase 1 — Accounts and enrollment

### 1.1 Apple Developer Program

1. Enroll at [developer.apple.com/programs](https://developer.apple.com/programs/) (**$99 USD / year**).
2. Enroll as **Zikr Apps** (organization) if you have a D‑U‑N‑S number and legal entity documents; otherwise enroll as an individual and display **Zikr Apps** as the seller name where App Store Connect allows it.
3. Accept all pending agreements in [App Store Connect](https://appstoreconnect.apple.com) and [Apple Developer](https://developer.apple.com/account) (Paid Apps Agreement, etc.).

### 1.2 Expo / EAS account

This project is already linked to EAS (`app.json` → `extra.eas.projectId`).

```bash
npm install -g eas-cli
eas login
eas whoami
```

Confirm the Expo account owns or has access to project `misbaha` on [expo.dev](https://expo.dev).

### 1.3 Checklist before moving on

- [ ] Apple Developer Program membership is **Active**
- [ ] All Apple legal agreements are **signed**
- [ ] You can sign in to App Store Connect
- [ ] You are logged into EAS CLI

---

## Phase 2 — Register the app in Apple systems

### 2.1 Register the bundle identifier

1. Open [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list).
2. **Identifiers** → **+** → **App IDs** → **App**.
3. Description: `Misbaha`
4. Bundle ID: **Explicit** → `com.zikrapps.misbaha` (must match [`app.json`](../app.json)).
5. Enable only capabilities the app actually uses. Misbaha is offline-first; you typically need no special entitlements beyond defaults.

### 2.2 Create the App Store Connect record

1. [App Store Connect](https://appstoreconnect.apple.com) → **Apps** → **+** → **New App**.
2. **Platforms:** iOS  
3. **Name:** Misbaha  
4. **Primary language:** English (U.S.)  
5. **Bundle ID:** `com.zikrapps.misbaha`  
6. **SKU:** any unique string (e.g. `misbaha-ios-2026` or `com.zikrapps.misbaha`)  
7. **User access:** Full access for your team

Save the **Apple ID** (numeric App Store Connect app ID) from **App Information** — you will use it as `ascAppId` in `eas.json` for faster submits.

### 2.3 Checklist

- [ ] Bundle ID `com.zikrapps.misbaha` exists in Apple Developer
- [ ] App record exists in App Store Connect
- [ ] You noted the **Apple ID** (`ascAppId`) from App Information

---

## Phase 3 — Legal, privacy, and compliance

Apple will reject builds that lack required legal URLs or incomplete privacy answers.

### 3.1 Host required URLs

Before submission, these must be live and reachable:

| URL | Purpose |
| --- | --- |
| https://zikrapps.com | Marketing / support (also in [`store.config.json`](../store.config.json)) |
| https://zikrapps.com/privacy | **Required** privacy policy |

The privacy policy should state clearly that Misbaha:

- Stores dhikr counts and preferences **on device only**
- Does **not** collect personal data on a backend
- Does **not** use analytics or advertising SDKs (if true at release time)
- Lists contact: salam@zikrapps.com

Constants in the app: [`src/constants/legal.ts`](../src/constants/legal.ts).

### 3.2 App Privacy (nutrition labels)

In App Store Connect → your app → **App Privacy**:

Answer honestly based on current code. For the default Misbaha build:

- **Data not linked to you:** on-device counters, theme/settings in AsyncStorage
- **Data not collected:** no account system, no server sync
- **Tracking:** No (unless you add analytics later)

Re-run this questionnaire whenever you add network, analytics, or sign-in.

### 3.3 Age rating

App Store Connect → **Age Rating** questionnaire.

Misbaha is a lifestyle / religious practice app with no objectionable content — expect a **4+** rating. Answer each question based on actual features.

### 3.4 Export compliance

Misbaha uses standard encryption (HTTPS if any network calls; otherwise OS-provided crypto). In App Store Connect, for most apps like this:

- **Uses encryption:** Yes  
- **Qualifies for exemption:** Yes (standard app, no custom cryptography)

EAS Submit will also ask about export compliance during upload; answer consistently.

### 3.5 Checklist

- [ ] Privacy policy live at https://zikrapps.com/privacy
- [ ] Support / marketing site live at https://zikrapps.com
- [ ] App Privacy questionnaire completed
- [ ] Age rating completed
- [ ] Export compliance answers saved

---

## Phase 4 — Store listing and assets

Text metadata is automated via EAS Metadata. **Screenshots are manual** in App Store Connect.

### 4.1 Push automated metadata

Listing copy lives in [`store.config.json`](../store.config.json). Push to App Store Connect:

```bash
eas metadata:push
```

This updates title, subtitle, description, keywords, URLs, copyright, and review contact. See also [`store/app-store.en-US.md`](../store/app-store.en-US.md).

Verify in App Store Connect → **App Store** tab → **English (U.S.)** that fields match expectations.

### 4.2 App icon

Already configured: [`assets/icon.png`](../assets/icon.png) (1024×1024, no transparency, no rounded corners — Apple applies the mask).

### 4.3 Screenshots (required)

Capture on a **physical device or simulator** at required sizes. Minimum set for iPhone:

| Device class | Size (portrait) | Notes |
| --- | --- | --- |
| 6.7" (iPhone 15 Pro Max, etc.) | 1290 × 2796 | Required for modern iPhones |
| 6.5" (iPhone 11 Pro Max, etc.) | 1284 × 2778 | Often accepted as alternate |
| 5.5" (optional legacy) | 1242 × 2208 | If supporting older size class |

If you support iPad (`supportsTablet: true` in `app.json`), also add **12.9" iPad Pro** screenshots (2048 × 2732).

Suggested screens to capture:

1. Home / tasbeeh counter  
2. Duas list  
3. Goal detail  
4. Insights / visualization  
5. Settings (themes, language)

Upload in App Store Connect → **App Store** → **Screenshots**.

### 4.4 Optional but recommended

- **Promotional text** — in `store.config.json` (`promoText`); updatable without a new review  
- **App preview video** — 15–30 s screen recording  
- **Review notes** — in `store.config.json` → `apple.review.contact`; add notes if reviewers need guidance (e.g. “No login; all data is local”)

### 4.5 Checklist

- [ ] `eas metadata:push` succeeded
- [ ] Screenshots uploaded for required device sizes
- [ ] iPad screenshots uploaded (if shipping universal)
- [ ] Copyright shows **2026 Zikr Apps**

---

## Phase 5 — Configure signing and EAS Submit

### 5.1 iOS credentials (first time)

EAS can create and store distribution certificate + provisioning profile:

```bash
eas credentials --platform ios
```

Choose the **production** profile and follow prompts to sign in with your Apple Developer Apple ID. Select **Let EAS handle credentials** unless you already have certificates to reuse.

### 5.2 Optional: speed up future submits

Add your App Store Connect app ID to [`eas.json`](../eas.json):

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_NUMERIC_APPLE_ID"
      }
    }
  }
}
```

Replace `YOUR_NUMERIC_APPLE_ID` with the value from App Store Connect → **App Information** → **Apple ID**.

### 5.3 Versioning

[`eas.json`](../eas.json) uses `"appVersionSource": "local"`, so iOS **version** and **build number** are set in [`app.json`](../app.json) (`expo.version` and `expo.ios.buildNumber`). Bump both when you ship user-visible releases (e.g. `1.0.0` build `1` → `1.1.0` build `2`).

### 5.4 Pre-flight quality gate

```bash
npm run typecheck
npm test
```

Fix failures before burning a production build.

### 5.5 Checklist

- [ ] iOS production credentials configured in EAS
- [ ] `ascAppId` added to `eas.json` (recommended)
- [ ] Tests and typecheck pass

---

## Phase 6 — Production iOS build

Create an App Store–ready `.ipa`:

```bash
eas build --platform ios --profile production
```

Monitor progress:

```bash
eas build:list
```

Or open the build URL printed in the terminal.

**Build + submit in one step** (after credentials and App Store Connect app exist):

```bash
eas build --platform ios --profile production --auto-submit
```

First iOS production builds often take **15–30 minutes** on EAS queues.

### Checklist

- [ ] Production build status: **Finished**
- [ ] Build shows **App Store distribution** (not simulator / internal)

---

## Phase 7 — TestFlight (recommended)

TestFlight is the safest way to validate the binary before public review.

1. After upload, wait **10–20 minutes** for Apple to process the build.
2. App Store Connect → **TestFlight** → select the build.
3. Complete **Export Compliance** and **Content Rights** if prompted.
4. **Internal testing:** up to 100 team members — no Beta App Review.
5. **External testing:** requires a short Beta App Review; good for real-device feedback.

Install via the TestFlight app on iPhone/iPad and smoke-test:

- Cold launch and splash  
- Counting gestures  
- Goals, PDF export, sharing  
- Urdu fonts and RTL layout  
- Insights scenes  
- Settings / theme persistence after force-quit  

### Checklist

- [ ] Build processed in TestFlight  
- [ ] Installed on at least one physical device  
- [ ] No crashes on launch or core flows  

---

## Phase 8 — Submit for App Review

### 8.1 Upload the build (if not using `--auto-submit`)

```bash
eas submit --platform ios --profile production
```

Select the latest production build when prompted. Alternatively upload manually with [Transporter](https://apps.apple.com/app/transporter/id1450874784) on macOS.

### 8.2 Complete the App Store version

In App Store Connect → **App Store** → **+ Version** (e.g. `1.0.0`):

1. Select the **build** you uploaded.  
2. Confirm **metadata** and **screenshots**.  
3. Set **Pricing** (free recommended unless you add IAP).  
4. Choose **App Review Information** contact: salam@zikrapps.com.  
5. Add **Notes for reviewer**, for example:

   ```text
   Misbaha is an offline dhikr counter. No login is required.
   All user data stays on device. No account or server is needed to test core features.
   ```

6. Answer **Advertising Identifier**, **Content Rights**, and **Government restrictions** if shown.

### 8.3 Submit

Click **Add for Review** → **Submit to App Review**.

Review typically takes **24–48 hours** (sometimes longer near holidays). Status updates appear in App Store Connect and via email.

### Checklist

- [ ] Build attached to version `1.0.0`  
- [ ] All App Store Connect tabs show green / complete  
- [ ] Submitted for review  

---

## Phase 9 — Release and post-launch

### 9.1 Release options

When approved, choose:

- **Manually release this version** — you click **Release** when ready  
- **Automatically release** — goes live immediately after approval  
- **Scheduled release** — pick a date/time  

### 9.2 After you are live

- App Store Connect → **Analytics** and **Ratings and Reviews**  
- Monitor salam@zikrapps.com for support  
- Plan updates: bump `expo.version` in `app.json`, rebuild, resubmit  

### 9.3 Shipping updates

For each new App Store release:

1. Increment `version` in `app.json`.  
2. Run tests.  
3. `eas build --platform ios --profile production`  
4. `eas submit --platform ios --profile production` (or `--auto-submit`)  
5. `eas metadata:push` if listing copy changed.  
6. Submit new version for review in App Store Connect.

Build numbers auto-increment via EAS remote versioning.

---

## Common rejection reasons (and how to avoid them)

| Issue | Prevention |
| --- | --- |
| Missing privacy policy | Host https://zikrapps.com/privacy before submit |
| Privacy labels don’t match behavior | Declare on-device storage only; no tracking if true |
| Broken support URL | Verify https://zikrapps.com loads |
| Incomplete metadata | Run `eas metadata:push`; fill screenshots |
| Crashes on launch | TestFlight on a real device first |
| Misleading description | Keep copy aligned with actual features in `store.config.json` |
| Export compliance | Answer consistently in upload wizard and App Store Connect |

---

## Quick command reference

```bash
# Login
eas login

# Push App Store listing text
eas metadata:push

# Manage iOS signing
eas credentials --platform ios

# Production build
eas build --platform ios --profile production

# Build + submit
eas build --platform ios --profile production --auto-submit

# Submit an existing build
eas submit --platform ios --profile production

# List builds
eas build:list
```

---

## Related docs in this repo

- [`README.md`](../README.md) — development setup  
- [`store/README.md`](../store/README.md) — store listings overview  
- [`store/app-store.en-US.md`](../store/app-store.en-US.md) — listing field checklist  
- [`store.config.json`](../store.config.json) — EAS Metadata source  

---

**Contact:** [salam@zikrapps.com](mailto:salam@zikrapps.com) · **Zikr Apps**
