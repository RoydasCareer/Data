# ASAM SOVD 학습 완전 가이드
> Service-Oriented Vehicle Diagnostics
> 비용: 무료 (기본 사양 + 학습 자료 전부 무료)
> 기간: 4~6주 (CTFL/CT-AuT 공부와 병행 가능)

---

## 1. SOVD가 무엇이고 왜 배워야 하는가

### 자동차 진단 기술의 진화

```
1990s~2000s: OBD-II (CAN 기반)
          ↓
2000s~현재: UDS/ISO 14229 on CAN     ← 당신의 핵심 전문 영역
          ↓
2010s~현재: DoIP/ISO 13400 (Ethernet) ← JLR 프로젝트 경험
          ↓
2020s~미래: ASAM SOVD                 ← 지금 배워야 할 것
```

### SOVD란

Service-Oriented Vehicle Diagnostics.
UDS의 개념을 유지하면서 **HTTP/REST API** 방식으로 구현하는 새로운 진단 표준.

| 구분 | 기존 UDS/DoIP | SOVD |
|------|--------------|------|
| 통신 방식 | 바이너리 프로토콜 | HTTP REST API |
| 데이터 형식 | 바이너리 (HEX) | JSON (텍스트) |
| 인터페이스 | 독점적 진단 툴 | 웹 브라우저도 가능 |
| 표준 기관 | ISO | ASAM |
| 주요 기술 | CAN, DoIP, UDS | HTTP, OpenAPI, JSON |
| 현재 상태 | 현용 주류 | 도입 초기, 빠르게 확산 |

### 도입 현황

- **BMW**: SOVD 기반 진단 시스템 개발 중 (공식 발표)
- **VW/CARIAD**: SOVD 지원 계획
- **Mercedes**: 소프트웨어 정의 차량(SDV)에 SOVD 포함
- **Tier1 공급업체**: Continental, Bosch, ZF 대응 개발 중

### 당신에게 유리한 이유

DoIP 경험자가 SOVD를 배우는 것은,
CAN 경험자가 DoIP를 배운 것보다 훨씬 쉽습니다.
물리 레이어(Ethernet), 진단 개념(UDS 서비스)이 동일하고
프로토콜 형식만 HTTP/JSON으로 바뀌기 때문입니다.

---

## 2. SOVD 핵심 개념 이해

### 2.1 아키텍처

```
진단 클라이언트 (Tool)
        ↓ HTTP Request (GET/POST/DELETE)
SOVD Server (차량 내 Gateway 또는 ECU)
        ↓ 내부 라우팅
개별 ECU들
```

기존 DoIP 아키텍처와 비교:
```
DoIP Client → DoIP Gateway → ECU  (바이너리)
SOVD Client → SOVD Server → ECU   (HTTP/JSON)
```

### 2.2 SOVD 핵심 리소스 (URL 구조)

SOVD는 REST API 방식으로 차량 기능에 접근합니다:

| SOVD 리소스 | 기존 UDS 대응 | HTTP 메서드 |
|------------|-------------|-------------|
| `/components` | ECU 목록 | GET |
| `/components/{id}/data` | ReadDataByIdentifier (0x22) | GET |
| `/components/{id}/faults` | ReadDTCInformation (0x19) | GET |
| `/components/{id}/operations` | RoutineControl (0x31) | POST |
| `/components/{id}/updates` | 플래시 프로그래밍 (0x34~0x37) | POST |
| `/sessions` | DiagnosticSessionControl (0x10) | GET/POST |

### 2.3 JSON 예시 — UDS와 비교

**기존 UDS (바이너리 HEX):**
```
Request:  22 F1 90        (ReadDataByIdentifier, DID 0xF190)
Response: 62 F1 90 31 47 4E 41 ...  (긍정 응답 + 데이터)
```

**SOVD (HTTP/JSON):**
```
GET /api/v1/components/engine-ecu/data/VehicleIdentificationNumber

Response:
{
  "did": "VehicleIdentificationNumber",
  "value": "1GNALDEK9FZ108495",
  "dataType": "string",
  "unit": null
}
```

→ 사람이 읽기 쉽고, 웹 개발 도구를 그대로 활용 가능합니다.

### 2.4 OpenAPI 사양

SOVD는 OpenAPI(Swagger) 형식으로 API를 정의합니다.
즉, 웹 브라우저에서 Swagger UI를 통해 진단 명령을 실행할 수 있습니다.

---

## 3. 무료 자료 입수 방법

### Step 1: ASAM 무료 회원 가입 (즉시, 10분)

1. asam.net 접속
2. 상단 "Become a Member" 클릭
3. "Subscriber" 선택 (무료)
4. 이메일 + 기본 정보 입력
5. 이메일 인증 완료

→ 무료 회원으로 SOVD Overview 문서, 웨비나 자료 접근 가능

### Step 2: ASAM 공식 문서 다운로드

ASAM 로그인 후:
- "Standards" → "SOVD" 검색
- "ASAM SOVD Overview" PDF 다운로드 (무료)
- "ASAM SOVD Use Cases" 문서 다운로드 (무료)

전체 사양서(Full Specification)는 유료이지만,
학습 목적으로는 Overview + Use Cases로 충분합니다.

### Step 3: ASAM 공식 YouTube 채널

- YouTube 검색: "ASAM SOVD"
- ASAM 공식 채널의 웨비나 영상 무료 시청
- "SOVD Introduction" 영상: ASAM이 직접 설명하는 30~60분 영상

### Step 4: GitHub 참조 구현체

GitHub에서 "SOVD" 검색:
- asam-ev/SOVD 관련 저장소 확인
- Python/Java 구현체 코드 분석
- README 읽기만으로도 구조 파악 가능

---

## 4. 6주 학습 계획

### 전제: HTTP/REST 기초 지식 없어도 됨

SOVD는 웹 API 방식이지만,
학습 시작 전에 HTTP 기초를 1주일만 공부하면 충분합니다.

---

### Week 1: HTTP/REST 기초 (완전 무료)

**목표:** SOVD를 이해하기 위한 웹 기술 기초

**공부할 것:**
1. HTTP 기초 개념:
   - GET, POST, DELETE 메서드가 무엇인지
   - URL 구조: `https://server/api/resource`
   - HTTP 상태 코드: 200(성공), 404(없음), 401(인증 필요)

2. JSON 형식 이해:
   ```json
   {
     "key": "value",
     "number": 42,
     "array": [1, 2, 3]
   }
   ```

3. REST API 개념: URL로 자원에 접근하는 방식

**무료 자료:**
- MDN Web Docs: "HTTP overview" (developer.mozilla.org) → 무료
- "REST API concepts" YouTube 검색 → 10분 영상 1개
- JSONLint (jsonlint.com): JSON 형식 연습 도구

**시간:** 하루 30분 × 5일 = 2.5시간 총 투자

---

### Week 2: SOVD 개요 이해

**목표:** SOVD가 UDS/DoIP와 어떻게 다른지 이해

**공부할 것:**
1. ASAM SOVD Overview 문서 1회 정독 (PDF 20~40페이지)
2. ASAM YouTube 웨비나 "SOVD Introduction" 시청
3. UDS 서비스 → SOVD 리소스 매핑표 만들기 (직접 노트 작성)

**노트 작성 예시:**
```
UDS 0x22 ReadDataByIdentifier
→ SOVD: GET /components/{id}/data/{did}

UDS 0x19 ReadDTCInformation
→ SOVD: GET /components/{id}/faults

UDS 0x10 DiagnosticSessionControl
→ SOVD: GET/POST /sessions
```

**시간:** 하루 45분 × 5일

---

### Week 3: SOVD 아키텍처 심화

**목표:** SOVD Server와 Client의 동작 방식 이해

**공부할 것:**
1. SOVD Server 역할: 차량 내 HTTP 서버 역할
2. Authentication: 진단 도구가 어떻게 권한을 얻는지
3. SOVD와 ISO 13400(DoIP) 공존 방식
4. OpenAPI 문서 구조 이해

**실습:**
- Swagger Editor (editor.swagger.io) 무료 접속
- 간단한 SOVD API 명세 YAML 작성해보기:
```yaml
openapi: 3.0.0
info:
  title: SOVD Demo
paths:
  /components/{id}/data/{did}:
    get:
      summary: Read data identifier
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: did
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful
```

**시간:** 하루 45분 × 5일

---

### Week 4: Use Cases 분석

**목표:** 실제 차량에서 SOVD가 어떻게 사용되는지 이해

**공부할 것:**
1. ASAM SOVD Use Cases 문서 정독
2. OTA 업데이트와 SOVD 연관성 (UN R156 연결)
3. 원격 진단(Remote Diagnostics)에서 SOVD 활용
4. 기존 UDS 기반 시스템과의 마이그레이션 전략

**시간:** 하루 30분 × 5일

---

### Week 5: 실습 — Python으로 SOVD 클라이언트 만들기

**목표:** 간단한 SOVD 클라이언트 코드 작성 → GitHub 포트폴리오

**환경 설정:**
```bash
pip install requests          # HTTP 요청
pip install fastapi uvicorn   # 로컬 SOVD 서버 시뮬레이션
```

**Step 1: 로컬 SOVD 서버 시뮬레이터 (FastAPI)**

```python
# sovd_server_sim.py
from fastapi import FastAPI

app = FastAPI(title="SOVD Simulator")

fake_db = {
    "VehicleIdentificationNumber": "1GNALDEK9FZ108495",
    "OdometerMasterValue": "15234",
}

@app.get("/components/{component_id}/data/{did}")
def read_data(component_id: str, did: str):
    value = fake_db.get(did, "N/A")
    return {
        "component": component_id,
        "did": did,
        "value": value,
        "dataType": "string"
    }

@app.get("/components/{component_id}/faults")
def read_faults(component_id: str):
    return {
        "component": component_id,
        "faults": [
            {"dtc": "P0420", "status": "confirmed", "description": "Catalyst efficiency below threshold"},
            {"dtc": "U0100", "status": "pending", "description": "Lost communication with ECM"}
        ]
    }
```

**실행:**
```bash
uvicorn sovd_server_sim:app --reload
# 브라우저에서 http://localhost:8000/docs 접속
# Swagger UI로 직접 API 테스트 가능
```

**Step 2: SOVD 클라이언트**

```python
# sovd_client.py
import requests

BASE_URL = "http://localhost:8000"

def read_did(component_id: str, did: str):
    """UDS 0x22와 동일한 역할"""
    response = requests.get(f"{BASE_URL}/components/{component_id}/data/{did}")
    if response.status_code == 200:
        data = response.json()
        print(f"[{did}] = {data['value']}")
        return data
    print(f"Error: {response.status_code}")
    return None

def read_faults(component_id: str):
    """UDS 0x19와 동일한 역할"""
    response = requests.get(f"{BASE_URL}/components/{component_id}/faults")
    if response.status_code == 200:
        faults = response.json()["faults"]
        print(f"\nActive faults for {component_id}:")
        for fault in faults:
            print(f"  {fault['dtc']}: {fault['description']} [{fault['status']}]")
        return faults
    return None

if __name__ == "__main__":
    print("=== SOVD Client Demo ===")
    read_did("engine-ecu", "VehicleIdentificationNumber")
    read_did("engine-ecu", "OdometerMasterValue")
    read_faults("engine-ecu")
```

**출력 예시:**
```
=== SOVD Client Demo ===
[VehicleIdentificationNumber] = 1GNALDEK9FZ108495
[OdometerMasterValue] = 15234

Active faults for engine-ecu:
  P0420: Catalyst efficiency below threshold [confirmed]
  U0100: Lost communication with ECM [pending]
```

---

### Week 6: GitHub 공개 + 이력서 반영

**목표:** 포트폴리오 완성

**작업:**
1. GitHub 저장소 생성: `sovd-client-demo`
2. README.md 영어로 작성:

```markdown
# SOVD Client Demo

A demonstration of ASAM SOVD (Service-Oriented Vehicle Diagnostics) 
client implementation, showing how SOVD compares to traditional 
UDS (ISO 14229) diagnostics.

## Background

This project was created to explore SOVD as the successor to 
DoIP/UDS-based vehicle diagnostics. The author has 5+ years of 
experience with UDS/DoIP diagnostics using CANoe on production vehicles.

## Features

- SOVD server simulator (FastAPI)
- SOVD client with DID read and fault retrieval
- UDS-to-SOVD mapping documentation

## UDS vs SOVD Comparison

| UDS Service | SOVD Equivalent |
|-------------|-----------------|
| 0x22 ReadDataByIdentifier | GET /components/{id}/data/{did} |
| 0x19 ReadDTCInformation | GET /components/{id}/faults |
| 0x10 DiagnosticSessionControl | POST /sessions |

## Installation

pip install requests fastapi uvicorn
python sovd_server_sim.py &
python sovd_client.py
```

3. 이력서 Skills 섹션에 추가:
```
Technical Skills: UDS (ISO 14229), DoIP (ISO 13400), ASAM SOVD (self-study),
                  CANoe, PCAN, CAN Bus, Automotive Ethernet
```

---

## 5. 비용 요약

| 항목 | 비용 |
|------|------|
| ASAM 무료 회원 | 무료 |
| SOVD 문서 | 무료 |
| Python 라이브러리 | 무료 |
| 학습 시간 | 약 15~20시간 (6주) |
| **총 비용** | **0원** |

---

*마지막 업데이트: 2026-06-18*
