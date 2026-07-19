# ISTQB CTFL 완전 가이드
> Certified Tester Foundation Level
> 목적: 국제적으로 인정되는 SW 테스터 자격증
> 예상 준비 기간: 4~8주

---

## 1. ISTQB란?

International Software Testing Qualifications Board.  
전 세계 125개국에서 인정하는 소프트웨어 테스팅 자격증 체계.

### 자격증 레벨 구조

```
Foundation Level (CTFL) ← 지금 목표
        ↓
Advanced Level
├── Test Analyst (CTAL-TA)
├── Test Manager (CTAL-TM)
└── Technical Test Analyst (CTAL-TTA)
        ↓
Expert Level
```

### 왜 CTFL이 필요한가?

- 독일/영국/싱가포르 QA/Validation Engineer JD의 70% 이상에 "ISTQB" 명시
- A-SPICE, ISO 26262 공부의 기반 지식이 됨 (테스트 레벨, 테스트 타입 개념 공유)
- 당신의 경험을 공식 언어로 표현할 수 있게 해줌
- 취득 후 이력서와 LinkedIn에 바로 추가 가능

---

## 2. 시험 정보

### 현행 버전

**CTFL v4.0** (2023년 4월 출시, 현재 기준 최신)

### 시험 형식

| 항목 | 내용 |
|------|------|
| 문항 수 | 40문항 |
| 시험 시간 | 60분 |
| 문제 유형 | 객관식 (4지선다) |
| 합격 기준 | **65% 이상 (26/40)** |
| 언어 | 영어, 한국어 등 선택 가능 |
| 오픈북 여부 | 불가 (closed book) |

### 응시 자격

**없음.** 누구나 응시 가능. 사전 교육 이수 의무 없음.

---

## 3. 한국에서 시험 보는 방법

### 시험 기관

**KSTQB** (한국소프트웨어테스팅협회)  
공식 웹사이트: https://www.kstqb.org

### 등록 절차

1. kstqb.org 접속
2. 시험 일정 확인 (연 3~4회, 격월 단위)
3. 회원가입 후 시험 신청
4. 결제 (약 70,000~100,000원)
5. 신분증 지참하여 시험장 방문

### 시험 일정

- 연 3~4회 시행 (보통 4월, 7월, 10월, 1월)
- 시험장: 서울 및 주요 도시

### 온라인 시험 옵션 (해외/자택)

일부 Authorized Training Provider (ATP)를 통해 온라인 응시 가능.  
대표 기관: Pearson VUE 파트너사를 통해 글로벌 응시 가능.

---

## 4. 시험 범위 (CTFL v4.0 실라버스)

### 챕터별 구성

| 챕터 | 제목 | 비중 |
|------|------|------|
| 1 | Fundamentals of Testing | 약 20% |
| 2 | Testing Throughout the Software Development Lifecycle | 약 12% |
| 3 | Static Testing | 약 12% |
| 4 | Test Analysis and Design | 약 24% |
| 5 | Managing the Test Activities | 약 16% |
| 6 | Test Tools | 약 10% |

### 핵심 개념 — 반드시 숙지

**챕터 1: 테스팅 기초**
- 테스팅의 7가지 원칙 (Seven Testing Principles)
- 테스팅 vs 디버깅 차이
- 오류(Error) → 결함(Defect) → 장애(Failure) 구분

**챕터 2: SDLC와 테스팅**
- V-model (당신이 이미 실무에서 하고 있는 것)
- 테스트 레벨: 단위(Unit) → 통합(Integration) → 시스템(System) → 인수(Acceptance)
- 테스트 타입: 기능(Functional), 비기능(Non-Functional), 구조적(Structural), 변경 관련

**챕터 4: 테스트 분석과 설계 (가장 중요)**
- 블랙박스 기법
  - Equivalence Partitioning (동치 분할)
  - Boundary Value Analysis (경계값 분석)
  - Decision Table Testing
  - State Transition Testing
- 화이트박스 기법
  - Statement Coverage
  - Branch Coverage
- 경험 기반 기법: Exploratory Testing, Error Guessing

---

## 5. 공부 방법

### 준비 기간별 전략

**4주 집중 (빠른 취득)**
- Week 1: 실라버스 챕터 1~3 독파
- Week 2: 챕터 4~6 독파
- Week 3: 전 챕터 복습 + 모의고사 2회
- Week 4: 취약 부분 보완 + 모의고사 3회 이상

**8주 여유 (이해 중심)**
- 주당 챕터 1개씩 → 5주 완료
- 남은 3주: 복습 + 모의고사

### 공부 방법

1. **실라버스 먼저** — 시험은 실라버스에서만 나옴. 실라버스를 교과서처럼 읽기.
2. **용어 정의 암기** — ISTQB는 용어 정의를 정확히 묻는 문제가 많음. Glossary 필수 암기.
3. **모의고사 풀기** — 최소 3~4회 이상, 오답 분석 반드시 수행.
4. **실무 연결** — "내가 AVN 검증할 때 이게 Regression Test였구나" 식으로 연결하면 암기 쉬움.

---

## 6. 학습 자료

### 필수 (무료)

| 자료 | 링크 | 내용 |
|------|------|------|
| **CTFL v4.0 실라버스** | istqb.org/downloads | 공식 PDF, 무료 다운로드 |
| **ISTQB Glossary** | glossary.istqb.org | 용어 정의 공식 출처 |
| **모의고사** | istqb.org/certifications/certified-tester | 공식 샘플 문제 제공 |
| **Free ISTQB Exams** | guru99.com/istqb.html | 무료 모의고사 |

### LinkedIn Learning (보유 중)

- "ISTQB Foundation" 또는 "Software Testing" 검색
- 특히 "Preparing for ISTQB Foundation Level" 강의 확인

### Coursera (보유 중)

- "Software Testing and Automation" (University of Minnesota)
- "Introduction to Software Testing" 등 관련 강의

### 구매 추천 교재

| 교재 | 가격 | 추천 이유 |
|------|------|----------|
| **"Foundation of Software Testing: ISTQB Certification"** by Rex Black 등 | 약 4~5만원 | 가장 표준 교재, 실라버스와 완전 대응 |
| **"Foundations of Software Testing"** by Dorothy Graham | 약 4만원 | 개념 설명이 명확 |

→ 둘 중 하나만 구매해도 충분. Rex Black 책 추천.

### 무료 유튜브 강의

- "ISTQB Foundation Level 2023" 검색 → 한국어/영어 강의 다수 존재
- Agile Testing Courses 채널

---

## 7. 모의고사 전략

### 합격 기준 이해

40문항 중 26개 맞으면 합격 (65%).  
→ 즉, **14개는 틀려도 됩니다.**

### 모의고사 활용법

1. 시간 재고 60분 내에 40문항 풀기
2. 확실하지 않은 문항은 표시하고 일단 진행
3. 남은 시간에 표시한 문항 재검토
4. 오답 분석 시: 실라버스 해당 챕터 다시 읽기
5. 3회 이상 풀어서 70% 이상 나오면 시험 등록

### 자주 틀리는 유형

- "다음 중 테스팅의 원칙이 **아닌** 것은?" → 부정 질문 주의
- True/False/Not Given 형식 혼동
- 비슷한 용어 혼동: Verification vs Validation, Error vs Defect vs Failure

---

## 8. 자격증 취득 후 활용

### 이력서/LinkedIn

```
Certifications:
- ISTQB Certified Tester Foundation Level (CTFL v4.0), KSTQB, 2026
```

### 다음 단계 — 자동차 특화 경로 (CT-AuT 우선 권장)

CTFL 취득 후 자동차 SW QA 커리어에는 **CT-AuT가 CTAL보다 우선순위가 높습니다.**

```
CTFL (Foundation) ← 지금 목표
    ↓
CT-AuT (Automotive Software Tester) ← 자동차 특화, 다음 목표
    ↓
CTAL-TA or Intacs CPA               ← 경력 2~3년 후
```

#### ISTQB CT-AuT (Certified Tester Automotive Software Tester)

| 항목 | 내용 |
|------|------|
| 전제조건 | **CTFL 보유만으로 응시 가능** (학위, 경력 불필요) |
| 시험 | 40문항, 60분, 65% 합격 |
| 비용 | 약 100,000~150,000원 (KSTQB 기준) |
| 준비 기간 | CTFL 취득 후 4~6주 추가 |
| 공식 실라버스 | istqb.org 무료 다운로드 |

**CT-AuT가 당신에게 특히 유리한 이유:**
- 실라버스 커버리지: 자동차 SDLC, V-model, A-SPICE 기반 테스팅, ADAS/기능안전 테스팅 포함
- 학력 없이 취득 가능한 자동차 SW 국제 전문 자격증
- 독일/영국 JD에서 "ISTQB" + "Automotive" 동시 요구하는 포지션에 직접 대응
- CTFL 공부 내용의 80%가 CT-AuT와 겹쳐 추가 부담 적음

**학습 자료 (무료):**
- CT-AuT 실라버스: istqb.org → Certifications → Specialist → Automotive
- 공식 샘플 문제: istqb.org에서 무료 제공
- 추가 자료: `08_Additional_Certs_Free_Study.md` 참고

**이력서 표기:**
```
Certifications:
- ISTQB Certified Tester Foundation Level (CTFL v4.0), KSTQB, 2026
- ISTQB Certified Tester Automotive Software Tester (CT-AuT), KSTQB, 2026
```

#### 그 이후 선택지

| 자격증                        | 조건                      | 당신과 관련성                     |
| -------------------------- | ----------------------- | --------------------------- |
| **Intacs CPA**             | CT-AuT + A-SPICE 자가학습 후 | A-SPICE Assessor — 해외 취업 핵심 |
| **CTAL-TA (Test Analyst)** | CTFL 후                  | 테스트 분석 심화                   |
| **ISO 26262 FSE**          | CT-AuT 후                | 기능안전 전문가                    |

→ 권장 순서: **CTFL → CT-AuT → Intacs CPA** (ISO 26262 FSE는 병행)

---

## 9. 현재 경력과 연결 포인트

당신이 이미 실무에서 하고 있는 것들이 CTFL 개념과 정확히 일치합니다:

| 실무 경험 | CTFL 개념 |
|----------|----------|
| BAT (Baseline Acceptance Test) | Acceptance Testing |
| Regression Test | Regression Testing |
| Full TC 수행 | Test Execution |
| CANoe로 통신 검증 | Test Tool 활용 |
| 이슈 발견 및 리포팅 | Defect Management |

→ 시험 보기 전부터 이미 절반은 알고 있는 상태입니다.  
공부 기간을 짧게 잡아도 됩니다.
