# ISeeYou

ISeeYou는 텍스트, 이미지, 비디오, 멀티모달 입력을 분석해 AI 생성 가능성과 진위 판별 보조 결과를 제공하는 설명 가능한 AI(XAI) 서비스입니다. 결과 점수만 보여주는 것이 아니라, 어떤 신호가 판단에 영향을 주었는지 사용자가 확인할 수 있도록 근거와 해석 가이드를 함께 제공합니다.

> 주의: ISeeYou의 결과는 보조적 판단 도구입니다. 최종 사실 확인, 법적 판단, 저작권 판단을 대체하지 않습니다.

## 1. 전체 구조

~~~text
ISeeYou/
├── Frontend/
│   ├── UI/                     # Vite + React 프론트엔드
│   └── Admin/                  # 관리자페이지
├── AI/
│   ├── Image/                  # 이미지 AI 생성물 탐지 모델 연결 파일
│   ├── Text/                   # 한국어 LOG-AID, 영어 DeBERTa text 모델 연결 파일
│   ├── Video/                  # 7개 EfficientNet-B0 계열 비디오 앙상블 연결 파일
│   └── Multimodal/             # 통합 FastAPI 백엔드, fusion, XAI 응답 구성
├── Backend/                    # 저장/관리 서버
├── Extension/                  # Chrome 확장프로그램과 확장용 로컬 서버
├── MODEL_ARTIFACTS.md          # GitHub에 올리지 않는 모델 파일 관리 메모
├── CLEANUP_NOTES.md            # 정리 기준과 archive 후보 기록
└── README.md
~~~

## 2. 실행 순서 요약

처음 실행하는 팀원은 아래 순서대로 진행하면 됩니다.

1. GitHub에서 코드 받기
2. Hugging Face에서 모델 파일 받기
3. 모델 파일을 로컬 프로젝트 경로에 배치하기
4. 모델 서버 실행하기
5. DB 생성하고 관리자 계정 만들기
6. 저장/관리 서버 실행하기
7. 프론트엔드 실행하기
8. Chrome 확장프로그램 실행하기

## 3. 경로 표기 규칙

README의 \`<ISeeYou 프로젝트 루트>\`는 팀원이 각자 GitHub 저장소를 clone한 로컬 폴더를 의미합니다. 예를 들어 바탕화면에 clone했다면 \`C:\\Users\\<사용자명>\\Desktop\\ISeeYou\`가 될 수 있고, 다른 드라이브에 받았다면 그 경로를 사용하면 됩니다.

아래 명령은 모두 \`<ISeeYou 프로젝트 루트>\` 기준으로 실행하거나, 해당 하위 폴더로 이동해서 실행합니다.

## 4. 준비물

- Python 3.10 권장
- Node.js / npm
- Chrome 브라우저
- Git
- Hugging Face CLI 또는 huggingface_hub Python 패키지

Hugging Face CLI 설치:

~~~powershell
python -m pip install -U huggingface_hub
~~~

## 5. 코드 받기

처음 받는 경우:

~~~powershell
git clone https://github.com/jjyoon012-git/ISeeYou.git
cd ISeeYou
~~~

이미 받은 폴더가 있는 경우:

~~~powershell
cd <ISeeYou 프로젝트 루트>
git pull
~~~

## 6. 모델은 Hugging Face에서 받기

모델 가중치와 대용량 바이너리는 GitHub에 포함하지 않습니다. 현재 웹페이지와 Chrome 확장프로그램 실제 서버 전환에 필요한 모델 아티팩트는 아래 Hugging Face 저장소에 있습니다.

- Hugging Face 모델 저장소: https://huggingface.co/yoonjeongah/ISeeYou-model-weights
- 업로드 기준일: 2026-05-18
- 포함: Image, Text, Video, Multimodal 현재 연결 모델
- 제외: 이전 v3 멀티모달 bundle, 비디오 last.pt, 로그, 데이터셋, 브라우저 프로필, 환경변수/토큰

프로젝트 루트에서 다운로드합니다.

~~~powershell
cd <ISeeYou 프로젝트 루트>
hf download yoonjeongah/ISeeYou-model-weights --repo-type model --local-dir .\\_model_artifacts
~~~

다운로드 후 구조는 다음과 같습니다.

~~~text
_model_artifacts/
├── README.md
├── model_manifest.json
└── web/
    ├── Image/
    ├── Text/
    ├── Video/
    └── Multimodal/
~~~

## 7. 모델 파일 로컬 배치

다운로드한 모델 파일을 현재 코드가 참조하는 위치로 복사합니다.

~~~powershell
cd <ISeeYou 프로젝트 루트>

# Image
New-Item -ItemType Directory -Force -Path "AI\\Image\\models\\image_model_bundle\\이미지모델_이원석" | Out-Null
New-Item -ItemType Directory -Force -Path "AI\\Image\\models\\image_model_bundle\\0501_데모버전\\weights" | Out-Null
Copy-Item "_model_artifacts\\web\\Image\\scene\\best_dualstream_final.pt" "AI\\Image\\models\\image_model_bundle\\이미지모델_이원석\\best_dualstream_final.pt" -Force
Copy-Item "_model_artifacts\\web\\Image\\face\\best.pt" "AI\\Image\\models\\image_model_bundle\\0501_데모버전\\weights\\best.pt" -Force

# Text
New-Item -ItemType Directory -Force -Path "AI\\Text\\models\\text_model_bundle" | Out-Null
Copy-Item "_model_artifacts\\web\\Text\\LOG_AID_ko" "AI\\Text\\models\\text_model_bundle\\LOG_AID_ko" -Recurse -Force
Copy-Item "_model_artifacts\\web\\Text\\DeBERTa_En" "AI\\Text\\models\\text_model_bundle\\DeBERTa_En" -Recurse -Force

# Video
New-Item -ItemType Directory -Force -Path "AI\\Video\\models\\video" | Out-Null
Copy-Item "_model_artifacts\\web\\Video\\*" "AI\\Video\\models\\video" -Recurse -Force

# Multimodal
New-Item -ItemType Directory -Force -Path "AI\\Multimodal\\models" | Out-Null
Copy-Item "_model_artifacts\\web\\Multimodal\\_service_runtime_bundle_v4b.pt" "AI\\Multimodal\\models\\_service_runtime_bundle_v4b.pt" -Force
~~~

Chrome 확장프로그램을 mock 서버가 아니라 실제 모델 서버로 실행할 경우에는 Extension 쪽에도 필요한 가중치를 배치합니다.

~~~powershell
cd <ISeeYou 프로젝트 루트>

New-Item -ItemType Directory -Force -Path "Extension\\versionv9\\weights" | Out-Null
Copy-Item "_model_artifacts\\web\\Image\\face\\best.pt" "Extension\\versionv9\\weights\\best.pt" -Force

New-Item -ItemType Directory -Force -Path "Extension\\video" | Out-Null
Copy-Item "_model_artifacts\\web\\Video\\*" "Extension\\video" -Recurse -Force
~~~

## 8. 웹 모델 서버 실행

프로젝트 루트에서 실행합니다.

~~~powershell
cd <ISeeYou 프로젝트 루트>
python AI\\Multimodal\\inference\\multimodal_inference_server.py
~~~

기본 API 주소:

~~~text
http://127.0.0.1:8001
~~~

PowerShell 실행 스크립트를 사용할 수도 있습니다.

~~~powershell
cd <ISeeYou 프로젝트 루트>\\AI\\Multimodal\\inference
powershell -ExecutionPolicy Bypass -File .\\start_multimodal_backend.ps1
~~~

## 9. DB, 관리자 계정 생성

PostgreSQL을 설치해줍니다. PostgreSQL 15 이상은 대체로 동작 가능하지만, 본 프로젝트는 18.3 환경에서 개발 및 테스트했습니다.

pgAdmin4 실행 후:\
Servers → PostgreSQL → Databases → 우클릭 → Create → Database

Backend에서 .env.example 복사해서 .env파일 생성 후 []로 감싸진 부분을 수정해줍니다.

관리자 계정을 만들어줍니다.

```powershell
cd <ISeeYou 프로젝트 루트>\\Backend
python -m pip install -r requirements.txt
python create_admin.py
```

`python create_admin.py`는 관리자 아이디와 비밀번호를 직접 입력해서 생성합니다.

## 10. 웹 저장/관리 서버 실행

프로젝트 루트에서 실행합니다.

~~~powershell
cd <ISeeYou 프로젝트 루트>
python Backend\\storage_gateway_server.py
~~~

기본 API 주소:

~~~text
http://127.0.0.1:8787
~~~

## 11. 프론트엔드 실행

사용자페이지:

~~~powershell
cd <ISeeYou 프로젝트 루트>\\Frontend\\UI
npm install
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
~~~

접속 주소:

~~~text
http://127.0.0.1:5174
~~~

프론트엔드는 Vite proxy를 통해 /multimodal-api/* 요청을 http://127.0.0.1:8001 백엔드로 전달합니다.

빌드 확인:

~~~powershell
cd <ISeeYou 프로젝트 루트>\\Frontend\\UI
npm run build
~~~

관리자페이지:

~~~powershell
cd <ISeeYou 프로젝트 루트>\\Frontend\\Admin
npm install
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
~~~

접속 주소:

~~~text
http://127.0.0.1:5175
~~~

## 12. Chrome 확장프로그램 실행

### 12-1. 확장용 로컬 서버 실행

현재 로컬 테스트는 Extension/mock_server.py로 확장 UI와 페이지 배지 흐름을 확인할 수 있습니다.

~~~powershell
cd <ISeeYou 프로젝트 루트>\\Extension
powershell -ExecutionPolicy Bypass -File .\\start_extension_mock_server.ps1
~~~

기본 주소:

~~~text
http://127.0.0.1:8000
~~~

실제 모델 서버로 전환하려면 Extension/server.py를 실행하고, Extension/versionv9/weights와 Extension/video/checkpoints_* 아래에 필요한 best.pt를 배치해야 합니다.

### 12-2. Chrome에 확장 로드

1. Chrome에서 chrome://extensions 열기
2. 개발자 모드 켜기
3. 압축해제된 확장 프로그램 로드 클릭
4. 아래 폴더 선택

~~~text
<ISeeYou 프로젝트 루트>\\Extension\\extension
~~~

테스트 페이지:

~~~text
http://localhost:8000/demo/browse
~~~

확장프로그램을 새로 로드한 뒤에는 기존 페이지를 새로고침해야 content script가 다시 주입됩니다.

## 13. 현재 구현된 분석 모드

| 모드 | 현재 상태 | XAI 설명 방식 |
|---|---|---|
| Text | 한국어 LOG-AID, 영어 DeBERTa adapter 연결 | 문장 span, 표현 반복, 문체 일관성, 근거 표현, 토큰 관계 지도 |
| Image | 이미지 생성 가능성 분석 | 시각적 아티팩트, 경계/질감/조명/배경 이상 신호, 모델 판단 근거 |
| Video | 7개 비디오 모델 앙상블 | 프레임 단위 점수, 의심 구간 타임라인, 모델 의견 일치/불일치 |
| Multimodal | 여러 모달리티 신호 통합 | 모달리티별 점수, 신뢰도 낮은 입력의 영향 축소, 최종 fusion 근거 |

## 14. 모델 버전 메모

2026-05-18 기준 서비스 연결 멀티모달 모델은 final5000_gpu_anchor_fusion_v4b 기반 runtime bundle입니다.

| 후보 | Test Accuracy | Test F1 | Test ROC-AUC | 판단 |
|---|---:|---:|---:|---|
| final5000_adaptive_multimodal_fusion_v2 | 0.8795 | 0.8738 | 0.9384 | 이전 후보 |
| final5000_gpu_anchor_fusion_v6 | 0.8766 | 0.8724 | 0.9441 | 보류 |
| final5000_gpu_anchor_fusion_v4b | 0.8917 | 0.8871 | 0.9506 | 현재 연결 |

final8000 계열 학습은 일부 base 모델 중간 결과만 확인되었고, AV-sync 및 최종 fusion 산출물이 완전히 확인되지 않았기 때문에 현재 서비스에는 v4b bundle을 연결했습니다.

## 15. 주의사항

- 실제 모델 로직과 백엔드 API 경로는 임의로 바꾸지 않습니다.
- .env, API key, token, private key는 GitHub와 Hugging Face에 올리지 않습니다.
- .pt, .pkl, .safetensors 등 모델 파일은 Hugging Face 또는 외부 스토리지로만 공유합니다.
- Chrome 로컬 프로필(Extension/chrome-local-profile)과 로그 파일은 Git에 포함하지 않습니다.
- 새 모델로 교체할 때는 MODEL_ARTIFACTS.md에 모델명, 경로, 성능, 교체 사유를 기록합니다.
- README에 아직 구현되지 않은 기능을 구현된 것처럼 쓰지 않습니다.

## 16. 빠른 실행 요약

~~~powershell
# 모델 다운로드
cd <ISeeYou 프로젝트 루트>
hf download yoonjeongah/ISeeYou-model-weights --repo-type model --local-dir .\\_model_artifacts

# 모델 서버
python AI\\Multimodal\\inference\\multimodal_inference_server.py

# 저장/관리 서버
python Backend\\storage_gateway_server.py

# 프론트엔드
cd <ISeeYou 프로젝트 루트>\\Frontend\\UI
npm install
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort

cd <ISeeYou 프로젝트 루트>\\Frontend\\Admin
npm install
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort

# 확장 서버
cd <ISeeYou 프로젝트 루트>\\Extension
powershell -ExecutionPolicy Bypass -File .\\start_extension_mock_server.ps1
~~~

웹 접속:

~~~text
http://127.0.0.1:5174
~~~

~~~text
http://127.0.0.1:5175
~~~

확장 테스트:

~~~text
http://localhost:8000/demo/browse
~~~
