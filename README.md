# Barista Pro — Full Build (Expo managed, GitHub-only CI)

## Run in Codespaces
```bash
npm i
npm run start   # use QR / emulator
```

## Project structure
- Expo + TS + SQLite (Glass Hybrid UI)
- Screens: Home, Audit, Attestation, Materials, Menu, Trends, Tech, Settings
- GitHub Actions: android-gradle.yml (prebuild + Gradle) → APK/AAB
- No external services (only GitHub)

## CI (GitHub-only)
Create Secrets in GitHub → Settings → Secrets and variables → Actions:
- ANDROID_KEYSTORE_BASE64
- ANDROID_KEYSTORE_PASSWORD
- ANDROID_KEY_ALIAS
- ANDROID_KEY_ALIAS_PASSWORD

Trigger:
- push tag v1.0.0 (or workflow_dispatch)
Artifacts:
- app-release.apk
- app-release.aab
- mapping.txt
```
