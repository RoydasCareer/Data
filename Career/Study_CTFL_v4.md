# ISTQB CTFL v4.0 완전 학습 교재
> 시험: 40문항 / 75분 / 65% 합격 (26/40)
> 언어: 영어 (closed book)
> 이 교재만으로 합격 가능하도록 전 챕터를 구성했습니다.

---

# 시험 구조 이해

| 챕터 | 비중 | 문항 수 |
|------|------|---------|
| Chapter 1: Fundamentals of Testing | ~23% | ~9문항 |
| Chapter 2: Testing Throughout the SDLC | ~8% | ~3문항 |
| Chapter 3: Static Testing | ~13% | ~5문항 |
| Chapter 4: Test Analysis and Design | ~30% | ~12문항 |
| Chapter 5: Managing the Test Activities | ~15% | ~6문항 |
| Chapter 6: Test Tools | ~11% | ~5문항 |

**문제 유형:**
- K1 (Remember): 정의/용어 암기 — "Which of the following best defines..."
- K2 (Understand): 개념 이해 — "Why is... / What is the purpose of..."
- K3 (Apply): 시나리오 적용 — "Given the following situation, which..."

---

# Chapter 1: Fundamentals of Testing (23%)

## 1.1 What is Testing?

### 핵심 정의

**Testing**: 소프트웨어의 결함을 발견하고, 품질에 대한 정보를 제공하며, 릴리스 결정을 지원하는 체계적인 활동.

> **[중요] Testing ≠ Debugging**
> - Testing: 결함을 *발견*하는 활동 (테스터 역할)
> - Debugging: 결함을 *수정*하는 활동 (개발자 역할)
> - Confirmation Testing: 수정 후 결함이 해결됐는지 재검증 (테스터 역할)

### 테스팅의 목적 (7가지)

1. **결함 발견**: 소프트웨어의 잠재적 결함 탐지
2. **품질 수준 평가**: 요구사항 충족 여부 평가
3. **릴리스 결정 지원**: 충분한 품질인지 판단
4. **요구사항 준수 확인**: 법적·계약적 요건 충족 확인
5. **신뢰 구축**: 이해관계자에게 품질 확신 제공
6. **결함 예방**: 테스트를 통한 설계/코드 개선 유도
7. **손실 방지**: 결함이 운영 환경에서 발생할 위험 감소

### Testing vs QA

| 구분 | Testing (QC) | QA |
|------|--------------|----|
| 초점 | 제품 (Product) | 프로세스 (Process) |
| 목적 | 결함 발견 | 프로세스 개선으로 결함 예방 |
| 활동 | 테스트 수행 | 표준·절차 수립 |
| 시점 | 제품 생성 후 | 프로젝트 전 기간 |

---

## 1.2 Why is Testing Necessary?

### 결함의 발생 메커니즘

```
Error (인간의 실수)
    ↓ 발생시킴
Defect / Fault / Bug (코드/문서의 결함)
    ↓ 실행 시 발생할 수 있음
Failure (시스템의 잘못된 동작)
```

**용어 정의:**
- **Error**: 사람이 저지른 실수 (잘못된 가정, 오해, 타이핑 실수)
- **Defect (=Fault=Bug)**: Error로 인해 코드/문서에 존재하는 결함
- **Failure**: Defect가 실행되어 시스템이 잘못된 결과를 내는 것

> ⚠️ **모든 Defect가 Failure를 일으키지는 않습니다!**
> - 결함이 있는 코드 경로가 실행되지 않으면 Failure 없음
> - 예: Dead code에 있는 버그

### 결함이 비용을 증가시키는 이유

```
발견 시점이 늦을수록 수정 비용 기하급수적 증가:
요구사항 단계: 1x
설계 단계: 5x
코딩 단계: 10x
테스팅 단계: 25x
운영 단계: 100x
```

---

## 1.3 Seven Testing Principles (7대 테스팅 원칙)

> ⭐ **시험에서 가장 많이 출제되는 섹션!** 모두 암기하세요.

### Principle 1: Testing Shows the Presence of Defects, Not Their Absence

테스팅은 결함이 *있음*을 증명할 수 있지만, 결함이 *없음*을 증명하지는 못합니다.

**시험 함정**: "Testing proves software is correct" → **오답!**
**정답**: Testing reduces the risk of defects remaining in software.

### Principle 2: Exhaustive Testing is Impossible

모든 가능한 입력값·경로·조합을 테스트하는 것은 불가능합니다.
→ 대신 **리스크 기반** + **우선순위화**된 테스팅 사용

예: 로그인 필드에 가능한 입력 조합 = 사실상 무한대

### Principle 3: Early Testing Saves Time and Money

빠른 결함 발견 = 수정 비용 절감. 정적 테스팅(리뷰)부터 시작.
**"Shift-left"**: 테스팅 활동을 개발 사이클 초반으로 이동

### Principle 4: Defects Cluster Together

대부분의 결함은 소수의 모듈에 집중됩니다 (파레토 원칙, 80/20 규칙).
→ 리스크가 높은 모듈에 테스팅 집중

### Principle 5: Tests Wear Out

동일한 테스트를 반복하면 새로운 결함을 발견하는 효과가 줄어듭니다.
→ 주기적으로 **새로운 테스트** 추가, 데이터 변경, 기법 전환 필요
(구 버전 명칭: Pesticide Paradox)

### Principle 6: Testing is Context Dependent

테스팅 방법은 문맥에 따라 다릅니다.
- 안전 중요 시스템(의료, 자동차): 엄격한 공식 테스팅 필수
- 모바일 앱: 탐색적 테스팅 + 빠른 피드백 루프

### Principle 7: Absence-of-Errors is a Fallacy

결함이 없다고 소프트웨어가 성공이 아닙니다.
올바른 것을 올바르게 만들지 않았다면, 결함 없음은 의미 없습니다.
예: 사용자가 원하지 않는 기능이 완벽히 구현된 소프트웨어

---

## 1.4 Test Activities and Tasks (테스트 프로세스)

### 테스트 활동 7단계

```
1. Test Planning        → 계획 수립 (범위, 전략, 자원)
2. Test Monitoring      → 진도 추적
3. Test Control         → 벗어남 수정
4. Test Analysis        → "무엇을 테스트할 것인가?" (TC 조건 식별)
5. Test Design          → "어떻게 테스트할 것인가?" (TC 설계)
6. Test Implementation  → TC를 실행 가능한 형태로 구현
7. Test Execution       → 실제 테스트 수행
8. Test Completion      → 완료 처리, 교훈 수집
```

> **Analysis vs Design 구분:**
> - Analysis: 테스트 조건(Test Condition) 식별 → WHAT
> - Design: 테스트 케이스(Test Case) 설계 → HOW

### 테스트 작업 산출물 (Test Work Products)

| 단계 | 산출물 |
|------|--------|
| Planning | Test Plan |
| Analysis | Test Conditions |
| Design | Test Cases, Test Charters |
| Implementation | Test Scripts, Test Data, Test Suites |
| Execution | Test Results, Defect Reports |
| Completion | Test Summary Report |

---

## 1.5 Traceability (추적성)

**양방향 추적성 (Bidirectional Traceability)**:
- 요구사항 → 테스트 케이스 (어떤 TC가 이 요구사항을 커버하는가?)
- 테스트 케이스 → 요구사항 (이 TC는 어떤 요구사항을 검증하는가?)

**추적성의 이점**:
- 커버리지 분석
- 요구사항 변경 시 영향 범위 파악
- 테스트 완료 보고 시 근거 제공

---

## 1.6 The Psychology of Testing

### 테스터 마인드셋

- 결함을 **찾으려는** 태도 (개발자의 "잘 될 것" 태도와 반대)
- 비판이 아닌 **개선** 목적
- 독립적 관점이 결함 발견에 유리

### 독립성 레벨 (Independence in Testing)

```
낮은 독립성:
  Level 0: 개발자가 자신의 코드 테스트
  Level 1: 다른 개발자가 테스트

높은 독립성:
  Level 2: 독립 테스트 팀 (조직 내)
  Level 3: 독립 테스트 조직 (외부)
  Level 4: 독립 테스터 (외부)
```

독립성 ↑ → 결함 발견 효과 ↑, but 의사소통 비용 ↑

---

# Chapter 2: Testing Throughout the SDLC (8%)

## 2.1 Impact of Development Model on Testing

### 개발 모델별 테스팅 접근

**Sequential (Waterfall, V-Model)**:
- V-Model: 각 개발 단계에 대응하는 테스트 레벨 존재
- 요구사항 → 수락 테스트 / 설계 → 시스템 테스트 / 상세설계 → 통합 테스트 / 코드 → 단위 테스트
- 장점: 테스트 계획 초기 수립 가능
- 단점: 피드백 루프 느림

**Agile/Iterative**:
- 매 이터레이션마다 회귀 테스팅
- CI/CD 환경에서 자동화 테스팅 필수
- Whole-team 접근: 개발자+테스터 협력

### 좋은 테스팅 실천 (모든 모델 공통)

1. 모든 개발 단계에 대응하는 테스트 활동 존재
2. 각 단계의 결과물에 대한 검토
3. 테스터가 초기부터 참여 (요구사항 리뷰 등)
4. 릴리스 전 충분한 테스팅 시간 확보

---

## 2.2 Test Levels (테스트 레벨)

### Component Testing (= Unit Testing)

| 항목 | 내용 |
|------|------|
| 테스트 대상 | 단일 컴포넌트 (함수, 클래스, 모듈) |
| 수행자 | 개발자 |
| 환경 | 개발 환경 (IDE) |
| 기법 | White-box 주로 |
| 도구 | JUnit, pytest, Google Test |

**테스트 스텁(Stub)**: 아직 없는 하위 컴포넌트를 대체하는 더미
**테스트 드라이버(Driver)**: 테스트 대상을 호출하는 상위 컴포넌트 대체

### Integration Testing

**목적**: 컴포넌트 간 인터페이스와 상호작용 테스트

**유형**:
- Component Integration Testing: 단위 간 통합
- System Integration Testing: 시스템 간 통합 (API, 외부 서비스)

**통합 전략**:
- Big Bang: 모든 컴포넌트를 한 번에 통합 (격리 어려움)
- Incremental: 단계적 통합 (Top-down / Bottom-up / Sandwich)

### System Testing

| 항목 | 내용 |
|------|------|
| 테스트 대상 | 전체 시스템의 동작 |
| 환경 | 운영과 유사한 환경 |
| 수행자 | 독립 테스트 팀 |
| 기법 | Black-box 주로 |
| 초점 | End-to-end 시나리오 |

### Acceptance Testing

**목적**: 시스템이 배포 준비가 됐는지 확인

**유형**:
- **UAT (User Acceptance Testing)**: 실제 사용자가 수행
- **OAT (Operational Acceptance Testing)**: 운영 환경 적합성 (배포, 백업, 보안)
- **Contractual/Regulatory**: 계약·법적 요건 충족
- **Alpha Testing**: 개발 조직 내부에서 수행
- **Beta Testing**: 실제 사용자 환경에서 수행

---

## 2.3 Test Types (테스트 유형)

### Functional Testing

시스템이 **무엇을 하는지** (기능) 검증
- 요구사항, Use Cases, User Stories 기반
- 블랙박스 기법 주로 사용
- 예: 로그인 기능, 주문 처리, UDS 서비스 응답

### Non-functional Testing

시스템이 **얼마나 잘 하는지** (품질 특성) 검증

| 유형 | 설명 |
|------|------|
| Performance Testing | 부하 하의 응답 시간 |
| Load Testing | 예상 최대 부하 테스트 |
| Stress Testing | 한계 초과 부하 테스트 |
| Usability Testing | 사용 편의성 |
| Security Testing | 보안 취약점 |
| Reliability Testing | 오류 없이 동작하는 능력 |
| Maintainability Testing | 유지보수 용이성 |
| Compatibility Testing | 다른 환경에서의 동작 |

### White-box Testing (Structural Testing)

소스 코드 내부 구조를 기반으로 테스트 설계
- 커버리지 측정: 어떤 코드 경로가 실행됐는가?
- 기법: Statement, Branch, MC/DC Coverage

### Change-related Testing

| 유형 | 설명 |
|------|------|
| Confirmation Testing | 수정된 결함이 실제로 해결됐는지 확인 |
| Regression Testing | 변경 후 기존 기능에 영향이 없는지 확인 |

> **당신의 업무 연결:**
> "Full TC Regression Test" = 모든 변경 후 Regression Testing 수행

---

# Chapter 3: Static Testing (13%)

## 3.1 Static Testing vs Dynamic Testing

| 구분 | Static Testing | Dynamic Testing |
|------|---------------|-----------------|
| 소프트웨어 실행 | 불필요 | 필요 |
| 대상 | 문서, 코드, 요구사항 | 실행 중인 소프트웨어 |
| 예 | 코드 리뷰, 요구사항 리뷰 | 기능 테스트, 성능 테스트 |
| 결함 발견 시점 | 매우 이른 단계 | 구현 후 |

**Static Testing이 찾을 수 있는 결함**:
- 잘못된 요구사항 (모호함, 모순, 불완전)
- 설계 결함
- 코드 결함 (null dereference, 미초기화 변수)
- 표준 위반
- 보안 취약점 (SQL Injection, Buffer Overflow)

**Static Testing이 찾을 수 없는 결함**:
- 성능 문제 (실제 실행 없이 측정 불가)
- 환경 의존적 문제
- 런타임에만 발생하는 타이밍 문제

---

## 3.2 Review Process (리뷰 프로세스)

### 리뷰 역할 (Review Roles)

| 역할 | 책임 |
|------|------|
| **Author** | 리뷰 대상 작업 산출물 작성자. 결함 수정 담당 |
| **Facilitator** (= Moderator) | 리뷰 회의 진행, 효율성 보장, 중립 유지 |
| **Review Leader** | 리뷰 계획, 실행, 결과 전달. 관리자 역할 |
| **Reviewers** | 결함 발견. 도메인 전문가, 테스터 등 |
| **Scribe** | 결함/이슈 기록 |
| **Manager** | 리뷰 실행 결정, 자원 배정 |

### 리뷰 유형 (Review Types)

| 유형 | 특징 | 공식성 |
|------|------|--------|
| **Informal Review** | 규칙 없음, 문서화 없음 | 가장 낮음 |
| **Walkthrough** | 저자가 주도, 교육 목적 | 낮음 |
| **Technical Review** | 동료 기술 검토, 방어 없음 | 중간 |
| **Inspection** | 가장 공식적, 프로세스 정의, 메트릭 수집 | 가장 높음 |

> **암기 팁**: 공식성 순서: Informal < Walkthrough < Technical Review < Inspection

### Inspection 단계 (가장 공식적인 리뷰)

```
1. Planning → 리뷰 범위, 역할, 체크리스트 준비
2. Kick-off Meeting → 목적, 문서 배포
3. Individual Review (Preparation) → 각자 결함 찾기
4. Review Meeting → 결함 논의, 목록 작성
5. Rework → 저자가 결함 수정
6. Follow-up → 수정 확인
```

---

## 3.3 Static Analysis

코드를 실행하지 않고 도구(Linter, Compiler, SAST)로 분석

**발견 가능한 결함**:
- 구문 오류 (Syntax errors)
- 코딩 표준 위반
- 미사용 변수/코드 (Dead code)
- 보안 취약점 (CWE, OWASP)
- 코드 복잡도 (McCabe Complexity)
- 널 포인터 역참조

**도구 예시**: SonarQube, Coverity, Klocwork, MISRA-C checker (자동차 임베디드)

---

# Chapter 4: Test Analysis and Design (30%) ← 가장 중요!

## 4.1 Black-box Test Techniques

### Equivalence Partitioning (EP, 동등 분할)

**원칙**: 입력을 동일하게 처리될 것으로 예상되는 *파티션(그룹)*으로 나누고, 각 파티션에서 하나의 값만 테스트.

**유효 파티션 (Valid Partition)**: 시스템이 정상 처리해야 하는 입력
**무효 파티션 (Invalid Partition)**: 시스템이 거부해야 하는 입력

**예시: 나이 입력 필드 (0~120세 허용)**

```
파티션 분석:
  무효 파티션 1: < 0 (예: -1)
  유효 파티션:   0~120 (예: 50)
  무효 파티션 2: > 120 (예: 150)

테스트 케이스: -1, 50, 150 (각 파티션에서 1개씩)
```

**EP 규칙**:
- 각 파티션에서 최소 1개 TC
- 결함이 한 값에 있으면 같은 파티션의 다른 값에도 있다고 가정
- 유효+무효 파티션 모두 테스트

---

### Boundary Value Analysis (BVA, 경계값 분석)

**원칙**: 결함은 파티션 *경계*에서 자주 발생한다는 관찰에 기반.

**2-value BVA** (CTFL v4.0 기본):
- 경계값 + 바로 옆 값 (이전 파티션의 마지막 값)
- 경계값: 0, 120
- 인접값: -1, 1, 119, 121

```
0~120 유효 범위의 BVA:
  경계: 0, 120
  경계 밖: -1, 121
  TC: -1, 0, 120, 121
```

**3-value BVA**:
- 경계 미만 + 경계 + 경계 초과
- TC: -1, 0, 1 / 119, 120, 121

---

### Decision Table Testing (결정 테이블)

**사용 시기**: 여러 조건의 조합에 따라 다른 결과가 나올 때

**구조**:
```
              Rule 1  Rule 2  Rule 3  Rule 4
조건1 (Y/N):    Y       Y       N       N
조건2 (Y/N):    Y       N       Y       N
────────────────────────────────────────
결과A:          ✓               ✓
결과B:                  ✓               ✓
```

**예시: 할인 적용 규칙**
- 조건1: 회원인가? (Y/N)
- 조건2: 구매액 > 100,000원? (Y/N)

```
              R1      R2      R3      R4
회원?:          Y       Y       N       N
100K 이상?:    Y       N       Y       N
────────────────────────────────────────
20% 할인:      ✓
10% 할인:              ✓       ✓
할인 없음:                              ✓
```

→ TC 수 = 규칙 수 (4개)

---

### State Transition Testing (상태 전이 테스트)

**사용 시기**: 시스템이 상태를 가지고, 이벤트에 따라 상태가 전환될 때

**구성 요소**:
- **State**: 시스템이 가질 수 있는 상태 (예: Locked, Unlocked)
- **Transition**: 상태 간 이동
- **Event**: 전이를 유발하는 사건 (예: 카드 삽입)
- **Guard**: 전이 조건 (예: PIN 일치)
- **Action**: 전이 시 발생하는 동작 (예: 문 열림)

**예시: UDS 진단 세션 상태**
```
Default Session ──[0x10 01]──> Default Session
Default Session ──[0x10 02]──> Extended Session
Default Session ──[0x10 03]──> Programming Session
Extended Session ──[S3 timeout]──> Default Session
```

**커버리지**:
- **All States Coverage**: 모든 상태를 최소 1회 방문
- **All Transitions Coverage**: 모든 전이를 최소 1회 실행 (더 엄격)
- **All Invalid Transitions**: 유효하지 않은 전이 테스트

---

## 4.2 White-box Test Techniques

### Statement Coverage (문장 커버리지)

실행된 명령문 수 / 전체 명령문 수 × 100%

```python
def check_age(age):           # 4개 명령문
    if age >= 18:             # line 1
        print("Adult")        # line 2
    else:
        print("Minor")        # line 3
    return age                # line 4

# TC1: age=20 → line 1,2,4 실행 (3/4 = 75%)
# TC2: age=10 → line 1,3,4 실행 (3/4 = 75%)
# TC1+TC2 → 4/4 = 100% Statement Coverage
```

**한계**: 모든 분기를 커버하지 않을 수 있음

### Branch Coverage (분기 커버리지)

실행된 분기 수 / 전체 분기 수 × 100%

```
if (A) {     → True 분기, False 분기
  ...
}
```

**100% Branch Coverage ⊃ 100% Statement Coverage** (분기가 더 강함)

### MC/DC Coverage (Modified Condition/Decision Coverage)

자동차 안전 기준 (DO-178C, ASIL C/D)에서 요구.

**조건**: 각 조건이 독립적으로 전체 결정에 영향을 미침을 증명

```
결정: A AND B
테스트 케이스:
  A=T, B=T → T (기준점)
  A=F, B=T → F (A만 변경 → 결과 변경: A의 영향 독립 증명)
  A=T, B=F → F (B만 변경 → 결과 변경: B의 영향 독립 증명)
```

---

## 4.3 Experience-based Techniques

### Error Guessing (오류 추측)

경험과 직관을 기반으로 결함이 있을 가능성이 높은 부분 추측.

**예시 (UDS 진단통신)**:
- SecurityAccess (0x27) 서비스에서 invalid key 입력 시 동작
- S3 타이머 만료 직전/직후 요청 시 동작
- DLC = 0인 CAN 메시지 수신 시 동작

### Exploratory Testing (탐색적 테스팅)

**Test Charter**: 탐색의 목적과 범위를 정의하는 짧은 문서
예: "X 모듈의 보안 관련 결함을 30분 내에 탐색"

**특징**:
- 계획과 실행을 동시에
- 학습 → 테스트 설계 → 테스트 실행 순환
- 문서화보다 결함 발견 집중

### Checklist-based Testing

사전에 정의된 체크리스트를 기반으로 테스트.
- ISO 표준, 코딩 가이드라인 준수 확인 시 유용

---

# Chapter 5: Managing the Test Activities (15%)

## 5.1 Test Planning

### Test Plan 주요 구성 요소

```
1. Context of Testing
   - 테스트 범위 (Scope)
   - 테스트 목적
   - 테스트 기반 (요구사항, 설계 문서)

2. Assumptions and Constraints
   - 가정 사항
   - 제약 조건 (일정, 자원, 도구)

3. Stakeholders

4. Communication

5. Risk Register
   - Product Risk: 기능/품질 관련 위험
   - Project Risk: 자원/일정/환경 관련 위험

6. Test Approach
   - 테스트 레벨, 유형, 기법
   - 진입/완료 기준

7. Test Deliverables
   - 산출물 목록

8. Test Estimation
   - WBS 기반, 경험 기반, Delphi 기법
```

### Entry Criteria vs Exit Criteria

| 구분 | 의미 | 예 |
|------|------|-----|
| Entry Criteria | 테스팅 시작 조건 | 빌드 완료, 환경 준비, 테스트 케이스 준비 |
| Exit Criteria | 테스팅 완료 조건 | 커버리지 X% 이상, 심각도 높은 미해결 결함 0개 |

---

## 5.2 Risk Management

### Risk Level = Likelihood × Impact

**Product Risk** (제품 리스크): 소프트웨어 품질 관련
- 예: "UDS SecurityAccess 기능이 올바르게 동작하지 않을 위험"

**Project Risk** (프로젝트 리스크): 프로젝트 목표 관련
- 예: "일정 지연으로 테스팅 시간 부족"

### Risk-based Testing

1. 위험 식별 (Risk Identification)
2. 위험 평가 (Risk Assessment): 발생 가능성 × 영향도
3. 위험 완화 (Risk Mitigation): 테스팅 우선순위에 반영
4. 잔존 위험 수용 (Risk Acceptance)

---

## 5.3 Test Monitoring and Control

### 테스트 진행 메트릭

| 메트릭 | 계산 |
|--------|------|
| Test Coverage | 커버된 TC / 전체 TC |
| Defect Density | 결함 수 / 기능 크기 |
| Pass Rate | 통과 TC / 실행 TC |
| Defect Detection Rate | 발견 결함 수 / 기간 |

### 테스트 보고서 유형

- **Test Progress Report**: 현재 진행 상태 (주기적)
- **Test Completion Report**: 테스팅 완료 후 최종 요약

---

## 5.4 Configuration Management

테스트 환경과 테스트 대상 소프트웨어 버전을 추적/관리.

**목적**:
- 재현 가능한 테스팅 환경 보장
- "어떤 버전의 소프트웨어를 어떤 환경에서 테스트했는가?" 추적

---

## 5.5 Defect Management

### 결함 보고서 (Defect Report) 구성 요소

```
1. Defect ID
2. Title / Summary
3. Severity (심각도): Critical > Major > Minor > Trivial
4. Priority (우선순위): 처리 순서
5. Status: New → Open → Fixed → Verified → Closed
6. Steps to Reproduce
7. Expected vs Actual Result
8. Test Environment (OS, Version, Hardware)
9. Attachments (Screenshots, Logs)
10. Assigned To
```

> **Severity vs Priority 구분!**
> - Severity: 결함의 *기술적 영향*도 (테스터 판단)
> - Priority: *업무적 처리 시급성* (PM/이해관계자 판단)
> - 예: UI 오타 → Severity: Minor, Priority: High (마케팅 자료 출시 직전)

### 결함 수명주기

```
New → Open → In Progress → Fixed → Retest → Closed
                    ↓                    ↓
                Rejected              Reopened
```

---

# Chapter 6: Test Tools (11%)

## 6.1 Tool Classification

| 분류 | 도구 | 예시 |
|------|------|------|
| Test Management | TC/결함 관리 | JIRA, TestRail, Zephyr |
| Static Analysis | 코드 분석 | SonarQube, Coverity |
| Test Execution | 자동화 실행 | Selenium, Appium, Robot Framework |
| Coverage | 커버리지 측정 | JaCoCo, gcov |
| Performance | 부하/성능 | JMeter, Gatling |
| CI/CD | 빌드/배포 | Jenkins, GitHub Actions |

## 6.2 Tool Selection Criteria

```
1. 팀 기술 수준과의 적합성
2. 테스트 대상 기술 스택과의 호환성
3. 기존 도구와의 통합 가능성
4. 라이선스 비용
5. 공급업체 지원
6. 유지보수성
```

## 6.3 Benefits and Risks

**이점**:
- 반복 작업 자동화 (회귀 테스트)
- 일관성 향상
- 메트릭 수집 용이

**위험**:
- 과도한 도구 의존성
- 도구 도입 비용 과소평가
- 테스트 자동화 = 수동 테스팅 불필요라는 오해

---

# 실전 문제 100선 (Practice Questions)

## Chapter 1 문제

**Q1.** Which of the following BEST describes the relationship between error, defect, and failure?
- A) A failure occurs, causing a defect, which leads to an error
- B) A developer makes an error, which causes a defect, which may cause a failure
- C) A defect causes an error, which may cause a failure
- D) Testing finds failures, developers fix defects, and errors are accepted

**✅ 정답: B**
> Error(사람 실수) → Defect(코드 결함) → Failure(시스템 오동작) 순서.

---

**Q2.** A team is testing a navigation system. They run 1,000 test cases and all pass. The system is then deployed and users report critical navigation errors. Which testing principle BEST explains this situation?
- A) Exhaustive testing is impossible
- B) Early testing saves time and money
- C) Testing shows presence of defects, not their absence
- D) Absence-of-errors is a fallacy

**✅ 정답: D**
> 테스트 통과 = 결함 없음이 아니며, 사용자가 원하는 기능인지 검증이 필요. C도 관련되지만 D가 더 정확히 설명함 (유저가 원하는 네비게이션이 아닐 수 있음).

---

**Q3.** Which of the following is the PRIMARY difference between testing and debugging?
- A) Testing is done by testers, debugging is done by managers
- B) Testing finds defects, debugging locates and fixes them
- C) Testing uses tools, debugging is manual
- D) Testing occurs after release, debugging occurs before

**✅ 정답: B**

---

**Q4.** Which testing principle states that the same tests become less effective over time?
- A) Defects cluster together
- B) Testing is context dependent
- C) Tests wear out
- D) Exhaustive testing is impossible

**✅ 정답: C**

---

**Q5.** A project team is running automated regression tests that have not changed in 6 months. What should they do to maintain test effectiveness?
- A) Run the same tests more frequently
- B) Reduce the number of test cases
- C) Add new test cases and update existing ones
- D) Switch to manual testing

**✅ 정답: C**
> Tests wear out 원칙의 적용: 새로운 테스트 추가 및 업데이트 필요.

---

**Q6.** In the context of test psychology, which of the following statements about testing independence is CORRECT?
- A) The highest level of independence is developers testing their own code
- B) Independent testing always leads to project success
- C) A higher level of independence typically leads to finding more defects
- D) Independent testing eliminates the need for developer unit testing

**✅ 정답: C**

---

**Q7.** Which of the following is a test objective?
- A) Finding and fixing all defects in the software
- B) Proving that the software has no defects
- C) Providing information to stakeholders for release decisions
- D) Ensuring the software meets all user expectations

**✅ 정답: C**
> "Proving no defects" 또는 "Finding all defects"는 불가능.

---

**Q8.** A defect is found during a code review before execution. Which type of testing is this?
- A) Dynamic testing
- B) Static testing
- C) Regression testing
- D) Exploratory testing

**✅ 정답: B**
> 코드 실행 없이 발견 = Static testing.

---

## Chapter 2 문제

**Q9.** In a V-model, which test level is MOST directly associated with requirements specification?
- A) Component testing
- B) Integration testing
- C) System testing
- D) Acceptance testing

**✅ 정답: D**
> V-model: 요구사항 ↔ 수락 테스팅 / 상세설계 ↔ 통합 테스팅 / 코드 ↔ 단위 테스팅

---

**Q10.** An automobile IVI system is being tested in a simulated production environment with all integrated components. Which test level is this?
- A) Component testing
- B) Component integration testing
- C) System testing
- D) Acceptance testing

**✅ 정답: C**

---

**Q11.** Which of the following is an example of non-functional testing?
- A) Testing that the login function correctly validates credentials
- B) Testing that the system can handle 1,000 concurrent users
- C) Testing that all menu items are accessible
- D) Testing that the software correctly calculates tax

**✅ 정답: B**
> 성능(Performance)은 non-functional testing.

---

**Q12.** After a defect is fixed in the authentication module, which type of test should be run FIRST?
- A) Regression testing
- B) Confirmation testing
- C) System testing
- D) Acceptance testing

**✅ 정답: B**
> 수정된 결함 자체가 해결됐는지 먼저 확인(Confirmation) → 그 후 회귀 테스트(Regression).

---

## Chapter 3 문제

**Q13.** Which of the following review types is the MOST formal?
- A) Informal review
- B) Walkthrough
- C) Technical review
- D) Inspection

**✅ 정답: D**

---

**Q14.** In a review, who is responsible for noting the defects found during the review meeting?
- A) Author
- B) Facilitator
- C) Scribe
- D) Review Leader

**✅ 정답: C**

---

**Q15.** Which of the following defects can be found by static analysis but NOT by dynamic testing?
- A) Performance issues under load
- B) Unreachable (dead) code
- C) Incorrect calculation results
- D) UI display issues

**✅ 정답: B**
> Dead code는 실행되지 않으므로 dynamic testing으로 발견 불가.

---

**Q16.** During a walkthrough, the author presents work to colleagues. What is the PRIMARY purpose?
- A) To formally measure product quality
- B) To find defects and gain understanding of the work
- C) To approve the work for the next phase
- D) To satisfy process compliance requirements

**✅ 정답: B**

---

## Chapter 4 문제 (가장 많이 출제)

**Q17.** A field accepts age values from 18 to 65. Using 2-value BVA, which test values should be used?
- A) 17, 18, 65, 66
- B) 18, 65
- C) 0, 18, 65, 100
- D) 17, 18, 19, 64, 65, 66

**✅ 정답: A**
> 2-value BVA: boundary + just outside. 경계값(18, 65)과 그 바깥(17, 66).

---

**Q18.** A password field accepts 8-12 characters. How many equivalence partitions exist?
- A) 2
- B) 3
- C) 4
- D) 5

**✅ 정답: B**
> 무효(< 8) / 유효(8~12) / 무효(> 12) = 3개 파티션.

---

**Q19.** Which test technique is MOST appropriate when a system has complex rules combining multiple conditions?
- A) Boundary Value Analysis
- B) Equivalence Partitioning
- C) Decision Table Testing
- D) State Transition Testing

**✅ 정답: C**

---

**Q20.** A parking sensor system has states: Inactive, Active, Alert, Emergency. Valid transitions occur only on sensor trigger. Which technique BEST tests this system?
- A) Equivalence Partitioning
- B) Decision Table Testing
- C) State Transition Testing
- D) Boundary Value Analysis

**✅ 정답: C**

---

**Q21.** 100% branch coverage guarantees which of the following?
- A) All paths through the code are tested
- B) All statements are executed
- C) All conditions are independently tested
- D) All defects are found

**✅ 정답: B**
> Branch coverage ⊇ Statement coverage.

---

**Q22.** An engineer uses their experience to create test cases targeting areas where errors commonly occur in UDS diagnostic services. Which technique is being used?
- A) Exploratory testing
- B) Checklist-based testing
- C) Error guessing
- D) Boundary value analysis

**✅ 정답: C**

---

**Q23.** Which test technique requires analyzing individual conditions independently influencing decisions?
- A) Statement coverage
- B) Branch coverage
- C) MC/DC coverage
- D) Path coverage

**✅ 정답: C**

---

**Q24.** An online store offers discounts based on: membership status (Y/N) and purchase amount (< 50K / 50K~100K / >100K). How many rules does the decision table have?
- A) 3
- B) 4
- C) 6
- D) 9

**✅ 정답: C**
> 2 × 3 = 6 조합.

---

**Q25.** Exploratory testing is BEST described as:
- A) Testing without any plan or documentation
- B) Simultaneous learning, test design, and test execution
- C) Testing based on a predefined checklist
- D) Automated testing without human interaction

**✅ 정답: B**

---

## Chapter 5 문제

**Q26.** Which of the following is a PRODUCT risk?
- A) Key test personnel leaving the project
- B) Test environment not being available on time
- C) A critical calculation module having defects
- D) Insufficient funding for testing

**✅ 정답: C**
> A, B, D는 Project Risk. C는 소프트웨어 기능 위험 = Product Risk.

---

**Q27.** Entry criteria for system testing include which of the following?
- A) All defects are fixed
- B) Integration testing is complete and the build is stable
- C) User acceptance testing is approved
- D) Test environment is decommissioned

**✅ 정답: B**

---

**Q28.** A defect causes users to lose all data when they log out. The marketing team considers this a low-priority fix due to upcoming deadline. Which statement is CORRECT?
- A) Severity: Low, Priority: Low
- B) Severity: High, Priority: Low
- C) Severity: Low, Priority: High
- D) Severity: High, Priority: High

**✅ 정답: B**
> 데이터 손실 = 기술적으로 High Severity. 하지만 마케팅 판단으로 Priority: Low.

---

**Q29.** Which of the following metrics indicates test PROGRESS?
- A) Number of defects found per module
- B) Percentage of test cases executed vs planned
- C) Lines of code per developer
- D) Number of defects fixed

**✅ 정답: B**

---

**Q30.** In risk-based testing, what should the testing team focus on FIRST?
- A) High likelihood, high impact risks
- B) Low likelihood, low impact risks
- C) All risks equally
- D) Only project risks

**✅ 정답: A**

---

## Chapter 6 문제

**Q31.** Which tool type helps developers identify code violations at build time?
- A) Test management tool
- B) Static analysis tool
- C) Test execution tool
- D) Coverage tool

**✅ 정답: B**

---

**Q32.** A team wants to automate regression testing for their web application. Which tool category should they select?
- A) Static analysis tools
- B) Test management tools
- C) Test execution tools
- D) Configuration management tools

**✅ 정답: C**

---

**Q33.** Which of the following is a RISK of test tool adoption?
- A) Increased test execution speed
- B) Consistent test results
- C) Over-reliance on tool capabilities and neglecting manual testing
- D) Easier defect tracking

**✅ 정답: C**

---

## 혼합 문제 (Mixed Questions)

**Q34.** Which of the following activities belongs to Test Analysis?
- A) Writing test scripts
- B) Identifying test conditions from requirements
- C) Executing test cases
- D) Reporting test results

**✅ 정답: B**
> Analysis = "무엇을 테스트할 것인가" = 테스트 조건 식별

---

**Q35.** A tester finds that 80% of defects come from 3 out of 20 modules. Which testing principle does this reflect?
- A) Tests wear out
- B) Defects cluster together
- C) Exhaustive testing is impossible
- D) Testing is context dependent

**✅ 정답: B**

---

**Q36.** Two-way traceability between test cases and requirements PRIMARILY helps to:
- A) Measure test execution speed
- B) Identify orphan test cases and untested requirements
- C) Automate test execution
- D) Reduce the cost of testing

**✅ 정답: B**

---

**Q37.** Which of the following is an advantage of independent testing?
- A) Eliminates the need for developer self-testing
- B) Testers can provide an objective perspective on the software
- C) Reduces communication effort between testers and developers
- D) Ensures all defects are found

**✅ 정답: B**

---

**Q38.** A field accepts values: A, B, C, D as valid; any other input is invalid. How many equivalence partitions are there?
- A) 1
- B) 2
- C) 4
- D) 5

**✅ 정답: B**
> 유효 파티션: {A, B, C, D} / 무효 파티션: {기타} = 2개

---

**Q39.** Testing a login form with: username (1-50 chars) and password (8-32 chars). Using EP, what is the minimum number of valid test cases needed to cover all valid partitions?
- A) 1
- B) 2
- C) 4
- D) 8

**✅ 정답: A**
> 각 필드의 유효 파티션에서 값 1개씩 → 1개의 TC로 두 유효 파티션 동시 커버 가능

---

**Q40.** In an agile project, which test type should be the primary focus of automated testing?
- A) Exploratory testing
- B) Regression testing
- C) User acceptance testing
- D) Static testing

**✅ 정답: B**

---

## 추가 고난도 문제

**Q41~Q100은 시험 응시 2주 전 자가 테스트용**

**Q41.** Which of the following BEST defines a test basis?
- A) The set of tools used during testing
- B) All documents from which test conditions can be derived
- C) The test environment where testing is performed
- D) The pass/fail criteria for tests

**✅ 정답: B**
> Test Basis: 요구사항, 설계 문서, 코드 등 TC를 만들기 위한 원본 문서

---

**Q42.** A test case includes: test inputs, execution preconditions, expected results, and expected postconditions. What element is MISSING?
- A) Test suite
- B) Test data
- C) Actual results
- D) Unique identifier

**✅ 정답: D** (unique ID는 필수 구성요소)

---

**Q43.** After the software is released, which testing is performed when an update is applied to a production system?
- A) System testing
- B) Maintenance testing
- C) Regression testing
- D) Acceptance testing

**✅ 정답: B**

---

**Q44.** A moderator in a formal review is responsible for:
- A) Writing the work product under review
- B) Fixing defects found during the review
- C) Facilitating the review process and maintaining efficiency
- D) Representing the customer's interests

**✅ 정답: C**

---

**Q45.** Which of the following is a characteristic of exploratory testing?
- A) It requires detailed test procedures written in advance
- B) Test sessions are time-boxed
- C) All results are automated
- D) It cannot be used in agile environments

**✅ 정답: B**
> Exploratory testing은 time-boxed session 형식으로 수행됨.

---

**Q46.** The software under test has the following code. 100% statement coverage requires how many test cases minimum?

```
if (x > 0):
    print("Positive")
if (y > 0):
    print("Positive Y")
print("Done")
```
- A) 1
- B) 2
- C) 3
- D) 4

**✅ 정답: A**
> x=1, y=1 한 번으로 3개 문장 모두 실행 가능. (if 분기가 독립적)

---

**Q47.** Test exit criteria for a sprint include "no open severity 1 or 2 defects." What type of criterion is this?
- A) Entry criterion
- B) Suspension criterion
- C) Resumption criterion
- D) Exit criterion

**✅ 정답: D**

---

**Q48.** Which of the following BEST represents the cost benefit of early testing?
- A) Testing is cheaper when performed by experienced testers
- B) Defects found earlier are cheaper to fix than those found later
- C) Automated testing is always cheaper than manual testing
- D) Early testing reduces the number of test cases needed

**✅ 정답: B**

---

**Q49.** In BVA, a field accepts input 1-100. Which test case set covers the boundaries correctly with 2-value BVA?
- A) 1, 50, 100
- B) 0, 1, 100, 101
- C) 1, 100
- D) 0, 50, 101

**✅ 정답: B**

---

**Q50.** Which of the following activities is part of test completion?
- A) Writing test cases
- B) Archiving testware for future reuse
- C) Executing test cases
- D) Identifying test conditions

**✅ 정답: B**

---

# 빠른 참조 카드 (Quick Reference Card)

## 7 Testing Principles 암기

```
1. Shows PRESENCE, not absence
2. Exhaustive = IMPOSSIBLE
3. EARLY testing saves money
4. Defects CLUSTER together
5. Tests WEAR OUT
6. Testing is CONTEXT dependent
7. Absence-of-errors FALLACY
```

## EP & BVA 즉시 적용

```
필드 범위: A~B (예: 18~65)
EP: (무효 <A), (유효 A~B), (무효 >B) → TC: A-1, A+(or B-), B+1
2-value BVA: A-1, A, B, B+1
3-value BVA: A-1, A, A+1, B-1, B, B+1
```

## Test Level → V-Model 매핑

```
요구사항 ←→ Acceptance Testing
시스템 설계 ←→ System Testing
상세 설계 ←→ Integration Testing
코드 ←→ Component Testing
```

## Severity vs Priority

```
Severity = 기술적 심각도 (테스터)
Priority = 처리 우선순위 (PM/비즈니스)
둘은 독립적! High Severity + Low Priority 가능
```

## 리뷰 유형 공식성 순서

```
Informal < Walkthrough < Technical Review < Inspection
```

---

*이 교재는 CTFL v4.0 공식 실라버스를 기반으로 작성됐습니다.*
*시험 전 반드시 ISTQB 공식 샘플 문제(40문항)를 풀어 점수를 확인하세요.*
*마지막 업데이트: 2026-06-18*
