# Checky - AI 계약서 분석 서비스

> **숨은 위험까지 찾아내는 든든한 계약 비서, Checky**
> AI를 활용한 계약서 독소조항 분석 및 개선 제안 서비스

## 🎯 개발 동기

### 문제 인식

* **복잡한 법률 용어**: 일반인이 계약서의 법률 용어와 구조를 이해하기 어려움
* **숨겨진 위험 요소**: 전문가가 아니면 찾기 힘든 불리한 조항 존재
* **높은 법률 상담 비용**: 개인/소상공인의 법률 상담 접근성 한계
* **계약서 분석의 어려움**: 근로·임대차·프리랜서 계약서 등 일상적 문서도 이해 어려움

### 해결 방안

* **AI 기반 자동 분석**: 계약서 업로드 → AI가 자동 분석
* **위험도 분류**: Danger / Warning / Safe 단계별 분류
* **시각화 제공**: 위험도 지수와 그래프를 통한 직관적 이해
* **실시간 Q\&A**: 분석 결과 기반 AI 챗봇과 질의응답
* **개인정보 보호**: 업로드 파일 24시간 내 영구 삭제

---

## 🚀 서비스 소개

### 주요 기능

1. **계약서 업로드 및 분석**

   * PDF, DOCX, TXT, HWP, 이미지 등 지원
   * OCR 적용, 단계별 진행률 표시

2. **위험도 분석 및 시각화**

   * 3단계 위험도 (Danger / Warning / Safe)
   * 안전 지수 계산 및 그래프 시각화

3. **상세 분석 리포트**

   * 조항 단위 분석 + 개선 권고사항
   * 위험 원인 및 법적 근거 제시
   * PDF 다운로드 지원

4. **AI 챗봇 Q\&A**

   * 업로드 문서 기반 실시간 질의응답
   * 컨텍스트 유지, 맞춤형 답변

5. **보안 및 개인정보 보호**

   * 업로드 파일 24시간 후 자동 삭제
   * HTTPS 암호화 전송

---

## 🛠 기술 스택

### Frontend

* **React + TypeScript**
* **Vite**: 개발 서버 및 빌드
* **Tailwind CSS**: 스타일링
* **React Router DOM**: SPA 라우팅
* **React Markdown, Lucide React**

### Backend

* **FastAPI**
* **OpenAI**: 계약서 조항 분석
* **EasyOCR, pytesseract**: OCR 및 텍스트 추출
* **PyPDF, python-docx**: 문서 파싱
* **배포**: Render.com (BE), Vercel (FE)

---

## 📁 프로젝트 구조

### Frontend

```
src/
├── api/                    # API 통신 모듈
│   ├── api.ts             # 메인 API 함수들
│   └── uploadApi.ts       # 파일 업로드 관련 API
├── components/             # 재사용 가능한 컴포넌트
│   ├── common/            # 공통 컴포넌트 (Header, Footer)
│   ├── chat/              # 채팅 관련 컴포넌트
│   ├── ClauseCard.tsx     # 계약서 조항 카드
│   ├── FileUploadArea.tsx # 파일 업로드 영역
│   ├── LoadingModal.tsx   # 로딩 모달
│   ├── SafetyScoreBar.tsx # 안전도 시각화
│   └── types.ts           # TypeScript 타입 정의
├── layouts/               # 레이아웃 컴포넌트
│   └── MainLayout.tsx     # 메인 레이아웃
├── pages/                 # 페이지 컴포넌트
│   ├── HomePage.tsx       # 홈페이지
│   ├── UploadPage.tsx     # 파일 업로드 페이지
│   ├── AnalyzePage.tsx    # 분석 결과 페이지
│   ├── ChatPage.tsx       # AI 챗봇 페이지
│   └── FaqPage.tsx        # FAQ 페이지
├── assets/                # 정적 자원
└── App.tsx                # 메인 앱 컴포넌트
```

### Backend

```
├── app/                           # 메인 애플리케이션
│   ├── main.py                   # FastAPI 앱 진입점
│   ├── routers/                  # API 엔드포인트
│   │   ├── upload/              # 파일 업로드 관련
│   │   ├── contract/            # 계약서 분석 관련
│   │   └── chat/                # 채팅 관련
│   ├── schemas/                  # API 요청/응답 스키마
│   │   ├── upload/              # 업로드 스키마
│   │   ├── contract/            # 계약서 스키마
│   │   └── chat/                # 채팅 스키마
│   └── services/                 # 비즈니스 로직
│       ├── analyzer.py          # AI 분석 서비스
│       ├── chat_service.py      # 채팅 서비스
│       ├── openai_client.py     # OpenAI API 클라이언트
│       └── file/                # 파일 처리 서비스
│           ├── text_extractor.py # 텍스트 추출
│           └── file_cleaner.py   # 파일 정리
├── files/                        # 업로드된 파일 저장소
├── tests/                        # 테스트 코드
├── requirements.txt              # Python 의존성
├── render.yaml                   # Render 배포 설정
└── README.md
```

---

## 📋 주요 API 엔드포인트

* `POST /upload/` : 파일 업로드 (task\_id 반환)
* `GET /upload/status/{task_id}` : 업로드/분석 상태 확인
* `GET /upload/analysis/{task_id}` : 분석 결과 조회
* `POST /upload/save-analysis/{task_id}` : 분석 결과 저장
* `DELETE /upload/{task_id}` : 업로드한 파일 삭제
* `POST /contract/analyze-debug` : 디버깅용 - 원시 포인트 확인
* `POST /contract/analyze` : 계약서 AI 분석 실행
* `POST /chat/` : AI 챗봇 대화

---

## 🚀 사용 방법

### 1. 웹 서비스 이용

1. [Checky 프론트엔드](https://checky-kappa.vercel.app) 접속
2. 계약서 업로드 → 분석 결과 확인
3. AI 챗봇과 질의응답 가능

### 2. 로컬 개발 환경

* Frontend

  ```bash
  git clone https://github.com/clear-checky/checky-FE.git
  cd checky-FE
  pnpm install
  pnpm dev
  ```
* Backend

  ```bash
  git clone https://github.com/clear-checky/checky_BE.git
  cd checky_BE
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```

---

## 📈 향후 계획

* **계약서 종류 확장** (임대차, 프리랜서 등)
* **AI 모델 고도화**
* **다국어 지원** (영어, 중국어 등)
* **모바일 앱 출시** (iOS, Android)
* **기업용 서비스** (대량 계약 관리, 협업 기능)

---


# 유튜브 시연 영상
https://youtu.be/5hzgb3tXBZ4


---

**Checky와 함께 더 안전한 계약서를 작성하세요! 🛡️**
