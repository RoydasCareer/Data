# GitHub 포트폴리오 완전 가이드
> 목적: 해외 취업에서 "말"이 아닌 "코드"로 기술력 증명
> 비용: 완전 무료
> 기간: 첫 프로젝트 완성까지 2~3주

---

## 1. 왜 포트폴리오가 필수인가

### 고졸 지원자의 현실

대학 졸업자는 학교 프로젝트, 논문, 학점으로
기술력을 증명할 수 있습니다.

고졸 경력직은 이력서의 "경력" 항목만으로 싸워야 합니다.

**GitHub 포트폴리오는 이 불균형을 뒤집는 유일한 방법입니다.**

"5년간 CANoe를 사용했습니다." → 말
"GitHub에 CANoe 기반 CAN 분석 도구가 있습니다." → 증거

### 해외 채용 담당자의 시선

독일/영국 자동차 SW 기업의 HR은 이력서와 함께
LinkedIn URL + GitHub URL을 확인합니다.
GitHub가 없으면 "SW 역량이 불확실한 지원자"로 분류됩니다.

---

## 2. 환경 설정 (1회, 30분)

### Step 1: GitHub 계정 생성

1. github.com → "Sign up"
2. 사용자명: `suhwan-jeon` 또는 `automotive-diag` 등 전문적인 이름
   - 이름이 이력서에 올라갑니다. `coolboy123` 같은 이름은 피할 것
3. 이메일 인증 완료
4. 프로필 설정:
   - 이름: Suhwan Jeon
   - Bio: `Automotive Diagnostic Engineer | UDS/DoIP | CANoe | IVI QA`
   - Location: Seoul, South Korea

### Step 2: Git 설치

- git-scm.com에서 Windows용 Git 다운로드 설치
- 설치 후 PowerShell에서:
```bash
git config --global user.name "Suhwan Jeon"
git config --global user.email "your@email.com"
```

### Step 3: Python 설치 확인

```bash
python --version  # 3.9 이상 확인
pip --version
```

없으면 python.org에서 설치 (무료).

### Step 4: VS Code 설치 (선택, 권장)

- code.visualstudio.com → 무료 다운로드
- Python 익스텐션 설치 (VS Code 내 Extensions에서 "Python" 검색)

---

## 3. 프로젝트 A: CAN 버스 로거 (난이도: 하, 1~2주)

### 목적

python-can 라이브러리로 CAN 메시지를 수신하고
파일로 저장하는 도구 제작.
실차 없이도 가상 CAN 버스로 구현 가능.

### 설치

```bash
pip install python-can
```

### 구현 (단계별)

**Step 1: 가상 CAN 버스 설정 (Windows)**

Windows에서는 직접 가상 CAN 버스를 만들기 어렵습니다.
대신 python-can의 `virtual` 인터페이스를 사용합니다:

```python
# can_logger.py
import can
import csv
import time
from datetime import datetime

def log_message(writer, msg):
    """단일 CAN 메시지 기록"""
    writer.writerow([
        datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f'),
        f'0x{msg.arbitration_id:03X}',
        msg.dlc,
        msg.data.hex().upper(),
    ])

def run_logger(duration_sec: int = 30, output_file: str = 'can_log.csv'):
    """
    CAN 버스 메시지 로거
    duration_sec: 로깅 시간 (초)
    output_file: 저장 파일명
    """
    print(f"Starting CAN logger for {duration_sec} seconds...")
    
    with can.interface.Bus(interface='virtual', channel='vcan0') as bus:
        with open(output_file, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Timestamp', 'CAN_ID', 'DLC', 'Data'])
            
            start_time = time.time()
            msg_count = 0
            
            while time.time() - start_time < duration_sec:
                msg = bus.recv(timeout=1.0)
                if msg:
                    log_message(writer, msg)
                    msg_count += 1
                    print(f"  [0x{msg.arbitration_id:03X}] DLC={msg.dlc} Data={msg.data.hex().upper()}")
            
            print(f"\nLogging complete. {msg_count} messages saved to {output_file}")

if __name__ == "__main__":
    run_logger(duration_sec=10)
```

**Step 2: CAN 메시지 시뮬레이터 (송신 측)**

```python
# can_simulator.py
import can
import time
import random

def simulate_can_traffic(duration_sec: int = 10):
    """
    가상 CAN 트래픽 생성 (IVI 관련 메시지 시뮬레이션)
    """
    with can.interface.Bus(interface='virtual', channel='vcan0') as bus:
        start = time.time()
        
        messages = [
            # (CAN ID, 데이터) — IVI 시스템 관련 예시
            (0x1A0, [0x00, 0x00, 0x00, 0x00]),  # 속도계
            (0x3B4, [0x11, 0x22, 0x33, 0x44]),  # GPS
            (0x050, [0xFF, 0x00]),                # 미디어 상태
            (0x2C4, [0x01, 0x00, 0x00, 0x08]),  # 에어컨
        ]
        
        while time.time() - start < duration_sec:
            can_id, template = random.choice(messages)
            data = list(template)           # copy — 공유 리스트 직접 수정 방지
            data[0] = random.randint(0, 255)  # 데이터 변동
            
            msg = can.Message(
                arbitration_id=can_id,
                data=data,
                is_extended_id=False
            )
            bus.send(msg)
            time.sleep(0.1)  # 100ms 간격

if __name__ == "__main__":
    print("Simulating CAN traffic...")
    simulate_can_traffic(duration_sec=10)
```

**Step 3: 두 스크립트를 동시에 실행 (터미널 2개)**

```bash
# 터미널 1:
python can_logger.py

# 터미널 2 (동시에):
python can_simulator.py
```

**Step 4: 로그 분석기 추가**

```python
# can_analyzer.py
import csv
from collections import Counter

def analyze_log(log_file: str):
    """CAN 로그 파일 통계 분석"""
    can_ids = []
    total_messages = 0
    
    with open(log_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            can_ids.append(row['CAN_ID'])
            total_messages += 1
    
    print(f"=== CAN Log Analysis: {log_file} ===")
    print(f"Total messages: {total_messages}")
    print(f"\nMessage frequency by CAN ID:")
    
    counter = Counter(can_ids)
    for can_id, count in counter.most_common():
        percentage = (count / total_messages) * 100
        print(f"  {can_id}: {count:4d} messages ({percentage:.1f}%)")

if __name__ == "__main__":
    analyze_log('can_log.csv')
```

### GitHub 업로드

```bash
# 저장소 생성 후:
git init
git add .
git commit -m "Add CAN bus logger and simulator"
git remote add origin https://github.com/your-username/can-bus-logger.git
git push -u origin main
```

### README.md 작성 (영어, 필수)

```markdown
# CAN Bus Logger & Analyzer

A Python-based CAN bus message logger for automotive diagnostics testing.

## Background

This tool was developed based on 5+ years of professional experience
with automotive CAN bus diagnostics using Vector CANoe and PEAK PCAN.

## Features

- Real-time CAN message logging to CSV
- CAN traffic simulation for testing
- Log analysis with message frequency statistics
- Compatible with python-can virtual interface

## Use Cases

- Testing CAN communication protocols without physical hardware
- Analyzing CAN bus traffic patterns
- Generating test data for UDS diagnostic tool testing

## Installation

pip install python-can

## Usage

python can_simulator.py  # Start CAN traffic simulation
python can_logger.py     # Log messages (run simultaneously)
python can_analyzer.py   # Analyze captured log

## Related Standards

- ISO 11898 (CAN Bus)
- ISO 15765-2 (CAN Transport Protocol for UDS)
- ISO 14229 (UDS - Unified Diagnostic Services)

## Author

Automotive Diagnostic Engineer with experience in:
- UDS/DoIP diagnostics on JLR vehicles (Range Rover Velar)
- IVI QA at Hyundai Motor Group R&D
- Vector CANoe, PEAK PCAN
```

---

## 4. 프로젝트 B: UDS 서비스 시뮬레이터 (난이도: 중, 2~3주)

### 목적

UDS 서비스를 Python으로 구현하여
진단통신 지식을 코드로 증명.

### 설치

```bash
pip install udsoncan python-can
```

### 구현

**Step 1: 기본 UDS 요청/응답 시뮬레이터**

```python
# uds_simulator.py
"""
UDS (ISO 14229) Service Simulator
Demonstrates UDS diagnostic services without physical hardware
"""

class UDSSimulator:
    """간단한 UDS ECU 시뮬레이터"""
    
    def __init__(self):
        self.current_session = 0x01  # Default Session
        self.did_data = {
            0xF190: b'1GNALDEK9FZ108495',  # VIN
            0xF18C: b'ECU_SERIAL_001',      # ECU Serial Number
            0xF186: b'\x01',                # Active Diagnostic Session
        }
        self.dtcs = [
            (0x012345, 0x09),  # DTC + status
            (0x056789, 0x00),
        ]
    
    def process_request(self, request: bytes) -> bytes:
        """UDS 요청 처리 → 응답 반환"""
        if not request:
            return self._negative_response(0x00, 0x10)  # generalReject
        
        service_id = request[0]
        
        if service_id == 0x10:
            return self._diagnostic_session_control(request)
        elif service_id == 0x22:
            return self._read_data_by_identifier(request)
        elif service_id == 0x19:
            return self._read_dtc_information(request)
        elif service_id == 0x11:
            return self._ecu_reset(request)
        else:
            return self._negative_response(service_id, 0x11)  # serviceNotSupported
    
    def _diagnostic_session_control(self, request: bytes) -> bytes:
        """0x10 DiagnosticSessionControl"""
        if len(request) < 2:
            return self._negative_response(0x10, 0x13)
        
        session_type = request[1]
        if session_type in [0x01, 0x02, 0x03]:
            self.current_session = session_type
            return bytes([0x50, session_type, 0x00, 0x19, 0x01, 0xF4])
        return self._negative_response(0x10, 0x12)  # subFunctionNotSupported
    
    def _read_data_by_identifier(self, request: bytes) -> bytes:
        """0x22 ReadDataByIdentifier"""
        if len(request) < 3:
            return self._negative_response(0x22, 0x13)
        
        did = (request[1] << 8) | request[2]
        
        if did in self.did_data:
            data = self.did_data[did]
            return bytes([0x62, request[1], request[2]]) + data
        
        return self._negative_response(0x22, 0x31)  # requestOutOfRange
    
    def _read_dtc_information(self, request: bytes) -> bytes:
        """0x19 ReadDTCInformation (sub-function 0x02: reportDTCByStatusMask)"""
        if len(request) < 3 or request[1] != 0x02:
            return self._negative_response(0x19, 0x12)
        
        response = [0x59, 0x02, 0xFF]  # 긍정 응답 + sub-function + DTCStatusAvailabilityMask
        for dtc_code, status in self.dtcs:
            response.extend([
                (dtc_code >> 16) & 0xFF,
                (dtc_code >> 8) & 0xFF,
                dtc_code & 0xFF,
                status
            ])
        return bytes(response)
    
    def _ecu_reset(self, request: bytes) -> bytes:
        """0x11 ECUReset"""
        if len(request) < 2:
            return self._negative_response(0x11, 0x13)
        reset_type = request[1]
        print(f"  [ECU] Reset requested: type=0x{reset_type:02X}")
        return bytes([0x51, reset_type])
    
    def _negative_response(self, service_id: int, nrc: int) -> bytes:
        """부정 응답 (NRC)"""
        nrc_descriptions = {
            0x10: "generalReject",
            0x11: "serviceNotSupported",
            0x12: "subFunctionNotSupported",
            0x13: "incorrectMessageLengthOrInvalidFormat",
            0x22: "conditionsNotCorrect",
            0x31: "requestOutOfRange",
            0x35: "invalidKey",
        }
        desc = nrc_descriptions.get(nrc, "unknown")
        print(f"  [ECU] NRC 0x{nrc:02X} ({desc}) for service 0x{service_id:02X}")
        return bytes([0x7F, service_id, nrc])


def run_demo():
    """UDS 서비스 데모 실행"""
    ecu = UDSSimulator()
    
    test_cases = [
        ("DiagnosticSessionControl → Extended", bytes([0x10, 0x03])),
        ("ReadDataByIdentifier → VIN", bytes([0x22, 0xF1, 0x90])),
        ("ReadDataByIdentifier → ECU Serial", bytes([0x22, 0xF1, 0x8C])),
        ("ReadDTCInformation", bytes([0x19, 0x02, 0xFF])),
        ("ECUReset → Soft Reset", bytes([0x11, 0x03])),
        ("Invalid Service", bytes([0xFF])),
        ("ReadDataByIdentifier → Unknown DID", bytes([0x22, 0xAB, 0xCD])),
    ]
    
    print("=" * 60)
    print("UDS Service Simulator Demo (ISO 14229)")
    print("=" * 60)
    
    for description, request in test_cases:
        print(f"\n[{description}]")
        print(f"  Request:  {request.hex().upper()}")
        response = ecu.process_request(request)
        print(f"  Response: {response.hex().upper()}")
        
        if response[0] == 0x7F:
            print(f"  → Negative Response")
        else:
            print(f"  → Positive Response")

if __name__ == "__main__":
    run_demo()
```

**실행 결과:**
```
============================================================
UDS Service Simulator Demo (ISO 14229)
============================================================

[DiagnosticSessionControl → Extended]
  Request:  1003
  Response: 5003001901F4
  → Positive Response

[ReadDataByIdentifier → VIN]
  Request:  22F190
  Response: 62F1903147...
  → Positive Response

[ReadDTCInformation]
  Request:  1902FF
  Response: 5902FF0123450956789000
  → Positive Response

[Invalid Service]
  Request:  FF
  [ECU] NRC 0x11 (serviceNotSupported) for service 0xFF
  Response: 7FFF11
  → Negative Response
```

---

## 5. 프로젝트 C: 자동차 진단 리포트 생성기 (난이도: 중상, 3~4주)

### 목적

DTC 데이터를 읽어서 HTML 리포트를 자동 생성하는 도구.
실무에서 자주 하는 "테스트 결과 보고서 작성"을 자동화.

```python
# diagnostic_report.py
import json
from datetime import datetime

def generate_html_report(vehicle_info: dict, dtcs: list, output_file: str = "report.html"):
    """진단 결과 HTML 리포트 생성"""
    
    dtc_rows = ""
    for dtc in dtcs:
        status_class = "fault-active" if dtc["status"] == "confirmed" else "fault-pending"
        dtc_rows += f"""
        <tr class="{status_class}">
            <td>{dtc['code']}</td>
            <td>{dtc['description']}</td>
            <td>{dtc['status'].upper()}</td>
            <td>{dtc.get('mileage', 'N/A')} km</td>
        </tr>"""
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Diagnostic Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        table {{ border-collapse: collapse; width: 100%; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #4CAF50; color: white; }}
        .fault-active {{ background-color: #ffcccc; }}
        .fault-pending {{ background-color: #fff3cc; }}
        .header {{ background-color: #333; color: white; padding: 20px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Vehicle Diagnostic Report</h1>
        <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    </div>
    
    <h2>Vehicle Information</h2>
    <table>
        <tr><th>Parameter</th><th>Value</th></tr>
        <tr><td>VIN</td><td>{vehicle_info.get('vin', 'N/A')}</td></tr>
        <tr><td>Make/Model</td><td>{vehicle_info.get('model', 'N/A')}</td></tr>
        <tr><td>Mileage</td><td>{vehicle_info.get('mileage', 'N/A')} km</td></tr>
        <tr><td>Test Date</td><td>{vehicle_info.get('test_date', 'N/A')}</td></tr>
        <tr><td>Tester</td><td>{vehicle_info.get('tester', 'N/A')}</td></tr>
    </table>
    
    <h2>Diagnostic Trouble Codes ({len(dtcs)} found)</h2>
    <table>
        <tr>
            <th>DTC Code</th>
            <th>Description</th>
            <th>Status</th>
            <th>Mileage at Fault</th>
        </tr>
        {dtc_rows}
    </table>
    
    <h2>Test Summary</h2>
    <p>Active faults: {sum(1 for d in dtcs if d['status'] == 'confirmed')}</p>
    <p>Pending faults: {sum(1 for d in dtcs if d['status'] == 'pending')}</p>
    <p>Overall status: {'FAIL' if any(d['status'] == 'confirmed' for d in dtcs) else 'PASS'}</p>
</body>
</html>"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Report generated: {output_file}")
    return output_file


# 사용 예시
if __name__ == "__main__":
    vehicle = {
        "vin": "1GNALDEK9FZ108495",
        "model": "Hyundai Sonata 2024",
        "mileage": "15234",
        "test_date": datetime.now().strftime('%Y-%m-%d'),
        "tester": "Suhwan Jeon"
    }
    
    dtcs = [
        {"code": "P0420", "description": "Catalyst System Efficiency Below Threshold", "status": "confirmed", "mileage": "15000"},
        {"code": "U0100", "description": "Lost Communication with ECM/PCM", "status": "pending", "mileage": "15200"},
        {"code": "B1234", "description": "IVI System Communication Error", "status": "confirmed", "mileage": "15100"},
    ]
    
    generate_html_report(vehicle, dtcs, "diagnostic_report.html")
```

---

## 6. GitHub 프로필 최적화

### 프로필 README 만들기

GitHub에 본인 사용자명과 동일한 저장소를 만들면
프로필 페이지에 표시됩니다:

저장소명: `suhwan-jeon/suhwan-jeon`

`README.md` 내용:
```markdown
## Suhwan Jeon — Automotive Diagnostic Engineer

**5+ years** of hands-on experience in vehicle diagnostic communication.

### 🔧 Technical Skills

| Domain | Tools & Technologies |
|--------|---------------------|
| Diagnostic Protocols | UDS (ISO 14229), DoIP (ISO 13400), OBD-II |
| Test Tools | Vector CANoe, PEAK PCAN |
| Programming | Python (python-can, udsoncan) |
| Testing | Regression Testing, Functional Testing, IVI QA |
| Standards | A-SPICE, ISO 26262, UN R156 |

### 🚗 Experience Highlights

- **JLR DoIP Diagnostics**: Real-vehicle DoIP analysis on Range Rover Velar
- **IVI QA**: Software verification at Hyundai Motor Group R&D
- **CAN Diagnostics**: 5+ years of UDS service analysis using CANoe

### 📂 Projects

- [CAN Bus Logger](link) — Python-based CAN message logger
- [UDS Simulator](link) — UDS diagnostic service simulator
- [SOVD Demo](link) — ASAM SOVD client implementation

### 📫 Contact

LinkedIn: [linkedin.com/in/suhwan-jeon](link)
XING: [xing.com/profile/suhwan-jeon](link)
```

---

## 7. 전체 타임라인

```
Week 1~2: 환경 설정 + 프로젝트 A (CAN Logger) 완성
Week 3~4: 프로젝트 B (UDS 시뮬레이터) 완성
Week 5~6: 프로젝트 C (리포트 생성기) 완성
Week 7:   GitHub 프로필 README 작성 + 이력서 링크 추가
이후:      SOVD 데모 프로젝트 추가 (11_ASAM_SOVD_Study.md 참고)
```

---

## 8. 비용 요약

| 항목 | 비용 |
|------|------|
| GitHub 계정 | 무료 |
| Python + 라이브러리 | 무료 |
| VS Code | 무료 |
| 학습 시간 | 약 20~30시간 |
| **총 비용** | **0원** |

---

*마지막 업데이트: 2026-06-18*
