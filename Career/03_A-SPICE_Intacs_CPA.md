# A-SPICE & Intacs CPA 완전 가이드
> Automotive SPICE + Intacs Competent Process Assessor
> 목적: A-SPICE Auditor/Assessor 자격 취득 — 해외 취업 핵심 차별점
> 예상 준비 기간: 자가학습 3~6개월 + 교육 이수 후 시험

---

## 1. Automotive SPICE란?

Automotive Software Process Improvement and Capability dEtermination.

자동차 소프트웨어 개발 프로세스의 품질과 역량을 평가하는 국제 표준.  
독일 VDA(독일자동차산업협회)가 주도 개발, 현재 전 세계 OEM/Tier1에서 공급업체 평가에 사용.

### 왜 이게 중요한가

- 현대/기아, BMW, VW, Mercedes, Stellantis 등 모든 글로벌 OEM이 공급업체에 A-SPICE 요구
- 공급업체(Tier1, Tier2)는 A-SPICE Level 2 이상 달성을 증명해야 납품 가능
- 이를 평가해주는 사람이 **A-SPICE Assessor** → 지금 수요 폭발 중
- 독일/영국/싱가포르 컨설팅 회사에서 가장 많이 채용하는 포지션 중 하나

### A-SPICE vs CMMI vs ISO/IEC 15504

| 표준 | 도메인 | 관계 |
|------|--------|------|
| ISO/IEC 33001 | 일반 | A-SPICE의 상위 프레임워크 |
| A-SPICE (PAM) | 자동차 | ISO 33001 기반, 자동차 특화 |
| CMMI | IT 일반 | 별도 체계, 자동차 업계에서는 A-SPICE 우선 |

---

## 2. A-SPICE 프로세스 구조 이해

### Process Reference Model (PRM)

A-SPICE는 다음 프로세스 그룹으로 구성됩니다:

```
ACQ (Acquisition)        — 조달 프로세스
SPL (Supply)             — 공급 프로세스
SYS (System Engineering) — 시스템 엔지니어링
SWE (Software Engineering) — SW 엔지니어링  ← 핵심
SUP (Supporting)         — 지원 프로세스
MAN (Management)         — 관리 프로세스
REU (Reuse)              — 재사용
```

### 당신이 집중해야 할 프로세스

| 프로세스 ID | 이름 | 당신의 경험과 연결 |
|------------|------|-----------------|
| **SWE.4** | Software Unit Verification | 단위 테스트 → AVN/IVI 검증 |
| **SWE.5** | Software Integration Testing | 통합 테스트 |
| **SWE.6** | Software Qualification Testing | 소프트웨어 적격성 시험 → Regression Test |
| **SYS.4** | System Integration Testing | 시스템 통합 |
| **SYS.5** | System Qualification Testing | 시스템 적격성 |
| **SUP.9** | Problem Resolution Management | 이슈 관리 |
| **SUP.10** | Change Request Management | 변경 요청 관리 |

→ 당신이 이미 실무에서 SWE.4~SWE.6 및 SUP.9/10을 수행하고 있습니다.  
이것을 A-SPICE 언어로 설명하는 것이 시험의 핵심입니다.

### Capability Level (역량 수준)

| Level | 명칭 | 의미 |
|-------|------|------|
| Level 0 | Incomplete | 프로세스 미수행 또는 부분 수행 |
| **Level 1** | **Performed** | 프로세스 목적 달성 |
| **Level 2** | **Managed** | 계획하고 추적하며 수행 |
| Level 3 | Established | 표준 프로세스 기반 |
| Level 4 | Predictable | 정량적 관리 |
| Level 5 | Optimizing | 지속적 개선 |

대부분의 OEM이 Tier1에 **Level 2 이상**을 요구합니다.

---

## 3. Intacs 자격증 체계

Intacs = International Assessor Certification Scheme  
공식 웹사이트: **https://www.intacs.info**

### 자격 단계

```
CPA (Competent Process Assessor)        ← 첫 번째 목표
        ↓
EPA (Experienced Process Assessor)      ← 경험 쌓은 후
        ↓
PA  (Principal Assessor)               ← 최고 레벨
        ↓
LA  (Lead Assessor)                    ← 팀 리더
```

### CPA (Competent Process Assessor) 요건

**1. 교육 이수**
- Intacs 공인 교육 기관에서 **A-SPICE 교육 5일** 이수
- 교육 내용: PAM 이해, 평가 방법론, 증거 수집, 인터뷰 기법

**2. 평가 참여**
- 실제 A-SPICE 평가에 **5일 이상** 옵저버 또는 팀원으로 참여
- 자격 있는 Assessor의 지도 하에 수행

**3. 필기시험**
- Intacs 공인 시험 기관에서 응시
- 객관식 + 서술형 혼합
- PAM 지식, 평가 방법론 테스트

**4. 자격 등록**
- Intacs 사이트에 등록, 3년 유효 후 갱신

---

## 4. 공인 교육 기관 및 등록 방법

### 글로벌 공인 교육 기관 (선택)

| 기관 | 국가 | 온라인 | 비용 (참고) |
|------|------|--------|------------|
| **SQS** | 독일 / 국제 | 가능 | €2,500~3,000 |
| **Automotive SIG** | 국제 | 가능 | €2,000~2,800 |
| **TÜV SÜD** | 독일 | 일부 | €2,500~3,500 |
| **Kugler Maag CIE** | 독일 | 가능 | €2,500~3,000 |
| **Capgemini Engineering** | 유럽 | 제한 | 내부 교육 |

**한국 내 교육 기관:**
- 글로비스, TÜV Korea, Keit(일부) 등에서 간헐적으로 A-SPICE 교육 제공
- 단, Intacs 공인 교육인지 반드시 확인 필요

### 등록 절차

1. intacs.info 접속 → "Certified Assessors" → 교육 기관 목록 확인
2. 원하는 기관 선택 → 교육 일정 문의
3. 온라인/대면 과정 등록
4. 교육 이수 후 시험 신청
5. 평가 참여 5일 확보 (교육 기관이 도와주는 경우도 있음)

---

## 5. 자가 학습 방법 (교육 전 준비)

### 무료 다운로드 필수 자료

| 문서 | 다운로드 위치 |
|------|-------------|
| **Automotive SPICE PAM v3.1** | automotivespice.com → Downloads |
| **Automotive SPICE Process Assessment Model** | vda.de 또는 intacs.info |
| **Intacs Competency Framework** | intacs.info → Publications |

### 단계별 자가 학습

**Step 1: PAM v3.1 읽기 (4~6주)**
- 전체 PAM 문서 1회 통독 (약 200페이지)
- 당신 경험과 관련된 SWE.4~SWE.6, SUP.9, SUP.10 먼저 집중
- 각 프로세스의 "Base Practice(BP)"와 "Work Product(WP)" 암기

**Step 2: 프로세스별 Work Product 이해 (2~3주)**
- Work Product란 각 프로세스를 수행했음을 증명하는 산출물
- 예: SWE.6의 Work Product = 소프트웨어 적격성 테스트 계획서, 테스트 케이스, 테스트 결과
- 당신의 실제 업무 산출물과 매핑해보기

**Step 3: Capability Level 판정 연습 (2주)**
- 주어진 시나리오에서 프로세스가 Level 1인지 Level 2인지 판정하는 연습
- PAM의 Generic Attribute(GA) 기준으로 판단

**Step 4: 모의 평가 인터뷰 연습**
- 실제 평가에서 인터뷰이(피평가자)에게 어떤 질문을 해야 하는지 연습
- 예: "이 테스트 케이스가 요구사항과 어떻게 추적됩니까?"

### 학습 노트 작성 방법

각 프로세스마다 다음 형식으로 정리:

```
프로세스: SWE.6 Software Qualification Testing
목적: (PAM에서 복사)
Base Practice:
  BP1: ...
  BP2: ...
Work Product:
  - 01-50 Test Plan
  - 08-52 Test Case
  - 13-50 Test Result
내 경험 연결:
  - HKMC AVN Regression Test → SWE.6 BP1~3 해당
  - CANoe 테스트 결과 리포트 → WP 13-50 해당
```

---

## 6. 학습 자료

### 필수 자료 (무료)

| 자료 | 입수 방법 |
|------|----------|
| Automotive SPICE PAM v3.1 | automotivespice.com 무료 다운로드 |
| VDA Automotive SWE SPICE 가이드 | vda.de 무료 다운로드 |
| Intacs Assessment Methodology | intacs.info 무료 |

### 구매 추천 교재

| 교재 | 가격 | 추천 이유 |
|------|------|----------|
| **"Automotive SPICE in Practice"** by Markus Müller 등 (Springer) | €49~60 (약 7~9만원) | **필수 교재**, 현장 assessor들이 가장 많이 사용, 실무 예시 풍부 |
| **"Automotive Software Engineering"** by Jörg Schäuffele | €70~80 | A-SPICE 맥락 이해에 도움 |

→ 최소 "Automotive SPICE in Practice" 1권은 반드시 구매.

### 유튜브 / 웹 자료

| 자료 | 내용 |
|------|------|
| "Automotive SPICE Explained" (YouTube) | 개념 입문용 |
| automotivespice.com | 공식 자료 허브 |
| LinkedIn Learning "Automotive SPICE" | 기초 강의 있음 |

### Coursera

- Automotive SPICE 직접 강의는 없음
- 대신 "Software Process Management" 관련 강의로 개념 보완

---

## 7. 평가 참여 5일 확보 전략

가장 어려운 부분입니다. 두 가지 경로:

**경로 A: 국내 컨설팅 회사를 통해**
- TÜV Korea, 글로비스 QA팀, KDT(차량 개발 컨설팅) 등에서 A-SPICE 프로젝트 참여
- Assessor 자격자가 있는 팀에 합류하여 옵저버로 참여

**경로 B: 교육 기관이 연결해주는 프로젝트**
- 일부 Intacs 공인 교육 기관은 교육 후 실제 평가 프로젝트 연결 지원
- 교육 등록 시 "assessment opportunity"가 포함되는지 문의

**경로 C: 현재 직장 내 도입**
- FPT Korea / 현대 연구소에서 A-SPICE 평가가 진행 중인 경우 참여 요청
- 상사에게 "A-SPICE 평가팀에 참관 기회 요청" 가능

---

## 8. 취득 후 커리어 경로

### 국내 활용

- TÜV Korea, SQS Korea, Capgemini Korea: A-SPICE 컨설턴트로 입사
- 현대/기아 공급업체 A-SPICE 지원 프로젝트

### 해외 직접 지원

```
타겟 회사 (독일):
- ETAS GmbH (Stuttgart/Frankfurt)
- Kugler Maag CIE (Stuttgart)
- SQS Group (Düsseldorf)
- Sogeti (Capgemini) — 여러 도시

타겟 회사 (영국):
- Ricardo Engineering (Surrey)
- HORIBA MIRA (Nuneaton)
- Intertek Automotive (Coventry)

타겟 회사 (싱가포르):
- Continental AG
- TÜV SÜD Singapore
- Bosch ASEAN
```

### 연봉 참고 (2025 기준)

| 국가 | Junior Assessor | Senior Assessor |
|------|----------------|----------------|
| 독일 | €55,000~70,000 | €75,000~100,000 |
| 영국 | £45,000~60,000 | £65,000~85,000 |
| 싱가포르 | SGD 70,000~90,000 | SGD 90,000~120,000 |

---

## 9. 당신의 강점 포인트

A-SPICE Assessor 채용 시 면접에서 강조할 것:

1. **SWE.6 실무 경험**: HKMC AVN Regression Test → 소프트웨어 적격성 시험 직접 수행
2. **CANoe/PCAN 활용**: 테스트 자동화 도구 운용 능력
3. **SUP.9 실무**: IVI 이슈 관리, 문제 해결 프로세스 경험
4. **베트남 팀 협업**: 글로벌 팀 커뮤니케이션 경험
5. **DoIP/UDS 기술 배경**: 자동차 SW 기술 깊이가 있어 평가 시 기술적 판단 가능

→ 대부분의 A-SPICE Assessor 후보자는 프로세스만 알고 기술을 모릅니다.  
당신은 기술과 프로세스를 모두 가진 희소한 프로필입니다.
