# Store listings — Zikr Apps

**Misbaha** is the product name. **Zikr Apps** is the legal entity and store publisher.

## Developer / seller name (required manual step)

| Store | Where to set “Zikr Apps” |
| --- | --- |
| **Google Play** | Play Console → **Developer account** → public developer name → **Zikr Apps** |
| **Apple App Store** | Apple Developer Program legal entity + App Store Connect seller → **Zikr Apps** |

These names are tied to your store accounts; they cannot be set from `app.json` alone.

## Files in this folder

| File | Purpose |
| --- | --- |
| [`store.config.json`](../store.config.json) | EAS Metadata for App Store (copyright, description, URLs) |
| [`play-store.en-US.md`](./play-store.en-US.md) | Copy-paste Play Store listing text |
| [`app-store.en-US.md`](./app-store.en-US.md) | App Store checklist + `eas metadata:push` |

## Before you submit

1. Host a privacy policy at `https://zikrapps.com/privacy` (linked in both stores).
2. Ensure `https://zikrapps.com` resolves (support/marketing URL).
3. Production build: `eas build --platform all --profile production`
4. App Store metadata: `eas metadata:push`
5. Submit: `eas submit --platform ios` / `eas submit --platform android`

**Full Apple App Store guide (all phases):** [docs/PUBLISHING-APPLE-APP-STORE.md](../docs/PUBLISHING-APPLE-APP-STORE.md)

**Android sideload (APK, no Play Store):** [docs/PUBLISHING-ANDROID-SIDELOAD.md](../docs/PUBLISHING-ANDROID-SIDELOAD.md)

Contact: salam@zikrapps.com
