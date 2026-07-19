# 영어 인터뷰 준비 완전 가이드
> 목적: 서류 통과 후 인터뷰에서 합격하기
> 대상: 자동차 SW 검증 / A-SPICE / ISO 26262 관련 포지션

---

## 1. 해외 채용 인터뷰 구조

대부분의 글로벌 기업은 2~4 라운드로 구성:

```
Round 1: HR Screening (전화/화상, 20~30분)
    → 기본 영어 소통, 경력 확인, 연봉 기대치, 비자 상황

Round 2: Technical Interview (화상, 45~60분)
    → 도메인 기술 지식, 실무 경험 심화

Round 3: Behavioral Interview (화상, 45~60분)
    → STAR 방식 경험 질문, 팀 협업, 문제 해결

Round 4: Final / Manager Interview (화상 또는 대면)
    → 팀 문화 적합도, 커리어 비전
```

---

## 2. STAR 기법 — 가장 중요한 인터뷰 스킬

### STAR이란?

행동 질문(Behavioral Question)에 답하는 구조화된 방법.

```
S (Situation) — 상황: 어떤 맥락이었는지
T (Task)      — 과제: 당신이 해야 했던 것
A (Action)    — 행동: 당신이 실제로 한 것
R (Result)    — 결과: 어떻게 끝났는지 (수치 포함)
```

### 나쁜 답변 예시

> Q: Tell me about a time you faced a difficult technical problem.
> A: I had many problems in my job and I always solved them. I am a problem solver.

→ 구체성 없음, 기억에 남지 않음.

### 좋은 답변 예시

> Q: Tell me about a time you faced a difficult technical problem.
>
> A: "During my time at EasyDES, I was assigned to lead a DoIP diagnostic project for Jaguar Land Rover vehicles — something our team had never done before.
>
> The challenge was that our existing tools were designed for CAN-based UDS diagnostics, not Ethernet-based DoIP communication. We didn't have documentation for the DoIP stack configuration specific to JLR vehicles.
>
> So I started by setting up the Ethernet environment from scratch — configuring the cables, IP addressing, and diagnostic tool DoIP settings through trial and error, referencing ISO 13400 alongside JLR's technical documentation. Once the basic communication worked, I systematically mapped the DoIP communication behavior and eventually extended the implementation so that our UDS-based diagnostic functions could also work over the DoIP connection.
>
> As a result, we delivered the DoIP analysis on schedule and successfully expanded our product capability to support Ethernet-connected vehicles. It also became a reusable foundation for future JLR projects."

→ 구체적인 기술명, 행동의 논리, 결과가 명확함.

---

## 3. 당신의 STAR 스크립트 6개 준비

다음 6가지 경험을 영어 STAR 형식으로 미리 작성해두세요.

### 스크립트 1: 가장 어려운 기술적 문제

**경험 소재:** DoIP 환경 구축 (위 예시 참고)

### 스크립트 2: 팀워크 / 협업

**경험 소재:** 베트남 개발팀과의 협업 경험

초안:
> "At FPT Korea, I work closely with a Vietnamese development team... The main challenge was... I addressed this by... As a result..."

포인트:
- 시차/언어 장벽을 어떻게 극복했는지
- 구체적인 커뮤니케이션 방법
- 업무 결과

### 스크립트 3: 데드라인 압박 상황

**경험 소재:** 이지디에스에서 출장 차량 확보 일정 압박

### 스크립트 4: 본인이 주도한 개선

**경험 소재:** UDS 시뮬레이터 개발 (직접 제안해서 만든 것이면 더 좋음)

### 스크립트 5: 실패 경험 및 교훈

**경험 소재:** 번아웃 후 호주 워킹홀리데이 → 무엇을 배웠는가

포인트: 실패를 인정하되, 그것에서 배운 것과 이후 어떻게 달라졌는지에 집중.

### 스크립트 6: 새로운 기술/도구를 빠르게 습득한 경험

**경험 소재:** DoIP는 새로운 기술, 처음 배우고 적용한 과정

---

## 4. 기술 인터뷰 예상 질문 및 모범 답변

### UDS/진단 통신 관련

**Q: Can you explain UDS and how you've used it in your work?**

> "UDS, or Unified Diagnostic Services, is defined by ISO 14229 and is the standard protocol used for ECU diagnostics in modern vehicles. It defines services like 0x22 for reading data by identifier, 0x27 for security access, and 0x31 for routine control, among others.
>
> In my work at EasyDES, I used UDS extensively to analyze OEM diagnostic tools — essentially reverse-engineering how specific OEM diagnostic software communicated with ECUs, then replicating that behavior in our own diagnostic product. I worked with vehicles from European, American, and Korean OEMs, so I built up a strong practical understanding of how different manufacturers implement the same UDS services differently."

---

**Q: What is DoIP and how is it different from CAN-based diagnostics?**

> "DoIP stands for Diagnostics over Internet Protocol, defined by ISO 13400. It allows diagnostic communication over Ethernet rather than the traditional CAN bus. The main difference is the physical and transport layer — instead of CAN frames with limited bandwidth, DoIP uses TCP/IP over Ethernet, which enables much higher data throughput.
>
> From a UDS perspective, the diagnostic services are mostly the same — the difference is in the transport and network layers beneath them. I had hands-on experience with DoIP in a JLR project where I built the Ethernet environment, configured DoIP entity addresses, and verified that UDS services worked correctly over the DoIP stack."

---

### A-SPICE / 프로세스 관련

**Q: What do you know about Automotive SPICE?**

> "Automotive SPICE is a process assessment model for automotive software development, based on ISO/IEC 33001. It defines process areas across the software engineering lifecycle — from requirements analysis through integration and testing — and evaluates them at capability levels from 0 to 5.
>
> In my validation work, I've been directly involved in the processes that A-SPICE evaluates — particularly SWE.4 through SWE.6, which cover software unit verification, integration testing, and qualification testing. I also deal with SUP.9 for problem resolution and SUP.10 for change request management regularly.
>
> I'm currently self-studying the PAM v3.1 and planning to pursue the Intacs CPA certification to formalize this knowledge."

---

**Q: How does your testing experience relate to A-SPICE processes?**

> "My regression testing and system validation work directly maps to SWE.6 — Software Qualification Testing — where the process requires a documented test plan, test cases derived from requirements, and recorded test results. The issue tracking I do maps to SUP.9 problem resolution, including status tracking and root cause analysis.
>
> What's interesting is that understanding A-SPICE has helped me see the structure behind what I was already doing intuitively in practice."

---

### ISO 26262 / 기능 안전 관련

**Q: What is ASIL and how is it determined?**

> "ASIL stands for Automotive Safety Integrity Level — it's a risk classification defined in ISO 26262 that ranges from A (lowest) to D (highest), with QM for items that don't require safety measures.
>
> ASIL is determined through a Hazard Analysis and Risk Assessment, or HARA, which evaluates three parameters for each hazardous event: Severity (how bad is the harm), Exposure (how often is the vehicle in that situation), and Controllability (how likely is it that a driver can avoid the harm). The combination of these three determines the ASIL level for the safety goal."

---

### 테스팅 관련

**Q: What's the difference between verification and validation?**

> "Verification asks 'Are we building the product right?' — it checks whether the system conforms to its specification. Validation asks 'Are we building the right product?' — it checks whether the system meets the actual user needs and intended use.
>
> In ISO 26262 terms, verification happens at each level of the V-model to confirm that outputs match inputs, while validation at the system level confirms the final product meets the safety goals."

---

**Q: How do you handle a situation where you find a critical defect late in the testing cycle?**

> "First, I document the defect immediately with full reproduction steps, severity classification, and impact assessment. Then I escalate it right away — this isn't the time to try to solve it quietly, because the team needs to know as early as possible to make informed decisions about schedule or scope.
>
> Then I work with the developers to understand root cause and potential workarounds. In one case during AVN testing, we found a critical regression issue late in the cycle. I re-ran the full regression in the affected area to understand the blast radius, which helped the team prioritize the fix correctly and we avoided any further surprises before release."

---

## 5. HR/동기 관련 자주 나오는 질문

### Q: Tell me about yourself. (자기소개)

**2분 버전 스크립트 준비 필수:**

> "I'm a test and validation engineer with about 6 years of experience in the automotive software domain. My background started in automotive diagnostic communication — specifically UDS and DoIP protocols — where I spent several years at a company called EasyDES, analyzing OEM diagnostic systems and building diagnostic simulators.
>
> I then transitioned into quality assurance and validation, working on Hyundai's overseas AVN systems at Vital Auto, and I'm currently an IVI test engineer at FPT Korea, embedded at Hyundai's R&D Center, where I handle pre-production vehicle validation.
>
> What sets me apart, I think, is the combination of deep diagnostic protocol knowledge — including real vehicle DoIP experience with JLR — and hands-on system validation experience. I'm now preparing to formalize this with Intacs CPA and ISO 26262 certifications, and I'm looking for an opportunity to apply this expertise in an international environment."

---

### Q: Why do you want to work overseas?

> "I've been fortunate to have meaningful international experiences — I spent about 6 months backpacking through Europe and North America after my first job, and more recently completed a working holiday in Australia, where I worked real jobs and navigated daily life in English.
>
> Those experiences showed me two things: that I can adapt to living and working in a different culture, and that the automotive software domain — especially A-SPICE and functional safety — is where the most interesting and sophisticated work is happening, particularly in Germany and the UK. I want to be closer to where the standards are being developed and applied at the highest level."

---

### Q: What are your salary expectations?

> "I'm targeting the market rate for this level of experience in [country]. Based on my research, that's in the range of [X] to [Y]. I'm open to discussion if the total compensation package, including benefits and development opportunities, is competitive."

→ 사전에 Glassdoor, Levels.fyi, LinkedIn Salary로 리서치 필수.

---

### Q: Do you need visa sponsorship?

> "Yes, I would need visa sponsorship. I currently hold Korean citizenship and would require a work visa. I understand this adds steps to the process, and I want to be upfront about it. I'm committed to making the transition as smooth as possible and can provide all required documentation."

→ 솔직하게 말하는 것이 최선. 숨기다가 나중에 걸리면 더 나쁨.

---

## 6. 당신이 반드시 준비해야 할 질문 (면접관에게)

인터뷰 마지막에 "Do you have any questions for us?"는 거의 항상 나옵니다.  
"No"는 최악의 답변. 반드시 2~3개 준비.

**좋은 질문 예시:**

> "Can you tell me more about the types of A-SPICE assessments this role would be involved in — are they supplier assessments, internal process reviews, or both?"

> "How does the team currently handle the transition from traditional CAN-based diagnostics to Ethernet/DoIP in validation workflows?"

> "What does the onboarding process look like for international hires, and is there any support for language integration if some internal communication is in German?"

> "What would success look like in this role in the first 6 months?"

---

## 7. 인터뷰 전 체크리스트

**기술 준비:**
```
[ ] UDS 서비스 (0x22, 0x27, 0x31 등) 영어로 설명 연습
[ ] DoIP vs CAN 차이 영어로 설명 연습
[ ] A-SPICE Level 0~2 차이 영어로 설명 연습
[ ] ASIL 결정 방법 영어로 설명 연습
[ ] STAR 스크립트 6개 완성
[ ] 2분 자기소개 영어 스크립트 완성 및 암기
```

**실전 준비:**
```
[ ] 회사 홈페이지, LinkedIn, 최근 뉴스 조사 (면접 전날)
[ ] 지원한 JD 다시 읽고 키워드 파악
[ ] 시간 맞춰 조용한 장소 확보 (화상 면접 시)
[ ] 카메라/마이크/인터넷 테스트
[ ] 물 한 잔 옆에 두기 (긴장 시 유용)
```

---

## 8. 영어 스피킹 일상 연습법

### 매일 할 것

**10분: 혼자 말하기 연습**
- 오늘 한 일을 영어로 말하기
- "Today I reviewed the test results for... and I found that..."

**20분: 기술 주제 설명 연습**
- 매주 하나의 주제 선택 (이번 주: UDS, 다음 주: DoIP, 그 다음: A-SPICE)
- 혼자 카메라/녹음기 앞에서 5분 스피치

**주 2회: iTalki 또는 Preply**
- 기술 영어 튜터와 30분 세션
- 인터뷰 롤플레이 요청 ("Can we do a mock interview for an automotive engineer role?")

### 실력 점검 기준

이 질문을 막힘 없이 2분 동안 영어로 말할 수 있으면 기술 인터뷰 준비 완료:

> "Explain what you did at EasyDES and why it was technically challenging."
