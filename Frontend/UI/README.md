# ISeeYou UI

## 역할
Vite + React 기반 프론트엔드입니다. 사용자는 Main, Text, Image, Video, Multimodal 페이지에서 입력을 업로드하고, 결과/XAI 설명을 확인합니다.

## 주요 페이지
- Main: 서비스 목적, 분석 모드 선택, XAI 보조 판단 안내.
- Text: 텍스트 입력, 짧은 입력 검증, 문장/표현 기반 XAI 표시.
- Image: 이미지 업로드/URL 분석, 시각 단서와 FFT/얼굴 관련 결과 표시.
- Video: 영상 업로드/URL 분석, 프레임별 확률과 7개 모델 의견 매트릭스 표시.
- Multimodal: 영상과 선택 텍스트를 함께 입력하고 모달별 점수, gate/down-weight, 융합 설명 표시.

## 주요 구조
```text
Frontend/UI/
├── src/App.tsx        # 라우팅, 페이지, 결과 대시보드, API 호출
├── src/App.css        # 전체 디자인 시스템과 반응형 스타일
├── src/pages/         # 페이지 래퍼
├── src/assets/        # SVG 시각 자료
├── public/            # GLB 로고, favicon, XAI reference image
├── vite.config.mjs    # /multimodal-api proxy 설정
└── package.json
```

## 실행
```powershell
cd C:\Users\jjeong\Desktop\ISeeYou\Frontend\UI
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## API 연결 위치
- `src/App.tsx`의 `requestAnalysis`, `requestMultimodalSections`, `requestTextSections`에서 API를 호출합니다.
- `vite.config.mjs`에서 `/multimodal-api`를 `http://127.0.0.1:8001`로 proxy합니다.
- `.env.local`은 민감정보 가능성 때문에 포함하지 않았습니다. 예시는 `.env.example`을 참고하세요.

## XAI 표시 방식
- Text: 문장 span, 표현 신호, 관계도, 사용자 설명/Tip.
- Image: 의심 영역, 주파수 비교, 모델 근거 카드.
- Video: 실제 모델 출력 기반 프레임 타임라인, 7-model x 6-frame 매트릭스, text mask 비교.
- Multimodal: 모달별 점수, availability, fusion logic, timeline evidence.

## 디자인/UX 방향
신뢰감 있는 AI 보안/검증 서비스 톤을 목표로 합니다. 과한 애니메이션보다 명확한 카드, 배지, 차트, 해석 가이드를 우선합니다.
