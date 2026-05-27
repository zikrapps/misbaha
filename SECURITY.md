# Security

## Reporting a vulnerability

If you find a security issue, please open a private report via GitHub **Security Advisories** on this repository, or email **Zikr Apps** at [salam@zikrapps.com](mailto:salam@zikrapps.com). Do not file public issues for exploitable vulnerabilities.

## Secrets and credentials

- This app does **not** ship API keys or backend credentials in source code.
- Android signing keys are managed by [EAS](https://docs.expo.dev/app-signing/app-credentials/); do not commit `.jks`, `.p12`, or `credentials.json`.
- For CI builds, store `EXPO_TOKEN` only in your CI secret store (e.g. GitHub Actions secrets).

## Data handling

- Prayer/dhikr counts and goals are stored **locally** on the device via AsyncStorage.
- There is no in-app account system or analytics SDK in the current codebase.
- PDF export and external links (Quran.com, Sunnah.com) are initiated by the user.

## Dependencies

Run `npm audit` periodically. Most reported issues are in dev/build tooling, not runtime app code.
