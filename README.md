# HandMirror

단축키를 누르면 카메라로 보는 작은 동그란 손거울이 떠오르는 데스크톱 앱입니다. Windows와 macOS에서 사용할 수 있는 Electron 버전이 기본 배포판이고, Swift/AppKit 버전은 macOS 네이티브 초안으로 보존되어 있습니다.

## Download

사용자는 소스 코드를 받을 필요가 없습니다. [Latest Release](https://github.com/sogom/HandMirror/releases/latest)에서 운영체제에 맞는 설치 파일을 받으면 됩니다.

- Windows: `HandMirror Setup 0.1.0.exe` 권장, 설치 없이 써보려면 `HandMirror 0.1.0.exe`
- macOS Apple Silicon: `HandMirror-0.1.0-arm64.dmg`
- macOS Intel: `HandMirror-0.1.0.dmg`

GitHub가 자동으로 보여주는 `Source code (zip)`과 `Source code (tar.gz)`는 개발자용입니다. 앱만 쓰려면 위 설치 파일을 받으면 됩니다.

첫 beta는 unsigned build라서 Windows SmartScreen이나 macOS Gatekeeper 경고가 뜰 수 있습니다.

## Features

- 전역 단축키로 원형 카메라 미러 열기/닫기
- Windows: `Ctrl + Alt + M`
- macOS: `Option + Space`
- 손잡이 없는 원형 플로팅 창
- 창을 닫으면 카메라 스트림도 종료
- 카메라 영상 저장/업로드 없음

## Privacy

HandMirror는 로컬 카메라 미리보기만 표시합니다. 영상을 녹화하거나 서버로 보내지 않습니다. 자세한 내용은 [PRIVACY.md](./PRIVACY.md)를 확인하세요.

## Cross-platform App

```sh
cd /Users/jinuyeon/Playground/HandMirror/CrossPlatform
npm install
npm start
```

패키징:

```sh
npm run dist:mac
npm run dist:win
```

## Release

추천 공개 순서는 [docs/RELEASE.md](./docs/RELEASE.md)에 정리했습니다. GitHub Actions workflow는 `v0.1.0` 같은 태그를 push하면 macOS/Windows 산출물을 GitHub Release에 올립니다.

## Signing

첫 공개는 unsigned beta로 시작할 수 있습니다. 더 넓게 배포할 때는 Windows 코드서명과 macOS Developer ID 서명/노터라이즈를 붙이는 게 좋습니다. 준비 메모는 [docs/SIGNING.md](./docs/SIGNING.md)에 있습니다.

## macOS Native Draft

```sh
cd /Users/jinuyeon/Playground/HandMirror
sh Scripts/make_app.sh
open .build/app/HandMirror.app
```

## License

MIT
