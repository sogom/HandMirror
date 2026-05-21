# Release Guide

This is the recommended first public release path for HandMirror.

## 1. Publish the repository

Create a public GitHub repository and push this project.

Suggested description:

```text
A tiny circular camera mirror for macOS and Windows.
```

Before publishing, update any placeholder links in `README.md` after the repository URL exists.

## 2. Create an unsigned beta release

The GitHub Actions workflow in `.github/workflows/release.yml` builds release assets when a version tag is pushed.

```sh
git tag v0.1.0
git push origin v0.1.0
```

The workflow uploads macOS and Windows artifacts to the GitHub Release for that tag.

## 3. Keep release notes plain

For early beta releases, make the trust boundary clear:

```text
This is an unsigned beta. Windows SmartScreen and macOS Gatekeeper may show warnings.
HandMirror only displays the local camera preview and does not record or upload video.
```

## 4. Move from beta to trusted distribution

For wider distribution:

- macOS: sign with a Developer ID Application certificate and notarize.
- Windows: code sign the installer and portable executable.
- Add an app icon before a polished public launch.
- Consider auto-update only after signing is in place.
