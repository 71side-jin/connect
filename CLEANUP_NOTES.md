# CLEANUP_NOTES

## 정리 기준
- 현재 실행 중인 최신 UI `C:\Users\jjeong\Documents\Playground\ISY_FE`를 기준으로 UI를 복사했습니다.
- 실제 모델 연결에 사용되는 모델 번들과 통합 API 서버만 최종 구조에 포함했습니다.
- 원본 파일은 영구 삭제하지 않았습니다. 최종 구조는 복사 기반으로 구성했습니다.

## 포함한 주요 파일
- UI: `src`, `public`, `index.html`, `package.json`, `package-lock.json`, `vite.config.mjs`, `tsconfig*.json`, `eslint.config.js`.
- AI/Image: `tools/image_model_bundle`.
- AI/Text: `tools/text_model_bundle`.
- AI/Video: `C:\Users\jjeong\Desktop\ISY_pt\video`에서 `__MACOSX`를 제외한 모델/문서/코드.
- AI/Multimodal: `multimodal_inference_server.py`, `_service_runtime_bundle_v3.pt`, 실행 스크립트.

## 제외한 파일
- `node_modules`: 설치 산출물. `npm install`로 복구 가능.
- `dist`: 빌드 산출물. `npm run build`로 복구 가능.
- `.git`: 원본 저장소 메타데이터.
- `.env.local`: 민감정보 가능성이 있어 복사하지 않음. `Frontend/UI/.env.example`만 생성.
- `*.log`: 실행 로그.
- `__pycache__`, `__MACOSX`: 생성/압축 부산물.

## legacy 후보
- `_legacy_candidates/runtime_bundles/_service_runtime_bundle.pt`
- `_legacy_candidates/runtime_bundles/_service_runtime_bundle_v2.pt`

위 파일들은 이전 멀티모달 런타임 번들로 보이며 현재 서버는 `_service_runtime_bundle_v3.pt`를 사용합니다. 삭제하지 않고 후보 폴더에 보관했습니다.

## 원본 zip 보관 위치
다음 원본 zip은 최종 실행 구조에 복사하지 않았습니다. 원본 위치에 그대로 남아 있습니다.
- `C:\Users\jjeong\Desktop\ISY_pt\0501_데모버전.zip`
- `C:\Users\jjeong\Desktop\ISY_pt\DeBERTa_En.zip`
- `C:\Users\jjeong\Desktop\ISY_pt\LOG_AID_ko.zip`
- `C:\Users\jjeong\Desktop\ISY_pt\이미지모델_이원석.zip`

압축 원본은 배포 실행에는 필요하지 않으며, 모델 번들 형태로 최종 구조에 포함했습니다.

## 수정한 경로
`AI/Multimodal/inference/multimodal_inference_server.py`에서 다음 상수를 새 구조 기준으로 수정했습니다.
- `RUNTIME_CACHE_PATH`
- `TEXT_MODEL_BUNDLE_DIR`
- `VIDEO_MODEL_BUNDLE_DIR`
- `IMAGE_MODEL_BUNDLE_DIR`

API 엔드포인트와 모델 로직은 임의로 변경하지 않았습니다.
