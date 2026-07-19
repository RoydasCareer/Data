# ISTQB CT-AuT 완전 가이드
> Certified Tester Automotive Software Tester
> 전제조건: CTFL 보유 (학위·경력 불필요)
> 준비 기간: CTFL 취득 후 4주
> 비용: 약 100,000~150,000원

---

## 1. CT-AuT란 무엇인가

ISTQB(국제소프트웨어테스팅자격위원회)의 전문가 레벨 자격증.
자동차 소프트웨어 테스팅에 특화된 유일한 ISTQB 국제 자격증.

### CTFL과 CT-AuT의 차이

| 항목 | CTFL | CT-AuT |
|------|------|--------|
| 성격 | SW 테스팅 일반 기초 | 자동차 도메인 특화 |
| 내용 | 테스트 원칙·기법·관리 | A-SPICE, ISO 26262, ADAS, 통신 테스팅 |
| 시장 가치 | 모든 SW 업계 인정 | 자동차 SW 업계에서 차별화 |
| 전제조건 | 없음 | CTFL 필수 |
| 취득 후 이력서 | "ISTQB Certified" | "ISTQB Automotive Specialist" |

### 왜 당신에게 특히 유리한가

CT-AuT 실라버스의 챕터 5(통신 테스팅)가 UDS, CAN, Automotive Ethernet을
직접 다룹니다. 5년+ 진단통신 실무 경험이 시험 준비 시간을 절반으로 줄여줍니다.

---

## 2. 시험 정보

| 항목 | 내용 |
|------|------|
| 문항 수 | 40문항 |
| 시간 | 60분 |
| 합격 기준 | 65% (26/40) |
| 형식 | 객관식 4지선다 (closed book) |
| 언어 | 영어 (한국어 미지원 — 영어로 응시) |
| 주관 | KSTQB (한국소프트웨어테스팅협회) |
| 비용 | 약 100,000~150,000원 |
| 유효기간 | 영구 |

---

## 3. 실라버스 챕터별 상세 내용

공식 실라버스: **istqb.org → Certifications → Specialist Level → Automotive Software Tester**
(무료 PDF 다운로드 가능)

---

### Chapter 1: 자동차 도메인 및 소프트웨어 개발 (약 15%)

**핵심 내용:**
- 자동차 산업의 공급망 구조: OEM → Tier1 → Tier2
- V-model in 자동차 개발 (일반 V-model과 차이점)
- 자동차 SW 특수성: 실시간 제약, 안전성, 긴 수명주기

**당신의 경험 연결:**
```
이지디에스 (Tier2) → FPT Korea (Tier1 협력) → 현대 연구소 (OEM)
= 공급망 전 계층 경험
```

**공부 방법:**
- 실라버스 챕터 1 정독 (약 10페이지)
- 자동차 공급망 그림 직접 그려보기
- "automotive supply chain OEM Tier1 Tier2" YouTube 검색 → 1개 영상 시청

---

### Chapter 2: A-SPICE 기반 테스팅 (약 20%)

**핵심 내용:**
- A-SPICE PAM에서 테스팅 관련 프로세스
  - SWE.4: 소프트웨어 단위 검증
  - SWE.5: 소프트웨어 통합 테스팅
  - SWE.6: 소프트웨어 적격성 테스팅
  - SYS.4: 시스템 통합 테스팅
  - SYS.5: 시스템 적격성 테스팅
- Work Product와 테스트 증거 관계
- 추적성(Traceability): 요구사항 → 테스트케이스 → 결과

**당신의 경험 연결:**
```
HKMC AVN Regression Test → SWE.6
Full TC 수행 → SWE.5/SWE.6
이슈 관리 → SUP.9
```

**공부 방법:**
- A-SPICE PAM v3.1 다운로드 (automotivespice.com 무료)
- SWE.4~SWE.6, SYS.4~SYS.5 Base Practice만 먼저 읽기
- 03_A-SPICE_Intacs_CPA.md 병행 참고

---

### Chapter 3: ISO 26262 기반 안전 테스팅 (약 15%)

**핵심 내용:**
- ASIL(Automotive Safety Integrity Level) A~D 분류
- 안전 관련 테스팅 요구사항 (Part 6, Part 8)
- ASIL별 구조적 커버리지 요구: MC/DC Coverage (ASIL D)
- 안전 케이스와 테스트 증거 관계

**당신의 경험 연결:**
```
IVI 시스템은 일부 기능이 ASIL A~B 대상
Pre-production 검증 → Part 8 Validation
Regression Test → 변경 후 안전 재검증
```

**공부 방법:**
- 04_ISO_26262_FSE.md 핵심 개념 먼저 정독
- "ASIL 판정 연습": 시나리오 보고 ASIL 결정 (YouTube "HARA ASIL example" 검색)
- MC/DC Coverage 개념 이해 (CTFL 구조적 커버리지 챕터 확장)

---

### Chapter 4: ADAS 테스팅 (약 15%)

**핵심 내용:**
- ADAS 시스템 구조: 센서 → 퍼셉션 → 플래닝 → 액추에이터
- 센서 종류별 특성: 카메라, 레이더, LiDAR, 초음파
- ADAS 테스팅 방법: 실차, HiL, SiL, MiL
- SOTIF (ISO 21448): 의도된 기능의 안전성

**당신의 경험 연결:**
```
RSPA2(후방 주차 지원) ADAS QA 경험 → 실차 ADAS 테스팅 직접 해당
```

**공부 방법:**
- Coursera "Self-Driving Cars" 중 센서 퓨전 모듈 시청 (무료 감사)
- "ADAS testing methodology" YouTube 검색
- SAE J3016 레벨 분류 (자율주행 레벨 0~5) 암기

---

### Chapter 5: 통신 및 진단 테스팅 (약 20%) ← 당신의 핵심 강점

**핵심 내용:**

**CAN 버스 테스팅:**
- CAN 프레임 구조: ID, DLC, Data
- 비트 타이밍, 에러 프레임
- CANoe를 이용한 CAN 버스 시뮬레이션

**UDS(ISO 14229) 테스팅:**
- 서비스 구조: Service ID + Sub-function + Parameters
- 주요 서비스:
  - 0x10: DiagnosticSessionControl
  - 0x11: ECUReset
  - 0x22: ReadDataByIdentifier
  - 0x27: SecurityAccess
  - 0x31: RoutineControl
  - 0x34/0x36/0x37: 플래시 프로그래밍
  - 0x85: ControlDTCSetting
- NRC(Negative Response Code) 처리
- 타이밍 파라미터: P2, P2*, S3

**DoIP(ISO 13400) 테스팅:**
- DoIP 아키텍처: DoIP Edge Node, DoIP Gateway
- 세션 수립 과정: Activation → Routing Activation → Diagnostic Message
- Ethernet 기반 진단의 특성

**CAN과 DoIP 비교 테스팅:**
- 동일 UDS 서비스를 CAN/DoIP로 각각 테스트하는 방법
- 통신 지연 측정, 타임아웃 처리

**당신의 경험 연결:**
```
이지디에스: UDS 22/27/31 서비스 실차 분석 = 이 챕터 전부 해당
DoIP 프로젝트(JLR): DoIP 세션 수립, Routing Activation = 직접 해당
CANoe 5년+: CAN 버스 시뮬레이션 도구 실사용 = 직접 해당
```

**공부 방법:**
- 이 챕터는 읽는 것만으로 충분 (이미 5년+ 실무)
- 용어를 영어로 표현하는 연습에 집중
  - "진단 세션" → "Diagnostic Session"
  - "서비스 요청/응답" → "Service Request/Response"
  - "부정 응답" → "Negative Response"
- 시험 문제 유형: "다음 중 UDS 서비스가 아닌 것은?" 형식

---

### Chapter 6: HiL/SiL/MiL 테스팅 (약 15%)

**핵심 내용:**
- MiL (Model in the Loop): 모델 단계 시뮬레이션
- SiL (Software in the Loop): 코드 단계 시뮬레이션
- HiL (Hardware in the Loop): 실제 ECU + 시뮬레이터
- dSPACE, National Instruments VERISTAND 도구
- CANoe와 HiL 연동

**당신의 경험 연결:**
```
CANoe 기반 테스팅 = HiL 환경에서의 통신 테스팅과 동일 맥락
```

**공부 방법:**
- "HiL testing automotive" YouTube 검색 → 개념 영상 1~2개
- dSPACE 공식 사이트 → "HiL Simulation" 개요 페이지 읽기 (무료)
- 실라버스 챕터 6은 개념 이해만으로 충분 (시험 비중 낮음)

---

## 4. 4주 학습 계획 (CTFL 취득 직후)

### 전제조건 확인
- CTFL 자격증 취득 완료
- CT-AuT 실라버스 PDF 다운로드 완료 (istqb.org)
- 공식 샘플 문제 다운로드 완료

---

### Week 1: 챕터 1~3 정독 + 실무 연결

| 요일 | 학습 내용 | 시간 |
|------|----------|------|
| 월 | Chapter 1 정독 + 자동차 공급망 정리 | 1.5시간 |
| 화 | Chapter 2 정독 (A-SPICE) + SWE.4~SWE.6 BP 정리 | 2시간 |
| 수 | Chapter 3 정독 (ISO 26262) + ASIL 판정 연습 | 1.5시간 |
| 목 | Chapter 1~3 복습 + 당신의 경험 → ISTQB 언어 변환 메모 | 1시간 |
| 금 | 공식 샘플 문제 1회 풀기 (40문항) | 1시간 |
| 주말 | 오답 분석 + 해당 챕터 재독 | 1시간 |

---

### Week 2: 챕터 4~6 정독 + 심화

| 요일 | 학습 내용 | 시간 |
|------|----------|------|
| 월 | Chapter 4 정독 (ADAS) + 센서 종류 정리 | 1.5시간 |
| 화 | Chapter 5 정독 (통신/진단) — 핵심 챕터, 천천히 | 2시간 |
| 수 | Chapter 5 복습: UDS 서비스 ID 영어 표현 연습 | 1시간 |
| 목 | Chapter 6 정독 (HiL/SiL/MiL) | 1시간 |
| 금 | 전 챕터 핵심 용어 플래시카드 만들기 (Anki 앱) | 1시간 |
| 주말 | 공식 샘플 문제 2회 풀기 | 1시간 |

---

### Week 3: 통합 복습 + 모의고사

| 요일 | 학습 내용 | 시간 |
|------|----------|------|
| 월 | 전 챕터 요약 노트 1회 정독 | 1시간 |
| 화 | 모의고사 1회 (시간 재고, 60분) | 1시간 |
| 수 | 오답 분석 → 해당 챕터 재독 | 1.5시간 |
| 목 | 취약 챕터 집중 보완 | 1.5시간 |
| 금 | 모의고사 2회 | 1시간 |
| 주말 | 오답 분석 + CTFL 개념 연결 복습 | 1시간 |

---

### Week 4: 마무리 + 시험 등록

| 요일 | 학습 내용 | 시간 |
|------|----------|------|
| 월 | 핵심 용어 최종 점검 (Anki 플래시카드) | 30분 |
| 화 | 모의고사 3회 | 1시간 |
| 수 | 오답 분석 | 30분 |
| 목 | 가볍게 전체 실라버스 훑기 | 30분 |
| 금 | 시험 전날 — 컨디션 관리 | 없음 |
| 주말 | **시험 응시** |  |

**70% 이상 나오면 시험 응시. 미달 시 1주 연장.**

---

## 5. 무료 학습 자료 전체 목록

| 자료 | 입수 방법 | 용도 |
|------|----------|------|
| **CT-AuT 실라버스 공식 PDF** | istqb.org → Certifications → Specialist | 교과서 (필수) |
| **공식 샘플 문제** | 실라버스 페이지 하단 | 시험 유형 파악 (필수) |
| **ISTQB Glossary** | glossary.istqb.org | 용어 정의 암기 |
| **A-SPICE PAM v3.1** | automotivespice.com | Chapter 2 심화 |
| **Anki 앱** | apps.ankiweb.net (무료) | 플래시카드 암기 |
| **"ADAS testing automotive" YouTube** | YouTube 검색 | Chapter 4 보조 |
| **"DoIP ISO 13400" YouTube** | YouTube 검색 | Chapter 5 복습 |

### LinkedIn Learning (보유 중)

"Automotive Software Testing" 검색 → CT-AuT 관련 강의 확인

---

## 6. 시험 등록 절차 (KSTQB)

### Step 1: KSTQB 사이트 접속
- URL: kstqb.org
- 회원가입 (무료)

### Step 2: 시험 일정 확인
- "시험 안내" → CT-AuT 일정 확인
- CTFL 자격증 번호 입력 필요 (전제조건 확인용)
- 연 2~3회 시행

### Step 3: 접수 및 결제
- 온라인 접수
- 비용: 약 100,000~150,000원
- 신용카드/계좌이체

### Step 4: 시험 응시
- 시험장 지참물: 신분증, CTFL 자격증 사본
- 영어 시험 (사전 미지참)
- 60분, 40문항

### Step 5: 결과 확인 및 인증서 발급
- 보통 2~3주 후 결과 발표
- 디지털 배지 + 공식 인증서 발급
- LinkedIn 자격증 섹션에 추가

---

## 7. 이력서 · LinkedIn 표기

```
Certifications:
- ISTQB Certified Tester Foundation Level (CTFL v4.0), KSTQB, 2026
- ISTQB Certified Tester Automotive Software Tester (CT-AuT), KSTQB, 2026
```

LinkedIn Skills 섹션 추가:
- Software Testing
- Automotive Software Testing
- ISTQB
- Test Automation
- Diagnostic Communication

---

## 8. 시험에서 자주 나오는 유형

### 유형 1: 용어 정의 문제
> "Which of the following best describes a Diagnostic Communication test?"
→ 실라버스 Glossary 용어 정의 암기 필수

### 유형 2: A-SPICE 프로세스 매핑
> "A test engineer executes regression tests after a software update. Which A-SPICE process is being performed?"
→ SWE.6 (Software Qualification Testing)

### 유형 3: ASIL 판정
> "An IVI system failure causes driver distraction but not direct vehicle control loss. What ASIL level is most likely?"
→ ASIL A or B (시나리오별 판단 연습 필요)

### 유형 4: 부정형 질문 주의
> "Which of the following is NOT a UDS diagnostic service?"
→ 보기 중 UDS 서비스 ID가 아닌 것 찾기

### 유형 5: HiL/SiL/MiL 구분
> "Testing the ECU software without real hardware is called:"
→ SiL (Software in the Loop)

---

## 9. 취득 후 다음 단계

```
CT-AuT 취득
    ↓
Intacs CPA (A-SPICE Assessor) — 03_A-SPICE_Intacs_CPA.md 참고
    ↓
ISO 26262 FSE — 04_ISO_26262_FSE.md 참고
```

CT-AuT + Intacs CPA 조합은 독일/영국 자동차 컨설팅 회사에서
**"즉시 활용 가능한 A-SPICE Assessor"** 로 어필하는 최강 조합입니다.

---

*마지막 업데이트: 2026-06-18*
