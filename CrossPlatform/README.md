# HandMirror CrossPlatform

Windows와 macOS에서 실행할 수 있는 Electron 버전입니다. 원형 카메라 프리뷰 창을 전역 단축키로 열고 닫습니다.

## 공개 beta 안내

현재 기본 배포는 unsigned beta입니다. Windows SmartScreen이나 macOS Gatekeeper 경고가 뜰 수 있습니다.

카메라 영상은 로컬 미리보기로만 사용합니다. 녹화하거나 업로드하지 않습니다.

## 실행

```sh
cd /Users/jinuyeon/Playground/HandMirror/CrossPlatform
npm install
npm start
```

## 단축키

- macOS: `Option + Space` 우선, 실패하면 `Command + Shift + M`
- Windows: `Ctrl + Alt + M` 우선, 실패하면 `Ctrl + Shift + M`

Windows의 `Alt + Space`는 시스템 창 메뉴 단축키라 기본값에서 제외했습니다.

## 패키징

Windows에서:

```sh
npm run dist:win
```

기본 설정은 Windows x64와 ARM64 산출물을 함께 만듭니다.

macOS에서:

```sh
npm run dist:mac
```

기본 설정은 macOS x64와 ARM64 산출물을 함께 만듭니다.

카메라 권한이 필요합니다. macOS 패키징 설정에는 카메라 권한 문구를 포함해두었습니다.

## GitHub Releases

루트의 `.github/workflows/release.yml`은 `v0.1.0` 같은 태그가 push되면 Windows/macOS 산출물을 GitHub Release에 업로드합니다.
