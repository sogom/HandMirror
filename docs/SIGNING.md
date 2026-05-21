# Signing Notes

Unsigned builds are fine for a small beta, but public distribution gets much smoother once builds are signed.

## macOS

For direct distribution outside the Mac App Store:

- Join the Apple Developer Program.
- Create a Developer ID Application certificate.
- Configure `electron-builder` signing credentials in CI.
- Notarize the built app or DMG.

Typical CI secrets for Electron builds:

- `CSC_LINK`: base64 or URL for the exported signing certificate.
- `CSC_KEY_PASSWORD`: certificate password.
- `APPLE_API_KEY`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`: App Store Connect API key values for notarization.

## Windows

For direct download outside the Microsoft Store:

- Use a code signing certificate or Microsoft Trusted Signing/Azure Artifact Signing.
- Sign the installer and portable `.exe`.
- Expect reputation to build over time, especially for new publishers and new certificates.

Until signing is configured, Windows may show an unknown publisher or SmartScreen warning.
