# 🐢 거북이 알림

장시간 컴퓨터 작업 시 자세 교정을 도와주는 메뉴바/트레이 앱입니다.

설정한 시간 간격마다 알림을 보내줍니다. macOS, Windows 모두 지원합니다.

---

## 다운로드

👉 [Releases](https://github.com/naaayeah/turtle-reminder/releases) 에서 다운로드

- **macOS (M1/M2/M3)**: `거북이 알림-1.0.0-arm64.dmg`
- **macOS (Intel)**: `거북이 알림-1.0.0.dmg`
- **Windows**: `거북이 알림 Setup 1.0.0.exe`

---

## 설치 및 실행

### macOS

1. `.dmg` 파일 다운로드 후 열기
2. 앱을 Applications 폴더로 드래그
3. 터미널에서 아래 명령어 한 번 실행 (최초 1회만):
```bash
sudo xattr -rd com.apple.quarantine "/Applications/거북이 알림.app"
sudo codesign --force --deep --sign - "/Applications/거북이 알림.app"
open "/Applications/거북이 알림.app"
```

### Windows

1. `.exe` 파일 다운로드 후 실행
2. 설치 완료 후 앱 실행
3. 우측 하단 시스템 트레이에서 거북이 아이콘 더블클릭

---

## 소스코드로 실행 (개발자)

**필요 사항:** Node.js 설치 ([nodejs.org](https://nodejs.org))

```bash
git clone https://github.com/naaayeah/turtle-reminder.git
cd turtle-reminder
npm install
npm start
```

### 빌드

```bash
# macOS용
npm run build

# Windows용
npm run build:win

# 둘 다
npm run build:all
```

---

## 사용 방법

1. 앱 실행 후 메뉴바(macOS) 또는 시스템 트레이(Windows)에서 거북이 아이콘 클릭
2. 알림 간격 설정 (빠른 선택: 15분 / 30분 / 1시간, 세부 조정 가능)
3. **시작** 버튼 클릭
4. 설정한 간격마다 알림 배너가 표시됩니다

---

## 기능

- 메뉴바/트레이 상주 앱
- 15분 / 30분 / 1시간 빠른 선택
- 시간/분 단위 세부 조정
- 알림 사운드 ON/OFF
- 다크모드 자동 지원
- 거북이 트랙 타이머 시각화
- macOS / Windows 지원

---

## 개발 환경

- Electron 28
- macOS (Apple Silicon / Intel)
- Windows 10/11
