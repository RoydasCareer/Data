# UN R155 / R156 학습 완전 가이드
> R155: 자동차 사이버보안 | R156: OTA 소프트웨어 업데이트
> 비용: 완전 무료
> 기간: 3~4주 (병행 학습 가능)

---

## 1. 왜 이 규정을 배워야 하는가

### 시장 상황

2022년 7월부터 EU에서 새로 형식 승인을 받는 차량에
**UN R155와 R156 의무 적용**이 시작됐습니다.
2024년 7월부터는 이미 판매 중인 모든 차종에도 적용.

→ 모든 글로벌 OEM/Tier1이 컴플라이언스 담당자, 테스터를 긴급 채용 중.

### JD 키워드 현황

2025~2026년 독일/영국 자동차 테스팅 JD에서
`UN R155`, `UN R156`, `CSMS`, `SUMS`, `OTA validation` 키워드가
전년 대비 3배 이상 증가했습니다.

### 당신의 현재 업무와 직결

| 현재 업무 | UN R156 관련성 |
|----------|--------------|
| IVI 소프트웨어 버전 검증 | R156의 핵심 = SW 버전 관리 |
| Regression Test (업데이트 후) | R156 무결성 검증 요구사항 |
| FPT Korea ↔ 현대 연구소 협업 | R156 공급망 책임 분담 요구사항 |

---

## 2. UN R155 — 자동차 사이버보안

### 개요

| 항목 | 내용 |
|------|------|
| 정식 명칭 | UN Regulation No. 155 — Cyber Security and Cyber Security Management System |
| 제정 기관 | UNECE WP.29 (유엔 유럽경제위원회) |
| 시행 | 2022년 7월 (신규 형식 승인), 2024년 7월 (전 차종) |
| 핵심 요구 | OEM이 CSMS(사이버보안 관리 시스템)를 운영해야 함 |
| 관련 표준 | ISO/SAE 21434 (기술적 구현 표준) |

### 핵심 내용 요약

**CSMS(Cyber Security Management System)란:**
- 차량 사이버보안을 관리하는 조직/프로세스 전체
- 위협 분석(TARA), 리스크 관리, 보안 테스팅 포함
- OEM이 인증 기관에 CSMS 운영을 증명해야 차량 형식 승인 가능

**당신이 알아야 할 핵심 개념:**

| 개념 | 의미 |
|------|------|
| TARA | Threat Analysis and Risk Assessment (위협 분석) |
| CSMS | Cyber Security Management System |
| VTA | Vehicle Type Approval (차량 형식 승인) |
| 공급망 보안 | OEM → Tier1 → Tier2까지 보안 요구사항 전달 |

---

## 3. UN R156 — OTA 소프트웨어 업데이트 (핵심)

### 개요

| 항목 | 내용 |
|------|------|
| 정식 명칭 | UN Regulation No. 156 — Software Update and Software Update Management System |
| 핵심 요구 | OEM이 SUMS(소프트웨어 업데이트 관리 시스템)를 운영해야 함 |
| 대상 | 모든 방식의 소프트웨어 업데이트 (OTA 포함, 정비소 업데이트 포함) |

### 핵심 내용 요약

**SUMS(Software Update Management System)란:**
- 차량 SW 업데이트 전 주기를 관리하는 시스템
- 업데이트 준비 → 배포 → 설치 → 검증 → 롤백 전 과정 포함

**R156 Annex 1 — SUMS 필수 요구사항 (핵심):**

| 요구사항 | 내용 | 당신의 업무 연결 |
|---------|------|----------------|
| SW 버전 추적 | 차량에 설치된 모든 SW 버전 관리 | IVI 버전 검증 직접 해당 |
| 업데이트 무결성 | 업데이트 파일 위변조 방지 | 업데이트 후 Regression Test |
| 안전 보장 | 업데이트가 안전 기능에 영향 없음을 보장 | 안전 관련 기능 Regression |
| 고객 동의 | 업데이트 전 운전자에게 정보 제공 | — |
| 롤백 능력 | 업데이트 실패 시 이전 버전 복구 | — |
| 공급망 추적 | Tier1/Tier2까지 SW 출처 추적 | FPT Korea ↔ 현대 협업 |

---

## 4. 무료 자료 입수 방법

### Step 1: 규정 원문 다운로드 (무료, 즉시)

1. **UNECE 공식 사이트 접속:**
   - URL: unece.org
   - 상단 "Transport" → "Vehicle Regulations"

2. **R155 다운로드:**
   - unece.org/transport/vehicle-regulations-wp29
   - "UN R155" 검색 → 영문 PDF 무료 다운로드

3. **R156 다운로드:**
   - 동일 방식으로 "UN R156" 검색 → PDF 다운로드

**대안 (더 빠른 방법):**
- Google 검색: `"UN Regulation 155" filetype:pdf site:unece.org`
- Google 검색: `"UN Regulation 156" filetype:pdf site:unece.org`

### Step 2: ISO/SAE 21434 요약 자료 (R155 기술 표준)

ISO/SAE 21434 원문은 유료이지만,
요약 자료는 무료로 많이 공개돼 있습니다:

- SAE International 무료 기사: sae.org 검색 "ISO SAE 21434 overview"
- TÜV Rheinland 무료 가이드: tuv.com → "Automotive Cybersecurity" 검색
- Vector 공식 블로그: vector.com → "Knowledge" → "Cybersecurity" 검색

### Step 3: 무료 웨비나

- TÜV SÜD: "UN R155/R156 Compliance" 웨비나 (무료 등록)
  - tuvsud.com → Events 검색
- SGS: "Automotive Cybersecurity" 웨비나
  - sgs.com → Events
- Keysight Technologies: 진단통신 관련 무료 웨비나 다수

---

## 5. 4주 학습 계획

### Week 1: 배경 이해

**목표:** R155/R156이 왜 생겼는지, 무엇을 요구하는지 큰 그림 파악

**학습 내용:**
1. YouTube 검색: "UN R155 R156 automotive explained" → 영상 2~3개 시청
2. TÜV/SGS 무료 가이드 1개 정독
3. R155 원문 목차 파악 (전체 구조 이해)

**노트 작성:**
```
UN R155 = 사이버보안 관리 (CSMS)
  → OEM이 보안 관리 시스템을 갖추고 운영함을 증명
  → 위협 분석(TARA) 수행 필수
  → 공급망 전체(Tier1/Tier2)에 요구사항 전달

UN R156 = SW 업데이트 관리 (SUMS)
  → OEM이 SW 업데이트 전 주기를 관리함을 증명
  → 버전 추적, 무결성, 안전 보장 필수
  → OTA뿐 아니라 정비소 업데이트도 포함
```

---

### Week 2: R156 Annex 1 정독 (당신의 업무와 직결)

**목표:** R156의 SUMS 요구사항 조항별 이해

**학습 내용:**
1. R156 원문 다운로드 후 Annex 1 정독 (약 15~20페이지)
2. 각 조항을 당신의 현재 업무와 매핑

**매핑 연습 (노트 작성):**

```
R156 요구사항 → 내 업무 매핑

5.1.2 소프트웨어 버전 관리
→ 나는 IVI 소프트웨어 버전 체계를 검증했음
→ FPT Korea에서 베트남 팀이 빌드한 소프트웨어 버전 확인 업무

5.1.3 업데이트 무결성 검증
→ 나는 업데이트 후 Regression Test를 수행했음
→ Full TC로 기능 변경/회귀 없음을 검증

5.1.4 안전 기능 영향 없음 보장
→ 나는 ADAS 기능(RSPA2)이 IVI 업데이트에 영향받지 않음을 검증했음

5.1.5 공급망 추적
→ FPT Korea(Tier1) → 현대 연구소(OEM) 협업 구조가 R156의 공급망 추적 요구에 해당
```

---

### Week 3: R155 핵심 + ISO 21434 연결

**목표:** R155와 ISO 21434의 관계 이해

**학습 내용:**
1. R155 원문 주요 조항 읽기 (전체 약 30페이지, 핵심 10페이지)
2. TARA(위협 분석 및 리스크 평가) 개념 이해
3. SAE/TÜV 무료 자료로 ISO 21434 보조 학습

**핵심 개념 정리:**

```
TARA (Threat Analysis and Risk Assessment):
- 위협원 식별 (예: 원격 공격, OBD 포트 악용)
- 공격 가능성 평가
- 피해 심각도 평가
- CAL (Cybersecurity Assurance Level) 결정: CAL 1~4
- ISO 26262의 ASIL과 유사한 개념
```

---

### Week 4: 실무 연결 + 이력서 반영

**목표:** 학습 내용을 이력서 언어로 표현

**영어 표현 연습:**

```
현재 업무를 R156 언어로:

기존 표현:
"Performed regression testing after IVI software updates"

R156 언어 추가:
"Performed regression testing after IVI software updates,
verifying software integrity and functional safety in compliance
with SUMS requirements (UN Regulation No. 156)"
```

**Cover Letter 활용:**
```
During my role as IVI Test Engineer at Hyundai Motor Group R&D,
I performed software version verification and regression testing
aligned with UN R156 SUMS requirements, including tracking software
versions across the supply chain (FPT Software Korea → Hyundai R&D).
```

---

## 6. 학습 자료 전체 목록

| 자료 | 입수 방법 | 비용 |
|------|----------|------|
| UN R155 원문 PDF | unece.org | 무료 |
| UN R156 원문 PDF | unece.org | 무료 |
| TÜV Rheinland 사이버보안 가이드 | tuv.com | 무료 |
| SGS 웨비나 자료 | sgs.com | 무료 |
| Vector 사이버보안 블로그 | vector.com/knowledge | 무료 |
| SAE 21434 요약 기사 | sae.org (일부 무료) | 무료 |
| Keysight 웨비나 | keysight.com | 무료 |

---

## 7. 자격증 연결

UN R155/R156 자체 자격증은 없지만,
이 지식을 갖추면 다음 자격증 시험에서 유리합니다:

| 자격증 | 관련성 |
|--------|--------|
| ISTQB CT-AuT | Chapter 3 (Safety Testing) — R155 개념 포함 |
| ISO 26262 FSE | ASIL과 CAL의 유사성 이해 |
| Intacs CPA | 프로세스 컴플라이언스 → R155/R156 배경 유리 |

---

## 8. 비용 요약

| 항목 | 비용 |
|------|------|
| 모든 학습 자료 | 무료 |
| 학습 시간 | 약 10~15시간 (4주) |
| **총 비용** | **0원** |

---

*마지막 업데이트: 2026-06-18*
