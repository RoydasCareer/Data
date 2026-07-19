# 추가 자격증 및 무료 학습 전략
> Career 폴더 기존 자료(IELTS, ISTQB CTFL, A-SPICE, ISO 26262)에 없는 내용
> 대상: 자동차 SW QA / 진단통신 / ADAS 테스팅 해외 취업
> 작성일: 2026-06-18

---

## 개요 — 추가로 필요한 것들

| 분류 | 항목 | 비용 | 우선순위 |
|------|------|------|---------|
| 자격증 | ISTQB CT-AuT | 약 10~15만원 | ★★★ 즉시 |
| 표준 학습 | ASAM SOVD | 무료 | ★★★ |
| 표준 학습 | UN R156 (OTA/SUMS) | 무료 | ★★ |
| 도구 | Vector Academy 무료 과정 | 무료~유료 | ★★★ |
| 포트폴리오 | 오픈소스 진단툴 | 무료 | ★★★ |
| 네트워킹 | LinkedIn/XING/SAE | 무료 | ★★★ |
| 학습 플랫폼 | Coursera/LinkedIn Learning | 보유 중 | ★★ |

---

## 1. ISTQB CT-AuT — 자동차 특화 자격증

### 개요

| 항목 | 내용 |
|------|------|
| 정식 명칭 | ISTQB Certified Tester Automotive Software Tester |
| 전제조건 | CTFL 보유 (학위·경력 불필요) |
| 시험 | 40문항, 60분, 65% 합격 |
| 취득 비용 | 약 100,000~150,000원 |
| 유효기간 | 없음 (영구) |
| 공식 사이트 | istqb.org |

### 실라버스 주요 내용

CT-AuT는 자동차 SW 테스팅에 특화된 내용을 다룹니다:

| 챕터 | 내용 | 당신의 경험 연결 |
|------|------|----------------|
| 1 | 자동차 도메인 및 SDLC | 자동차 개발 V-model 이해 |
| 2 | A-SPICE 기반 테스팅 | SWE.4~SWE.6 실무 경험 |
| 3 | 안전 관련 테스팅 (ISO 26262) | IVI QA에서 이미 수행 |
| 4 | ADAS 테스팅 | RSPA2 경험 직접 매핑 |
| 5 | 통신 테스팅 | **CAN/DoIP/UDS 실무 경험 직결** |
| 6 | HiL/SiL 테스팅 | CANoe 기반 경험 활용 |

### 4주 학습 계획 (CTFL 취득 직후)

```
Week 1: CT-AuT 실라버스 챕터 1~3 정독
        → istqb.org에서 PDF 무료 다운로드
        → 당신의 실무와 각 챕터 연결 메모

Week 2: 챕터 4~6 정독
        → 특히 챕터 5 (통신 테스팅) 집중 — UDS/DoIP 직결
        → ASAM SOVD 기초 병행 학습 (섹션 2 참고)

Week 3: 공식 샘플 문제 2회 풀기
        → istqb.org에서 무료 제공
        → 오답 분석 후 해당 챕터 재독

Week 4: 취약 부분 보완 + 시험 등록
        → KSTQB (kstqb.org)에서 신청
        → 70% 이상 나오면 응시 준비 완료
```

### 무료 학습 자료

| 자료 | 입수 방법 |
|------|----------|
| CT-AuT 실라버스 v1.0 | istqb.org → Certifications → Specialist Level → Automotive |
| 공식 샘플 문제 | 동일 페이지 하단 |
| ISTQB Glossary | glossary.istqb.org (용어 정의 필수 암기) |
| Mock 시험 | guru99.com/istqb.html (CTFL 기반이나 개념 겹침) |

---

## 2. ASAM SOVD — 다음 세대 진단 표준

### 왜 지금 배워야 하는가

DoIP는 현재 기술, **SOVD는 5년 내 주류가 될 다음 기술**입니다.

```
CAN-based UDS (과거)
    ↓
DoIP-based UDS (현재, 당신의 전문)
    ↓
ASAM SOVD (미래, Service-Oriented Vehicle Diagnostics)
```

- BMW, Mercedes, VW(CARIAD)가 SOVD 도입 로드맵 공식화
- 2025-2026년 JD에 "SOVD" 키워드 급증 중
- DoIP 경험자가 SOVD로 전환하기 가장 유리한 배경

### ASAM SOVD란

| 항목 | 내용 |
|------|------|
| 정식 명칭 | ASAM Service-Oriented Vehicle Diagnostics |
| 표준 기관 | ASAM e.V. (Association for Standardisation of Automation and Measuring Systems) |
| 핵심 개념 | HTTP/REST 기반 진단 API → 기존 UDS의 웹 서비스화 |
| 관련 기술 | OpenAPI, REST, JSON, Ethernet, DoIP |
| 무료 입수 | asam.net (Basic Spec은 무료, Full Spec은 유료) |

### 무료로 배우는 방법

**Step 1: ASAM 무료 회원가입 (즉시)**
- asam.net → "Become a Member" → "Subscriber" (무료)
- 무료 회원으로 기본 사양 문서 접근 가능

**Step 2: ASAM SOVD Overview 문서 읽기**
- asam.net → "Standards" → "SOVD"
- Overview/Introduction 문서는 무료 공개

**Step 3: YouTube "ASAM SOVD" 검색**
- ASAM 공식 채널: 개요 웨비나 무료 시청 가능
- "SOVD automotive diagnostics" 검색 → 기술 발표 자료 다수

**Step 4: GitHub 오픈소스 구현체 분석**
- ASAM SOVD 참조 구현체들이 GitHub에 공개됨
- "SOVD" + "automotive" GitHub 검색

### 당신의 UDS/DoIP 경험과 연결

| UDS/DoIP 경험 | SOVD 대응 개념 |
|--------------|--------------|
| Service ID (SID) | SOVD API Endpoint |
| DiagnosticSessionControl | /sessions resource |
| ReadDataByIdentifier | /data/{did} GET |
| ECU Reset | /operations/reset |
| Ethernet 통신 설정 | HTTP over Ethernet (동일 물리층) |

→ DoIP 경험자가 SOVD를 배우는 데 드는 시간은 신규 진입자의 1/3 수준입니다.

---

## 3. UN R156 — OTA/SUMS 규정

### 왜 필요한가

2022년 이후 EU 판매 신차에 의무 적용. 2026년 JD에 가장 빠르게 늘고 있는 키워드.

```
UN R156 = Software Update Management System (SUMS) 규정
         = 차량 OTA(Over-The-Air) 업데이트 안전 규정
```

Expleo, Horiba MIRA, TÜV 등 테스팅 회사 JD에 "UN R156", "OTA validation", "SUMS" 등장 급증.

### 무료로 배우는 방법

**Step 1: 규정 원문 무료 입수**
- unece.org → "UN Regulations" → "R156" 검색
- 영어 원문 PDF 무료 다운로드
- 핵심 섹션: Annex 1 (SUMS 요구사항), Annex 2 (인증 절차)

**Step 2: 관련 표준 연계 이해**
- ISO/SAE 21434 (사이버보안) — UN R155와 쌍
- UN R155 먼저 읽으면 R156 이해 쉬움
- 두 문서 모두 unece.org 무료

**Step 3: 실무 적용 자료**
- TÜV Rheinland 무료 웨비나: "UN R155/R156 for Automotive" — tuv.com/events
- SGS 무료 가이드: sgs.com → "Automotive" → "Cybersecurity" 검색

### 당신의 경험 연결

IVI QA에서 수행한 소프트웨어 버전 검증 업무가 SUMS 컴플라이언스와 직결됩니다:

| 현재 업무 | UN R156 매핑 |
|----------|-------------|
| 소프트웨어 버전 검증 | SUMS 소프트웨어 업데이트 추적 |
| 업데이트 후 Regression Test | 업데이트 무결성 검증 |
| 이슈 관리 | Rollback 절차 관리 |

---

## 4. Vector Academy — CANoe 공식 인증

### 왜 중요한가

5년 CANoe 사용 경험이 있어도, 이력서에는 "사용했다"만 적혀 있습니다.
Vector 공식 교육 이수 인증서가 있으면 **검증된 전문성**으로 어필 가능합니다.

### 무료 과정 (즉시 이용 가능)

| 과정명 | 내용 | 링크 |
|--------|------|------|
| **CANoe Overview** | CANoe 기초 이해 | vector.com/training |
| **Vector Academy e-Learning** | 일부 무료 온라인 강의 | elearning.vector.com |
| **AUTOSAR 기초** | AUTOSAR 아키텍처 입문 | vector.com (무료 PDF) |

### 유료 과정 (취업 후 또는 예산 확보 시)

| 과정 | 비용 | 인증 |
|------|------|------|
| CANoe Basic Training (2일) | €1,200~1,800 | Vector 공식 수료증 |
| Diagnostics with CANoe (1일) | €700~900 | Vector 공식 수료증 |
| DoIP Training | €900~1,200 | Vector 공식 수료증 |

**전략**: 무료 과정으로 시작 → 취업 후 회사 교육 예산으로 유료 과정 이수

### 무료 대안: Vector 공식 문서 학습

- vector.com → "Knowledge Base" → CANoe 관련 Application Notes 무료
- "AN-AND-1-...번" 형식의 기술 노트들이 수백 개 공개됨
- 이 내용 학습 후 이력서에 "Vector Application Notes self-study" 기재 가능

---

## 5. 오픈소스 도구로 포트폴리오 만들기

### 왜 포트폴리오가 필요한가

해외 취업에서 "5년 경험"보다 **"내가 만든 것"**이 더 강력합니다.
오픈소스 도구로 진단통신 프로젝트를 만들어 GitHub에 올리세요.

### 추천 오픈소스 도구

**1. python-can (GitHub: hardbyte/python-can)**
- CAN 통신을 Python으로 제어
- PEAK/Vector 하드웨어 지원
- 설치: `pip install python-can`
- 활용: CAN 메시지 송수신, 로그 분석 스크립트 작성

**2. udsoncan (GitHub: pylessard/udsoncan)**
- Python으로 UDS(ISO 14229) 구현
- 실제 UDS 서비스를 코드로 이해 가능
- 설치: `pip install udsoncan`
- 활용: UDS 요청/응답 분석 도구 제작

**3. Wireshark (무료, 공식)**
- DoIP 패킷 분석
- Automotive Ethernet 캡처 분석
- DoIP 경험을 시각화하여 포트폴리오에 활용

**4. PEAK PCAN-View (무료)**
- PEAK 하드웨어 공식 무료 뷰어
- CAN 메시지 모니터링 스크린샷 → 포트폴리오 자료

**5. can-isotp (GitHub: pylessard/can-isotp)**
- ISO 15765-2 (CAN transport protocol) Python 구현
- UDS 통신의 기반 레이어 이해

### 포트폴리오 프로젝트 아이디어

**프로젝트 A: UDS DID 스캐너 (난이도: 중)**
```python
# python-can + udsoncan 활용
# 연결된 ECU에서 DID(Data Identifier) 자동 스캔
# 결과를 CSV로 저장
# GitHub에 공개 → "UDS Diagnostic Scanner Tool"
```

**프로젝트 B: DoIP 연결 테스터 (난이도: 중)**
```python
# Wireshark 캡처 파일 분석 스크립트
# DoIP 세션 수립 과정 로그 파싱
# 연결 상태 리포트 자동 생성
```

**프로젝트 C: CAN 버스 모니터 (난이도: 하)**
```python
# python-can으로 CAN 메시지 실시간 모니터링
# 특정 CAN ID 필터링 + 로그 저장
# GitHub README에 스크린샷 첨부
```

### GitHub 포트폴리오 전략

```
repositories/
├── uds-scanner/           ← UDS DID 스캐너
├── doip-analyzer/         ← DoIP 패킷 분석 (Wireshark 연동)
├── can-logger/            ← CAN 버스 로거
└── automotive-notes/      ← ASAM SOVD, UN R156 학습 노트 공개
```

→ README를 영어로 작성. 회사명/내부 데이터는 절대 포함하지 말 것.
→ 학습 목적 프로젝트임을 명시하면 법적 문제 없음.

---

## 6. 무료 학습 플랫폼 활용 전략

### Coursera (보유 중) — 추천 강의

| 강의명 | 제공자 | 관련성 |
|--------|--------|--------|
| **Self-Driving Cars Specialization** | University of Toronto | ADAS, 센서 퓨전, 자율주행 이해 |
| **Embedded Systems Essentials with Arm** | Arm / Coursera | 임베디드 SW 기초 |
| **Introduction to TCP/IP** | Yonsei University | Ethernet/DoIP 이해에 도움 |
| **Software Testing and Automation** | University of Minnesota | 테스팅 방법론 |
| **Agile with Atlassian Jira** | Atlassian | 이슈 관리 도구, 해외 JD에 빈번 |

**수료증 전략**: Coursera 수료증을 LinkedIn 자격증 섹션에 추가 → 키워드 검색에 노출

### LinkedIn Learning (보유 중) — 추천 강의

| 강의명 | 내용 |
|--------|------|
| **ISTQB Foundation Exam Preparation** | CTFL 시험 준비 |
| **Automotive Software Quality** | 자동차 SW QA 개요 |
| **Functional Safety Fundamentals** | ISO 26262 입문 |
| **Agile Testing** | 해외 팀에서 자주 쓰는 방법론 |
| **Git Essential Training** | GitHub 포트폴리오 관리 필수 |

### data.camp (보유 중) — 선택적 활용

| 강의 | 관련성 |
|------|--------|
| Python Fundamentals | 오픈소스 도구 활용을 위한 Python 기초 |
| Data Analysis with Python | 테스트 데이터 분석 역량 |

→ DataCamp는 직접적 관련성보다 Python 역량 보조용. 우선순위는 낮음.

### SAE International (무료 웨비나)

- sae.org → "Events & Learning" → 무료 웨비나 다수
- 자동차 SW, ADAS, 기능안전 관련 기술 세미나
- 시청 후 LinkedIn에 "SAE webinar attendance" 추가 가능
- 특히 "AUTOSAR", "Cybersecurity", "SOTIF" 관련 세미나 우선

---

## 7. 네트워킹 전략

### LinkedIn 최적화

**프로필 키워드 (About 섹션에 포함):**
```
UDS (ISO 14229) | DoIP (ISO 13400) | CAN | CANoe | PCAN
Automotive Diagnostics | ADAS Testing | IVI Validation
A-SPICE | ISO 26262 | Regression Testing | Functional Testing
JLR | HKMC | Ethernet Diagnostics
```

**연결 전략:**
1. Vector Informatik, dSPACE, ETAS, Horiba MIRA HR 담당자 팔로우
2. "Automotive Software Testing" 그룹 참여
3. 독일/영국 자동차 QA 엔지니어 연결 요청 (공통 관심사 언급)
4. 주 1회 이상 자동차 기술 관련 포스팅 또는 공유

**메시지 템플릿 (채용담당자에게):**
```
Hi [Name],

I'm a Diagnostic Communication Engineer with 5+ years of experience 
in UDS/DoIP using CANoe, including real-vehicle analysis on JLR platforms.
Currently working as IVI Test Engineer at Hyundai Motor Group R&D.

I'm exploring opportunities in [Germany/UK] in automotive SW QA or 
diagnostics testing roles. Would you be open to a brief conversation?

Best regards,
Suhwan
```

### XING (독일 전용 필수)

- xing.com 프로필 생성 (무료)
- LinkedIn과 동일 내용, 독일어 버전도 추가
- 독일 자동차 회사 HR은 XING을 LinkedIn보다 먼저 봄

### 커뮤니티 참여

| 커뮤니티 | 플랫폼 | 목적 |
|---------|--------|------|
| Automotive Testing Community | LinkedIn Group | 정보 수집, 네트워킹 |
| ISTQB Community | LinkedIn Group | 시험 정보, 스터디 |
| A-SPICE Forum | automotivespice.com | 공식 Q&A |
| python-can Users | GitHub Discussions | 오픈소스 기여 |
| SAE International Members | sae.org (무료 가입) | 기술 자료, 웨비나 |

---

## 8. 학습 로드맵 통합 — 무료 우선 순서

```
지금 당장 (무료, 즉시):
├── ASAM SOVD Overview 읽기 (asam.net)
├── UN R156 원문 다운로드 (unece.org)
├── python-can + udsoncan 설치 및 Hello World
├── LinkedIn 키워드 최적화
├── XING 프로필 생성
└── SAE 무료 회원 가입

CTFL 준비 중 병행 (무료):
├── CT-AuT 실라버스 다운로드 및 1회 통독
├── Vector Academy 무료 e-learning 이수
├── Coursera "Self-Driving Cars" 시작
└── GitHub 포트폴리오 저장소 생성

CTFL 취득 후 (약 10~15만원):
├── CT-AuT 시험 등록 및 응시
└── 포트폴리오 프로젝트 1개 완성 + GitHub 공개

6개월 후 (약 7~9만원 교재):
├── "Automotive SPICE in Practice" 구매 + 정독
└── A-SPICE PAM v3.1 학습 완료
```

---

*마지막 업데이트: 2026-06-18*
