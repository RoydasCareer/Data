# ISTQB CT-AuT 완전 학습 교재
> Certified Tester — Automotive Testing
> 이 자료만으로 CT-AuT 시험 합격 가능한 수준으로 작성됨
> 시험: 40문제 / 60분 / 65% 합격 (26/40) / 전제: CTFL 취득

---

## 시험 개요

| 항목 | 내용 |
|------|------|
| 문제 수 | 40문항 (객관식 4지선다) |
| 시험 시간 | 60분 |
| 합격 기준 | 65% = 26/40문항 |
| 전제 조건 | ISTQB CTFL 취득 |
| 출제 레벨 | K1 (기억), K2 (이해), K3 (적용) |
| 시험 기관 | KSTQB (한국), ISTQB 공인 기관 |

## 수환씨의 강점 영역

```
Chapter 5 (통신/진단 테스팅) ← UDS/DoIP/CAN 5년+ 실무 경험
Chapter 3 (안전 테스팅)      ← ISO 26262 기초, IVI 안전 기능 테스트 경험
Chapter 1 (자동차 도메인)    ← 현업 종사자
```

---

# Chapter 1: 자동차 도메인 이해

## 1.1 자동차 소프트웨어의 특성

### 자동차 SW의 특수성

일반 소프트웨어와 달리 자동차 SW는:

| 특성 | 설명 |
|------|------|
| **안전 필수** | 결함이 인명 피해로 이어질 수 있음 |
| **실시간성** | 정해진 시간 내에 응답해야 함 (Hard Real-time) |
| **장기 수명** | 차량 수명 10~15년, SW 업데이트 관리 필수 |
| **규제 환경** | UN R155, UN R156, ISO 26262 등 |
| **복잡한 공급망** | OEM → Tier1 → Tier2 → 소프트웨어 벤더 |

### 자동차 E/E (Electrical/Electronic) 아키텍처

```
OEM (Original Equipment Manufacturer)
  예: 현대, BMW, VW, JLR
      ↓ 요구사항 발주
Tier1 공급업체
  예: Bosch, Continental, Aptiv, FPT Korea
      ↓ 소프트웨어 개발
Tier2 공급업체
  예: 반도체 벤더, 소프트웨어 컴포넌트 공급업체
```

**ECU (Electronic Control Unit):**
차량 내 컴퓨터 단위. 현대 차량에는 100개 이상의 ECU가 존재.

예시:
- **BCM (Body Control Module):** 윈도우, 도어, 조명 제어
- **PCM (Powertrain Control Module):** 엔진/변속기 제어
- **ADAS ECU:** 자율주행 지원 기능
- **IVI (In-Vehicle Infotainment):** 내비게이션, 미디어, 통신

---

## 1.2 자동차 개발 표준

### A-SPICE (Automotive SPICE)

자동차 소프트웨어 개발 프로세스 품질 평가 모델.

| 레벨 | 이름 | 의미 |
|------|------|------|
| 0 | Incomplete | 프로세스 미구현 |
| 1 | Performed | 프로세스 수행됨 |
| 2 | Managed | 계획/모니터링됨 |
| 3 | Established | 표준 프로세스 정의 |
| 4 | Predictable | 정량적 관리 |
| 5 | Optimizing | 지속적 개선 |

**주요 프로세스:**
- SWE.4: SW Unit Verification (단위 테스트)
- SWE.5: SW Integration and Integration Test (통합 테스트)
- SWE.6: SW Qualification Test (자격 테스트)

### ISO 26262 (기능 안전)

자동차 전기/전자 시스템의 기능 안전 표준.

**ASIL (Automotive Safety Integrity Level):**

| 레벨 | 위험도 |
|------|--------|
| ASIL A | 최저 |
| ASIL B | 낮음 |
| ASIL C | 높음 |
| ASIL D | 최고 (브레이크, 조향 등) |
| QM | 안전과 무관한 기능 |

---

## 1.3 자동차 테스팅의 특수성

### V-모델과 자동차 SW 적용

```
시스템 요구사항  ←→  차량 검증 (VnV)
  HW/SW 요구사항  ←→  시스템 통합 테스트
    SW 요구사항  ←→  SW 자격 테스트 (SWE.6)
      아키텍처  ←→  SW 통합 테스트 (SWE.5)
        설계  ←→  SW 단위 테스트 (SWE.4)
```

### 자동차 특수 테스트 유형

| 테스트 유형 | 설명 | 예시 |
|------------|------|------|
| **HIL (Hardware-in-the-Loop)** | 실제 ECU + 시뮬레이션 환경 | 브레이크 ECU를 시뮬레이션 차량에 연결 |
| **SIL (Software-in-the-Loop)** | 소프트웨어만 시뮬레이션 | 코드 레벨에서 시뮬레이션 |
| **MIL (Model-in-the-Loop)** | 모델 기반 테스팅 | Simulink 모델 테스팅 |
| **실차 테스트** | 실제 차량에서 테스트 | 도로 주행 테스트 |

---

# Chapter 2: 도전 과제와 테스팅 접근법

## 2.1 자동차 SW 테스팅의 도전 과제

### 복잡성

| 도전 | 설명 |
|------|------|
| **ECU 간 통신** | 수십~수백 개의 ECU가 CAN/LIN/Ethernet으로 통신 |
| **실시간 제약** | 응답 시간이 ms 단위로 엄격하게 정의됨 |
| **환경 변수** | 온도, 전압, 진동에 따른 동작 변화 |
| **SW 의존성** | 여러 공급업체의 소프트웨어 통합 |

### OEM-Tier1 협업에서의 테스팅

```
OEM이 요구사항 정의
    ↓
Tier1이 소프트웨어 개발 + 단위/통합 테스트
    ↓
OEM이 시스템 통합 테스트 + 차량 검증
```

**수환씨의 경험 매핑:**
- FPT Korea (Tier1) ↔ 현대 연구소 (OEM) 협업 = 전형적인 Tier1-OEM 관계

---

## 2.2 리스크 기반 테스팅 (자동차 맥락)

### 자동차에서의 리스크 분류

| 리스크 요인 | 예시 |
|------------|------|
| **안전 관련** | 브레이크, 조향, ADAS 결함 → ASIL D |
| **법적/규제** | UN R155/R156 미준수 → 형식 승인 불가 |
| **브랜드 영향** | 리콜로 인한 평판 손실 |
| **계약** | Tier1이 OEM 요구사항 미충족 |

### 자동차 테스팅에서의 우선순위 결정

1. **안전 필수 기능 우선** (ASIL D → ASIL A → QM 순)
2. **고객 가시성 높은 기능** (차량 출발/정지, 네비게이션)
3. **규제 준수 기능** (UN R156 OTA 업데이트)

---

# Chapter 3: 안전 테스팅 (Safety Testing)

## 3.1 기능 안전 테스팅

### ISO 26262 테스팅 요구사항

ISO 26262는 ASIL 등급에 따라 테스팅 기법을 요구합니다:

| ASIL | 요구 커버리지 |
|------|-------------|
| ASIL A | 구문 커버리지 |
| ASIL B | 분기 커버리지 |
| ASIL C | MC/DC 커버리지 |
| ASIL D | MC/DC 커버리지 (강제) |

### HARA (Hazard Analysis and Risk Assessment)

```
위험 식별 → 위험 분류 → ASIL 결정 → 안전 목표 정의
```

**예시 — ABS 브레이크 시스템:**
- 위험: 브레이크 페달 밟아도 감속 안 됨
- 심각도(S): S3 (생명 위협)
- 노출도(E): E4 (도로 주행 시 항상)
- 제어 가능성(C): C3 (거의 불가)
- **결과 ASIL: D** (S3 + E4 + C3)

---

## 3.2 안전 관련 테스팅 기법

### 오류 주입 테스팅 (Fault Injection Testing)

고의로 결함을 주입하여 시스템의 오류 처리를 테스트합니다.

**예시:**
- CAN 통신 단선 시뮬레이션 → Fallback 동작 확인
- 전원 공급 불안정 → ECU 재시작 후 정상 복구 확인
- 센서 값 이상 → ASIL D 시스템이 안전한 상태로 전환하는지 확인

**도구:** CANoe 오류 주입 기능, HIL 시스템의 오류 시뮬레이터

### 롭버스트니스 테스팅 (Robustness Testing)

극한 조건에서 시스템이 안전하게 동작하는지 확인합니다.

| 테스트 영역 | 예시 |
|------------|------|
| 온도 | -40°C ~ +85°C 동작 확인 |
| 전압 | 9V~16V 범위에서 정상 동작 |
| 진동/충격 | 자동차 노면 진동 환경 |
| EMC | 전자기 간섭 환경 |

---

## 3.3 안전 메커니즘 테스팅

### 안전 메커니즘 유형

| 메커니즘 | 설명 | 테스팅 방법 |
|---------|------|------------|
| **워치독 (Watchdog)** | 소프트웨어 응답 없으면 ECU 재시작 | 의도적으로 응답 중단 후 재시작 확인 |
| **중복성 (Redundancy)** | 동일 기능 두 개의 독립 경로 | 하나 고장 시 다른 경로로 전환 확인 |
| **CRC 체크** | 데이터 무결성 확인 | CRC 오류 주입 후 거부 확인 |
| **타임아웃** | 응답 없으면 안전 상태로 전환 | 타임아웃 발생 시뮬레이션 |

---

# Chapter 4: 환경과 도구 (테스팅 환경)

## 4.1 자동차 테스팅 환경

### Vector CANoe 활용

수환씨가 이미 능숙한 도구. 시험에서의 역할 이해가 중요합니다.

| CANoe 기능 | 테스팅 활용 |
|-----------|-----------|
| CAN 메시지 모니터링 | 실시간 통신 상태 확인 |
| 오류 프레임 시뮬레이션 | 오류 처리 테스팅 |
| CAPL 스크립팅 | 자동화 테스트 케이스 작성 |
| 진단 창 | UDS 서비스 수동 테스팅 |

### HIL (Hardware-in-the-Loop) 테스팅

```
실제 ECU
   ↕ CAN/LIN/Ethernet
HIL 시스템 (NI PXI, dSPACE 등)
   ↕ 물리 신호 시뮬레이션
나머지 차량 환경 (센서, 액추에이터) 시뮬레이션
```

**장점:**
- 실차 없이 위험한 시나리오 테스트 가능
- 반복 재현성 우수
- 고장 주입 용이

**단점:**
- 구축 비용 높음
- 실제 차량 환경과 완전히 동일하지 않음

---

## 4.2 테스팅 자동화 (자동차 맥락)

### 자동차 테스트 자동화 도구

| 도구 | 용도 |
|------|------|
| **CANoe / CANalyzer** | CAN/Ethernet 통신 테스트 자동화 |
| **CAPL** | CANoe 테스트 스크립트 언어 |
| **Python + python-can** | 오픈소스 CAN 테스트 자동화 |
| **pytest + udsoncan** | UDS 진단 테스트 자동화 |
| **ECU-TEST (Tracetronic)** | 자동차 특화 테스트 자동화 플랫폼 |
| **Jenkins** | CI/CD 파이프라인 |

### 테스트 자동화의 자동차 특수성

- **타이밍 의존성:** CAN 메시지의 주기성 테스트
- **하드웨어 의존성:** 실제 CAN 버스나 HIL 필요
- **비결정적 동작:** 타임아웃, 재시도 로직 처리
- **긴 테스트 시간:** 내구성 테스트 (수백 시간)

---

# Chapter 5: 통신 및 진단 테스팅 (수환씨 핵심 강점)

## 5.1 자동차 통신 버스

### CAN (Controller Area Network)

```
특징:
- 1983년 Bosch 개발
- 최대 1Mbps (CAN), 5/10Mbps (CAN FD)
- CSMA/CA 방식 (충돌 해결)
- 11비트 또는 29비트 ID (표준/확장)

CAN 메시지 프레임:
SOF | ID (11/29비트) | RTR | DLC | Data (0~8바이트) | CRC | ACK | EOF
```

**테스팅 포인트:**
- CAN ID 필터링
- DLC 검증
- 데이터 범위 검증
- 타임아웃 처리
- 버스 부하 (Bus Load) 측정

### LIN (Local Interconnect Network)

| 특성 | 내용 |
|------|------|
| 속도 | 최대 20Kbps |
| 토폴로지 | 마스터-슬레이브 |
| 용도 | 윈도우, 미러, 좌석 제어 등 저속 장치 |
| 비용 | CAN보다 저렴 |

### 자동차 Ethernet

| 표준 | 속도 | 용도 |
|------|------|------|
| 100BASE-T1 | 100Mbps | 일반 차량 데이터 |
| 1000BASE-T1 | 1Gbps | 카메라, 레이더 데이터 |
| BroadR-Reach | - | 자동차 특화 Ethernet |

---

## 5.2 UDS (ISO 14229) — 수환씨 핵심 전문 영역

### UDS 기초

UDS (Unified Diagnostic Services)는 자동차 ECU와 진단 도구 간의 통신 프로토콜.

```
진단 도구 (Tester)   →  [UDS 요청]  →  ECU
진단 도구 (Tester)  ←  [UDS 응답]  ←  ECU
```

### 주요 서비스 정리

| 서비스 ID | 이름 | 기능 |
|----------|------|------|
| 0x10 | DiagnosticSessionControl | 진단 세션 전환 |
| 0x11 | ECUReset | ECU 재시작 |
| 0x14 | ClearDiagnosticInformation | DTC 삭제 |
| 0x19 | ReadDTCInformation | 결함 코드 읽기 |
| 0x22 | ReadDataByIdentifier | 데이터 읽기 (DID) |
| 0x27 | SecurityAccess | 보안 접근 (Seed/Key) |
| 0x2E | WriteDataByIdentifier | 데이터 쓰기 |
| 0x31 | RoutineControl | 루틴 실행 |
| 0x34 | RequestDownload | 다운로드 준비 |
| 0x36 | TransferData | 데이터 전송 |
| 0x37 | RequestTransferExit | 전송 완료 |
| 0x3E | TesterPresent | 진단 연결 유지 |

### 세션 유형

| 세션 | 서브펑션 | 접근 가능 기능 |
|------|---------|--------------|
| Default (01) | 0x01 | 기본 진단 기능 |
| Programming (02) | 0x02 | 플래시 프로그래밍 |
| Extended (03) | 0x03 | 확장 진단 기능 |

**세션 전환 테스팅 (상태 전이):**
```
Default → Extended: 0x10 0x03
Extended → Programming: 0x10 0x02
Programming → Default: 0x10 0x01 or ECUReset
```

### NRC (Negative Response Code) 테스팅

결함 처리 테스팅에서 핵심:

| NRC | 이름 | 테스팅 시나리오 |
|-----|------|---------------|
| 0x10 | generalReject | 지원되지 않는 서비스 |
| 0x11 | serviceNotSupported | 현재 세션에서 미지원 |
| 0x12 | subFunctionNotSupported | 잘못된 서브펑션 |
| 0x13 | incorrectMessageLength | 잘못된 메시지 길이 |
| 0x22 | conditionsNotCorrect | 선행 조건 미충족 |
| 0x24 | requestSequenceError | 잘못된 순서 |
| 0x31 | requestOutOfRange | 범위 초과 DID |
| 0x33 | securityAccessDenied | 보안 접근 거부 |
| 0x35 | invalidKey | 잘못된 Key 값 |

### UDS 테스팅 기법 매핑

| CTFL 기법 | UDS 테스팅 적용 |
|----------|---------------|
| EP (동등값 분할) | 유효 DID vs 무효 DID |
| BVA (경계값) | DID 범위 경계 값 |
| 상태 전이 | 세션 전환 (Default↔Extended↔Programming) |
| 결정 테이블 | SecurityAccess (Seed/Key 조합) |

---

## 5.3 DoIP (ISO 13400) — JLR 프로젝트 경험

### DoIP란

**Diagnostics over Internet Protocol**
UDS 메시지를 Ethernet (TCP/IP) 위에서 전송하는 프로토콜.

```
진단 도구
    ↓ DoIP (Ethernet)
DoIP Gateway (차량 내부)
    ↓ CAN/LIN/Ethernet
개별 ECU들
```

### DoIP 주요 포트

| 포트 | 용도 |
|------|------|
| UDP 13400 | Vehicle Announcement, Entity Status |
| TCP 13400 | 진단 데이터 전송 |

### DoIP 통신 절차

```
1. UDP Broadcast: Vehicle Announcement 수신
2. TCP 연결 수립 (포트 13400)
3. Routing Activation Request 전송
4. UDS 메시지 전송 (DoIP 페이로드로)
5. 응답 수신
```

### DoIP 테스팅 포인트

| 테스트 항목 | 방법 |
|------------|------|
| Vehicle Announcement 수신 | Wireshark로 UDP 13400 캡처 |
| Routing Activation | 유효/무효 Activation Type 테스트 |
| 타임아웃 처리 | TCP 연결 유지, T_TCP_General_Inactivity |
| 동시 연결 수 | 최대 연결 수 초과 시 동작 |

---

## 5.4 ASAM SOVD (차세대 진단)

### UDS vs SOVD 비교

| 항목 | UDS/DoIP | SOVD |
|------|---------|------|
| 프로토콜 | 바이너리 | HTTP REST |
| 데이터 형식 | HEX | JSON |
| 표준 | ISO | ASAM |
| 상태 | 현용 주류 | 도입 초기 |

### SOVD 핵심 엔드포인트

```
GET /components/{id}/data/{did}  ← ReadDataByIdentifier
GET /components/{id}/faults       ← ReadDTCInformation
POST /components/{id}/operations  ← RoutineControl
GET /sessions                     ← DiagnosticSessionControl
```

---

# Chapter 6: 테스팅 전반 (CTFL 연계)

## 6.1 자동차 SW 테스트 레벨

| 레벨 | A-SPICE 매핑 | 수행 주체 |
|------|------------|---------|
| 단위 테스트 | SWE.4 | 개발자/SW 팀 |
| 통합 테스트 | SWE.5 | SW 팀 |
| SW 자격 테스트 | SWE.6 | 독립 테스트 팀 |
| 시스템 통합 | SYS.4 | 시스템 팀 |
| 차량 검증 | SYS.5 | OEM |

## 6.2 자동차 특수 테스트 설계

### Equivalence Partitioning — 자동차 맥락

**CAN ID 파티션 예시:**
- 유효 ID: 표준 메시지 ID (0x001 ~ 0x7FF)
- 무효 ID: 정의되지 않은 ID → 무시 또는 오류 처리
- 경계: 0x000, 0x001, 0x7FF, 0x800

**UDS DID 파티션:**
- 유효 DID: 0xF190 (VIN), 0xF186 등 정의된 DID
- 무효 DID: 정의되지 않은 DID → NRC 0x31 응답 확인

### State Transition — 자동차 맥락

**UDS 세션 상태 전이:**
```
[Default 세션]
    ↓ 0x10 0x03 (요청)
[Extended 세션]
    ↓ 0x10 0x02 (Programming 전환)
[Programming 세션]
    ↓ 0x10 0x01 또는 ECUReset
[Default 세션]
```

**IVI 미디어 재생 상태:**
```
[정지]
    ↓ 재생 버튼
[재생 중]
    ↓ 전화 수신
[일시정지] ← 전화 종료 → [재생 중]
    ↓ 정지 버튼
[정지]
```

---

# 연습문제 — CT-AuT (50문항)

## 자동차 도메인 기초 (1~15번)

**문제 1 (K1)**
ECU란 무엇인가?

a) Extended CAN Unit
b) Electronic Control Unit
c) Engine Control Utility
d) Electrical Circuit Unit

**정답: b)**
ECU = Electronic Control Unit. 차량 내 컴퓨터 단위.

---

**문제 2 (K1)**
A-SPICE에서 소프트웨어 단위 검증(Unit Verification)에 해당하는 프로세스는?

a) SWE.4
b) SWE.5
c) SWE.6
d) SYS.4

**정답: a)**
SWE.4 = SW Unit Verification (단위 테스트)
SWE.5 = SW Integration Test
SWE.6 = SW Qualification Test

---

**문제 3 (K2)**
ISO 26262에서 ASIL D가 적용되는 시스템의 예는?

a) 실내 조명 제어
b) 파워 윈도우
c) 브레이크 제어 시스템
d) IVI 오디오 볼륨

**정답: c)**
ASIL D는 가장 높은 안전 무결성 레벨. 브레이크, 조향 등 생명과 직결된 기능에 적용.

---

**문제 4 (K2)**
HIL(Hardware-in-the-Loop) 테스팅의 특징은?

a) 소프트웨어만 시뮬레이션하고 하드웨어는 없다
b) 실제 ECU를 시뮬레이션된 환경과 연결하여 테스트한다
c) 실제 차량에서만 수행할 수 있다
d) 모델만으로 테스팅한다

**정답: b)**
HIL = 실제 ECU + 시뮬레이션된 차량 환경 (HIL 시스템)

---

**문제 5 (K2)**
자동차 개발에서 Tier1 공급업체의 역할은?

a) 최종 차량을 생산한다
b) 직접 소비자에게 부품을 판매한다
c) OEM의 요구사항을 받아 시스템/소프트웨어를 개발한다
d) 반도체 칩을 설계한다

**정답: c)**
Tier1은 OEM 요구사항을 받아 ECU, 시스템, 소프트웨어를 개발합니다.

---

**문제 6 (K2)**
ASIL 결정 시 고려하는 세 가지 요소는?

a) 비용, 일정, 품질
b) 심각도(S), 노출도(E), 제어 가능성(C)
c) 기능성, 성능, 보안
d) 요구사항, 설계, 구현

**정답: b)**
ASIL = 심각도(Severity) × 노출도(Exposure) × 제어가능성(Controllability)

---

**문제 7 (K1)**
V-모델에서 SWE.6(SW Qualification Test)에 대응하는 개발 단계는?

a) SW 아키텍처 설계
b) SW 요구사항 정의
c) SW 단위 설계
d) 시스템 요구사항

**정답: b)**
SW 요구사항 ↔ SW 자격 테스트 (SWE.6)

---

**문제 8 (K2)**
자동차 테스팅에서 롭버스트니스 테스팅(Robustness Testing)의 목적은?

a) 기능적 요구사항 검증
b) 극한 조건에서 시스템이 안전하게 동작하는지 확인
c) 코드 커버리지 측정
d) 사용자 인터페이스 테스팅

**정답: b)**
롭버스트니스 테스팅은 온도, 전압, 진동 등 극한 환경에서의 동작을 확인합니다.

---

**문제 9 (K2)**
HARA(Hazard Analysis and Risk Assessment)의 목적은?

a) 소프트웨어 결함을 발견한다
b) 위험을 식별하고 ASIL을 결정한다
c) 테스트 케이스를 생성한다
d) 코드 품질을 평가한다

**정답: b)**
HARA는 시스템 위험을 식별하고 각 위험의 ASIL 등급을 결정합니다.

---

**문제 10 (K3)**
자동차 IVI 시스템에서 소프트웨어 업데이트 기능을 테스팅합니다.
어떤 규제와 가장 관련이 있는가?

a) UN R155 (사이버보안)
b) UN R156 (소프트웨어 업데이트 관리)
c) ISO 26262 (기능 안전)
d) A-SPICE (프로세스 품질)

**정답: b)**
UN R156은 소프트웨어 업데이트 관리 시스템(SUMS)을 요구합니다. OTA 포함 모든 SW 업데이트.

---

**문제 11 (K2)**
오류 주입 테스팅(Fault Injection Testing)의 목적은?

a) 새로운 기능을 추가한다
b) 의도적으로 결함을 주입하여 시스템의 오류 처리 능력을 확인한다
c) 성능을 최적화한다
d) 코드 커버리지를 향상시킨다

**정답: b)**
오류 주입은 고의로 결함을 만들어 시스템의 오류 감지/처리/복구를 테스트합니다.

---

**문제 12 (K2)**
SIL(Software-in-the-Loop)과 HIL(Hardware-in-the-Loop)의 차이는?

a) SIL은 실제 ECU를 사용하고 HIL은 소프트웨어만 사용한다
b) SIL은 소프트웨어를 시뮬레이션 환경에서 테스트하고 HIL은 실제 ECU를 사용한다
c) 두 방법은 동일하다
d) HIL은 실차에서만 사용된다

**정답: b)**
SIL = 소프트웨어만 시뮬레이션
HIL = 실제 ECU + 시뮬레이션된 환경

---

**문제 13 (K1)**
QM(Quality Management)이란 무엇인가?

a) 가장 높은 안전 무결성 레벨
b) ASIL과 동등한 레벨
c) 안전과 관계없는 기능에 적용되는 레벨
d) ISO 26262가 적용되지 않는다는 의미

**정답: c)**
QM(Quality Management)은 안전과 무관한 기능에 적용됩니다. ASIL 없음.

---

**문제 14 (K2)**
자동차 테스팅에서 리스크 기반 접근법을 사용할 때 가장 먼저 테스트해야 할 것은?

a) 최근에 변경된 기능
b) 개발하기 가장 어려웠던 기능
c) ASIL D 등급의 안전 필수 기능
d) 가장 자주 사용되는 기능

**정답: c)**
ASIL D 기능은 가장 높은 안전 리스크를 가지므로 최우선 테스트 대상입니다.

---

**문제 15 (K3)**
차량 브레이크 ECU에서 워치독(Watchdog) 타이머가 만료될 때의 동작을 테스트합니다.
어떤 기법을 사용해야 하는가?

a) 동등값 분할
b) 경계값 분석
c) 오류 주입 테스팅
d) 탐색적 테스팅

**정답: c)**
워치독 타이머 만료는 의도적으로 소프트웨어 응답을 차단하는 오류 주입으로 테스트합니다.

---

## 통신 및 진단 테스팅 (16~35번)

**문제 16 (K1)**
UDS의 표준 번호는?

a) ISO 13400
b) ISO 14229
c) ISO 15765
d) ISO 11898

**정답: b)**
UDS = ISO 14229
DoIP = ISO 13400
CAN Transport Protocol = ISO 15765
CAN = ISO 11898

---

**문제 17 (K2)**
UDS에서 0x19 서비스의 기능은?

a) 진단 세션 전환
b) ECU 재시작
c) 결함 코드(DTC) 정보 읽기
d) 데이터 식별자 읽기

**정답: c)**
0x19 ReadDTCInformation = DTC(Diagnostic Trouble Code) 정보 읽기

---

**문제 18 (K3)**
UDS에서 Extended 세션을 요청했지만 현재 세션에서 지원하지 않는 조건이 발생했습니다.
어떤 NRC가 반환되어야 하는가?

a) 0x10 (generalReject)
b) 0x11 (serviceNotSupported)
c) 0x22 (conditionsNotCorrect)
d) 0x31 (requestOutOfRange)

**정답: c)**
conditionsNotCorrect(0x22)는 선행 조건이 충족되지 않았을 때 반환됩니다.

---

**문제 19 (K2)**
DoIP(ISO 13400)의 기본 포트 번호는?

a) 80
b) 443
c) 13400
d) 8080

**정답: c)**
DoIP는 UDP 13400(Vehicle Discovery)과 TCP 13400(진단 통신)을 사용합니다.

---

**문제 20 (K1)**
UDS 0x27 서비스(SecurityAccess)의 목적은?

a) ECU를 재시작한다
b) DTC를 삭제한다
c) 보호된 기능에 접근하기 위한 인증을 수행한다
d) 소프트웨어를 업데이트한다

**정답: c)**
SecurityAccess(Seed/Key 메커니즘)는 플래시 프로그래밍 등 보호된 기능 접근에 사용됩니다.

---

**문제 21 (K3)**
UDS SeekurityAccess(0x27)를 테스트합니다.
올바른 Key를 전송하지 않았을 때 예상되는 NRC는?

a) 0x10 (generalReject)
b) 0x33 (securityAccessDenied)
c) 0x35 (invalidKey)
d) 0x22 (conditionsNotCorrect)

**정답: c)**
잘못된 Key 전송 → NRC 0x35 invalidKey

---

**문제 22 (K2)**
CAN 버스에서 DLC(Data Length Code)가 의미하는 것은?

a) 메시지 우선순위
b) 데이터 필드의 바이트 수
c) 전송 속도
d) 오류 감지 코드

**정답: b)**
DLC = Data Length Code. CAN 메시지의 데이터 바이트 수 (0~8바이트, CAN FD는 최대 64바이트).

---

**문제 23 (K3)**
UDS DID 0xF190(VIN 읽기)을 동등값 분할로 테스트합니다.
파티션 구성으로 올바른 것은?

a) 유효 DID (0xF190) 만 테스트
b) 유효 DID (0xF190)와 무효 DID (정의되지 않은 값) 모두 테스트
c) 경계값 DID만 테스트
d) 모든 가능한 DID를 테스트

**정답: b)**
동등값 분할: 유효 파티션(정의된 DID)과 무효 파티션(정의되지 않은 DID) 모두 테스트.

---

**문제 24 (K2)**
DoIP에서 Routing Activation이 필요한 이유는?

a) TCP 연결 속도를 높이기 위해
b) 진단 도구가 특정 ECU에 접근할 권한을 얻기 위해
c) 데이터 암호화를 위해
d) 오류를 감지하기 위해

**정답: b)**
Routing Activation은 진단 도구가 DoIP Gateway를 통해 특정 ECU에 접근할 수 있는 권한을 얻는 과정입니다.

---

**문제 25 (K3)**
UDS 세션 전환(Default → Extended → Programming)을 테스트할 때 적용하는 가장 적합한 기법은?

a) 동등값 분할
b) 경계값 분석
c) 상태 전이 테스팅
d) MC/DC 커버리지

**정답: c)**
세션 전환은 상태(Default, Extended, Programming)와 전이(0x10 서비스)가 있으므로 상태 전이 테스팅 적용.

---

**문제 26 (K2)**
CAN에서 RTR(Remote Transmission Request) 프레임의 목적은?

a) 오류를 보고한다
b) 다른 노드에 데이터를 요청한다
c) 버스 통신을 종료한다
d) 마스터 노드를 식별한다

**정답: b)**
RTR 프레임은 다른 CAN 노드에게 데이터 전송을 요청하는 원격 프레임입니다.

---

**문제 27 (K1)**
ASAM SOVD에서 DTC를 읽기 위한 HTTP 메서드와 엔드포인트는?

a) POST /components/{id}/data
b) GET /components/{id}/faults
c) DELETE /components/{id}/dtc
d) PUT /components/{id}/faults

**정답: b)**
SOVD에서 DTC 조회: GET /components/{id}/faults (UDS 0x19에 대응)

---

**문제 28 (K2)**
UDS 플래시 프로그래밍(ECU 소프트웨어 업데이트) 순서로 올바른 것은?

a) 0x34 → 0x36 → 0x37
b) 0x27 → 0x34 → 0x36 → 0x37
c) 0x10(Programming 세션) → 0x27(SecurityAccess) → 0x34 → 0x36 → 0x37
d) 0x10(Programming 세션) → 0x34 → 0x36 → 0x37

**정답: c)**
플래시 순서: Programming 세션 → SecurityAccess → RequestDownload(0x34) → TransferData(0x36) → RequestTransferExit(0x37)

---

**문제 29 (K2)**
UDS에서 TesterPresent(0x3E) 서비스를 주기적으로 전송하는 이유는?

a) 진단 세션을 종료하기 위해
b) 비Default 세션이 타임아웃으로 자동 종료되지 않도록 유지하기 위해
c) DTC를 삭제하기 위해
d) ECU를 재시작하기 위해

**정답: b)**
Extended/Programming 세션은 5초마다 메시지가 없으면 Default 세션으로 복귀합니다.
TesterPresent는 이 타이머를 리셋합니다.

---

**문제 30 (K3)**
다음 중 CAN 버스 테스팅에서 경계값 분석(BVA)을 적용할 수 있는 케이스는?

a) ECU 제조사 식별
b) 메시지 타임아웃 (예: 메시지 주기 최대 허용 지연)
c) CAN ID 유효성
d) 버스 속도 설정

**정답: b)**
타임아웃 시간의 경계값 테스팅: 예) 타임아웃이 100ms라면 99ms(유효), 100ms(경계), 101ms(무효) 테스트.

---

**문제 31 (K2)**
자동차 Ethernet에서 100BASE-T1의 특징은?

a) 양방향 2-쌍 케이블 사용
b) 100Mbps 속도, 단일 비차폐 쌍선(UTP) 사용
c) 최대 10Mbps 속도
d) USB 인터페이스 기반

**정답: b)**
100BASE-T1은 100Mbps, 단선 쌍(single unshielded twisted pair)으로 자동차 환경에 최적화.

---

**문제 32 (K2)**
UDS에서 ReadDataByIdentifier(0x22)를 테스트할 때 결정 테이블이 유용한 경우는?

a) DID 값의 범위 테스팅
b) 여러 세션 × 여러 DID의 접근 권한 조합 테스팅
c) 타임아웃 처리 테스팅
d) 데이터 형식 검증

**정답: b)**
결정 테이블: 세션(Default/Extended/Programming) × DID(접근 가능/불가)의 조합 테스팅.

---

**문제 33 (K3)**
LIN 버스에서 마스터가 슬레이브에서 응답을 받지 못했을 때 올바른 테스팅은?

a) 재전송 로직이 작동하는지 확인
b) 에러 카운터가 증가하는지 확인
c) 타임아웃 처리가 올바르게 동작하는지 확인 (슬레이브 응답 시뮬레이션 차단)
d) 버스 속도를 낮춘다

**정답: c)**
슬레이브 응답 차단(오류 주입) 후 마스터의 타임아웃 처리를 검증합니다.

---

**문제 34 (K2)**
UDS 0x14(ClearDiagnosticInformation) 서비스 테스팅 시 확인해야 할 것은?

a) DTC가 성공적으로 읽혔는지 확인
b) 서비스 실행 후 DTC가 실제로 삭제되었는지 0x19로 확인
c) 세션 전환이 올바른지 확인
d) CAN 버스 부하를 측정한다

**정답: b)**
DTC 삭제(0x14) 후 ReadDTCInformation(0x19)으로 삭제 여부를 검증합니다.

---

**문제 35 (K3)**
진단 도구(CANoe)로 ECU와 통신 중 예상치 못한 NRC 0x22(conditionsNotCorrect)가 반환됐습니다.
이 상황의 가능한 원인은?

a) 서비스 ID가 잘못됨
b) 메시지 길이가 부정확함
c) 현재 세션에서 해당 서비스가 허용되지 않거나 선행 조건이 충족되지 않음
d) DID가 범위를 벗어남

**정답: c)**
conditionsNotCorrect(0x22)는 요청 자체는 올바르지만 현재 조건(세션, 선행 동작 등)이 맞지 않을 때 반환됩니다.

---

## 안전 및 커버리지 테스팅 (36~45번)

**문제 36 (K2)**
ASIL D 기능의 소프트웨어 테스팅에 요구되는 커버리지 기준은?

a) 구문 커버리지
b) 분기 커버리지
c) MC/DC 커버리지
d) 경로 커버리지

**정답: c)**
ISO 26262: ASIL C/D → MC/DC 커버리지 요구

---

**문제 37 (K3)**
다음 코드의 MC/DC 테스트를 위해 조건 A와 B 각각이 독립적으로 결과에 영향을 미침을 보여야 합니다.
```
if (speed > 120 and warning_active):
    trigger_alert()
```
어떤 테스트 케이스 쌍이 A(speed>120)의 독립적 영향을 보이는가?

a) (True, True)와 (True, False)
b) (True, False)와 (False, False)
c) (True, True)와 (False, True)
d) (False, True)와 (False, False)

**정답: c)**
A의 영향을 보이려면 B를 True로 고정하고 A를 True→False로 변경:
(True, True) → True / (False, True) → False

---

**문제 38 (K2)**
자동차 SW에서 "안전 메커니즘(Safety Mechanism)"의 예로 올바른 것은?

a) 화면 해상도 설정
b) 워치독 타이머 (Watchdog Timer)
c) 미디어 재생 품질
d) GPS 정확도

**정답: b)**
워치독은 소프트웨어 응답을 모니터링하고 응답이 없으면 ECU를 재시작하는 안전 메커니즘입니다.

---

**문제 39 (K2)**
안전 테스팅에서 "커버리지"와 "리스크"의 관계는?

a) 리스크가 높을수록 더 강한 커버리지 기준이 요구된다
b) 리스크가 낮을수록 더 강한 커버리지가 필요하다
c) 커버리지와 리스크는 독립적이다
d) 항상 100% 커버리지가 요구된다

**정답: a)**
ASIL이 높을수록(더 위험할수록) 더 강한 커버리지(MC/DC)가 요구됩니다.

---

**문제 40 (K3)**
ABS 브레이크 ECU에서 오류 주입 테스팅을 수행합니다.
센서 값이 비정상적으로 높을 때 ABS가 어떻게 반응하는지 테스트하려면?

a) 실제 도로 테스트를 수행한다
b) HIL 시스템에서 센서 값을 비정상으로 시뮬레이션한다
c) 동등값 분할로 센서 파티션을 나눈다
d) 탐색적 테스팅을 수행한다

**정답: b)**
HIL에서 센서 값을 비정상으로 설정하여 안전하게 오류 처리를 테스트합니다.

---

**문제 41 (K2)**
자동차 SW에서 "Fail-Safe" 동작이란?

a) 결함이 없을 때의 동작
b) 결함이 발생했을 때 안전한 상태로 전환하는 동작
c) 성능이 최적화된 동작
d) 비용이 최소화된 동작

**정답: b)**
Fail-Safe는 결함 발생 시 더 안전한 상태로 전환하는 메커니즘입니다 (예: 브레이크 결함 시 최대 제동력 유지).

---

**문제 42 (K1)**
ISO 26262에서 12개의 파트 중 소프트웨어 레벨을 다루는 파트는?

a) Part 3
b) Part 6
c) Part 9
d) Part 11

**정답: b)**
ISO 26262 Part 6 = Product development at the software level

---

**문제 43 (K2)**
자동차 Ethernet 테스팅에서 확인해야 할 항목이 아닌 것은?

a) 통신 지연 시간 (Latency)
b) 패킷 손실률
c) 색상 표시 정확도
d) 대역폭 활용률

**정답: c)**
색상 표시는 Ethernet 통신 테스팅 항목이 아닙니다.

---

**문제 44 (K3)**
차량의 전원이 갑자기 차단되었다가 복구될 때 ECU가 올바르게 재시작되는지 테스트합니다.
이것은 어떤 테스팅인가?

a) 기능 테스팅
b) 성능 테스팅
c) 롭버스트니스 테스팅
d) 사용성 테스팅

**정답: c)**
전원 차단/복구는 극한 환경 조건으로 롭버스트니스 테스팅의 영역입니다.

---

**문제 45 (K2)**
자동차 SW에서 실시간(Real-time) 요구사항 테스팅의 특징은?

a) 기능적 정확성만 확인한다
b) 응답 시간이 정해진 기준 내에 있는지 확인한다
c) 사용자 만족도를 측정한다
d) 코드 구조를 분석한다

**정답: b)**
자동차 SW는 Hard Real-time 요구사항이 있어 응답 시간이 명확한 기준 내에 있어야 합니다.

---

## 종합 응용 (46~50번)

**문제 46 (K3)**
수환씨가 IVI 시스템에서 소프트웨어 OTA 업데이트를 테스팅합니다.
UN R156 관점에서 확인해야 할 항목은?

a) 화면 해상도가 변경되지 않는지
b) 업데이트 파일 무결성 검증 및 업데이트 후 회귀 테스팅
c) 업데이트 완료 시간 단축
d) 배터리 소모량 감소

**정답: b)**
UN R156 SUMS는 SW 업데이트 무결성과 안전 기능 영향 없음을 검증해야 합니다.

---

**문제 47 (K3)**
CANoe로 JLR Range Rover Velar의 DoIP 통신을 테스트합니다.
Routing Activation Request를 전송했더니 응답이 없습니다.
가장 먼저 확인해야 할 것은?

a) ECU를 재시작한다
b) 다른 UDS 서비스를 시도한다
c) DoIP Gateway의 IP 주소와 포트 13400 연결 상태를 확인한다
d) CAN 버스 속도를 변경한다

**정답: c)**
DoIP 응답 없음 → 먼저 네트워크 연결(IP, 포트 13400) 상태를 확인합니다.

---

**문제 48 (K3)**
UDS를 통해 ECU를 플래시 프로그래밍할 때 SecurityAccess(0x27)가 필요한 이유는?

a) 진단 속도를 높이기 위해
b) 승인되지 않은 소프트웨어 다운로드를 방지하기 위해
c) DTC를 자동으로 삭제하기 위해
d) CAN 버스 부하를 줄이기 위해

**정답: b)**
SecurityAccess는 인증된 도구/엔지니어만 플래시 프로그래밍 등 위험한 동작을 수행할 수 있도록 보호합니다.

---

**문제 49 (K3)**
자동차 진단 테스팅에서 다음 테스트 케이스를 어떤 기법으로 설계했는가?
- TC1: 올바른 DID + Default 세션 → 성공 응답
- TC2: 올바른 DID + Extended 세션 → 성공 응답
- TC3: 잘못된 DID + Default 세션 → NRC 0x31
- TC4: 잘못된 DID + Extended 세션 → NRC 0x31

a) 경계값 분석
b) 결정 테이블 테스팅 (DID × 세션 조합)
c) 상태 전이 테스팅
d) 오류 주입 테스팅

**정답: b)**
DID 유효성 × 세션 유형의 조합 → 결정 테이블 테스팅

---

**문제 50 (K3)**
자동차 통신 테스팅에서 탐색적 테스팅(Exploratory Testing)이 유용한 경우는?

a) 모든 UDS 서비스를 체계적으로 테스트할 때
b) ASIL D 기능의 MC/DC 커버리지를 달성할 때
c) 명세에 없는 예상치 못한 ECU 동작을 발견할 때
d) 회귀 테스팅을 자동화할 때

**정답: c)**
탐색적 테스팅은 명세에 없는 동작, 예상치 못한 결함을 발견하는데 효과적입니다.

---

## 정답 요약

| 번호 | 정답 | 번호 | 정답 | 번호 | 정답 | 번호 | 정답 | 번호 | 정답 |
|------|------|------|------|------|------|------|------|------|------|
| 1 | b | 11 | b | 21 | c | 31 | b | 41 | b |
| 2 | a | 12 | b | 22 | b | 32 | b | 42 | b |
| 3 | c | 13 | c | 23 | b | 33 | c | 43 | c |
| 4 | b | 14 | c | 24 | b | 34 | b | 44 | c |
| 5 | c | 15 | c | 25 | c | 35 | c | 45 | b |
| 6 | b | 16 | b | 26 | b | 36 | c | 46 | b |
| 7 | b | 17 | c | 27 | b | 37 | c | 47 | c |
| 8 | b | 18 | c | 28 | c | 38 | b | 48 | b |
| 9 | b | 19 | c | 29 | b | 39 | a | 49 | b |
| 10 | b | 20 | c | 30 | b | 40 | b | 50 | c |

---

# CT-AuT 빠른 참조 카드

## 핵심 서비스 암기

```
0x10 세션 전환      0x11 ECU 리셋
0x14 DTC 삭제       0x19 DTC 읽기
0x22 DID 읽기       0x27 보안 접근
0x2E DID 쓰기       0x31 루틴 제어
0x34 다운로드 요청  0x36 데이터 전송
0x3E TesterPresent
```

## NRC 암기

```
0x10 generalReject
0x11 serviceNotSupported
0x12 subFunctionNotSupported
0x13 incorrectMessageLength
0x22 conditionsNotCorrect
0x24 requestSequenceError
0x31 requestOutOfRange
0x33 securityAccessDenied
0x35 invalidKey
```

## ASIL vs 커버리지

```
ASIL A → 구문 커버리지
ASIL B → 분기 커버리지
ASIL C/D → MC/DC 커버리지
```

## UDS 플래시 순서

```
1. 0x10 02 (Programming 세션)
2. 0x27 XX (SecurityAccess)
3. 0x34 (RequestDownload)
4. 0x36 (TransferData) × N
5. 0x37 (RequestTransferExit)
6. 0x11 (ECUReset)
```

## 테스트 환경 비교

```
MIL: 모델 레벨 시뮬레이션
SIL: 소프트웨어만 시뮬레이션
HIL: 실제 ECU + 시뮬레이션 환경
실차: 실제 차량
```

## 수환씨 강점 → 시험 활용

```
UDS/DoIP 5년+ → Chapter 5 만점 목표
IVI QA → Chapter 1, 6 강점
JLR DoIP → DoIP 테스팅 문제 강점
UN R156 경험 → 안전/규제 문제 강점
```

---

*CTFL 학습 후 이 자료로 CT-AuT 준비하세요. CTFL 개념(EP, BVA, 상태전이 등)이 그대로 활용됩니다.*
*마지막 업데이트: 2026-06-18*
