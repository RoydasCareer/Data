# 🦘 Visa Job Collector — 호주 비자 스폰서 채용 공고 자동 수집기

GitHub Actions로 자동 실행되어 호주 비자 스폰서십 채용 공고를 수집하고  
PostgreSQL 데이터베이스에 저장하는 파이프라인입니다.

---

## 📋 목차

1. [프로그램 구조](#1-프로그램-구조)
2. [동작 방식](#2-동작-방식)
3. [빠른 시작](#3-빠른-시작)
4. [설정 가이드](#4-설정-가이드)
5. [수집기별 상세 설명](#5-수집기별-상세-설명)
6. [데이터베이스 스키마](#6-데이터베이스-스키마)
7. [커스터마이징 레시피](#7-커스터마이징-레시피)
8. [자동화 설정 (GitHub Actions)](#8-자동화-설정-github-actions)
9. [AI 검수 연동 준비](#9-ai-검수-연동-준비)
10. [문제 해결](#10-문제-해결)

---

## 1. 프로그램 구조

```
visa-job-collector/
│
├── 📁 .github/
│   └── workflows/
│       └── collect.yml         ← GitHub Actions 자동화 설정
│
├── 📁 collectors/              ← 각 사이트별 수집기 모음
│   ├── base.py                 ← 모든 수집기의 공통 기반 클래스
│   ├── group_b/                ← RSS/XML 피드 수집기
│   │   └── we_work_remotely.py
│   └── group_c/                ← REST JSON API 수집기
│       ├── arbeitnow.py        ← visa_sponsorship 파라미터 지원
│       ├── remotive.py
│       ├── remote_ok.py
│       └── jobicy.py
│
├── 📁 database/
│   ├── connection.py           ← DB 연결 + 공통 쿼리 함수
│   └── migrations/
│       └── 001_init.sql        ← 테이블 생성 SQL (자동 실행됨)
│
├── 📁 normalizer/
│   ├── schema.py               ← 표준 공고 스키마 (StandardJob)
│   └── normalizer.py           ← StandardJob → DB 저장 로직
│
├── 📁 config/
│   └── settings.py             ← ⭐ 모든 설정이 여기에 (여기만 수정하면 됨)
│
├── 📁 utils/
│   ├── logger.py               ← 로거
│   └── filters.py              ← 비자 키워드 + 위치 필터 함수
│
├── main.py                     ← 실행 진입점
├── requirements.txt
├── env.example                 ← 환경변수 예시
└── README.md
```

### 파일별 역할 한 줄 요약

| 파일 | 역할 | 수정 빈도 |
|------|------|-----------|
| `config/settings.py` | 수집 범위·키워드·동작 설정 | 자주 |
| `collectors/group_c/arbeitnow.py` | Arbeitnow API 수집 | 거의 없음 |
| `normalizer/schema.py` | 공고 표준 필드 정의 | AI 연동 시 |
| `database/migrations/001_init.sql` | DB 테이블 구조 | AI 연동 시 |
| `.github/workflows/collect.yml` | 실행 스케줄 | 변경 필요 시 |
| `main.py` | 전체 파이프라인 조율 | 거의 없음 |

---

## 2. 동작 방식

```
GitHub Actions (스케줄)
        │
        ▼
   main.py 실행
        │
        ├── DB 마이그레이션 확인 (최초 1회 테이블 생성)
        │
        ├── 수집기 순차 실행
        │   ├── Arbeitnow  → visa_sponsorship=true 파라미터로 API 호출
        │   ├── Remotive   → "visa sponsorship australia" 키워드로 검색
        │   ├── Remote OK  → 전체 목록 가져온 후 태그 필터링
        │   ├── Jobicy     → geo=australia 파라미터로 호주 공고만 요청
        │   └── WWR        → RSS 피드 전체 다운로드 후 키워드 필터링
        │
        ├── 공고별 처리 (각 공고마다 반복)
        │   ├── ① raw_jobs 저장 (중복이면 건너뜀)
        │   ├── ② 비자 키워드 필터 (settings.py의 VISA_POSITIVE_KEYWORDS)
        │   ├── ③ 부정 키워드 확인 (스폰서 불가 명시 공고 제외)
        │   └── ④ 통과 시 staged_jobs 저장
        │
        └── 실행 통계 출력 + DB 기록
```

### 데이터 흐름 상세

```
API 응답 (raw JSON)
    │
    ▼
raw_jobs 테이블        ← 모든 수집 공고 저장 (중복 UNIQUE 제약)
    │                    visa_status = NULL (AI 미처리)
    │                    나중에 AI가 이 필드를 채움
    │
    ▼ (키워드 필터 통과 시)
staged_jobs 테이블     ← 표준 스키마로 정규화된 공고
    │                    비자 키워드 매칭된 공고만 저장
    │                    visa_status = NULL (AI 대기 중)
    │
    ▼ (나중에 AI 연동 시)
verified_jobs 테이블   ← AI가 confirmed/possible 판정한 공고
    (아직 미구현)
```

---

## 3. 빠른 시작

### 3-1. 저장소 클론

```bash
git clone https://github.com/your-username/visa-job-collector.git
cd visa-job-collector
```

### 3-2. Python 의존성 설치

```bash
pip install -r requirements.txt
```

### 3-3. PostgreSQL DB 준비

**Supabase 사용 (무료, 권장):**

1. [supabase.com](https://supabase.com) 가입
2. 새 프로젝트 생성
3. Settings → Database → Connection string → URI 복사
4. 아래 형식으로 `.env` 파일 생성:

```bash
cp env.example .env
# .env 파일을 열어 DATABASE_URL 값 입력
```

```env
DATABASE_URL=postgresql://postgres:your-password@db.xxxx.supabase.co:5432/postgres
```

**Neon 사용 (서버리스, 무료):**
```env
DATABASE_URL=postgresql://user:pass@ep-xxxx.aws.neon.tech/neondb?sslmode=require
```

### 3-4. 로컬 테스트 실행

```bash
# DB 저장 없이 수집 테스트
python main.py --dry-run

# 특정 수집기만 테스트
python main.py --dry-run --sites arbeitnow

# 실제 수집 (DB에 저장)
python main.py
```

### 3-5. GitHub Actions 자동화 설정

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. **New repository secret** 클릭
3. Name: `DATABASE_URL`, Value: DB 연결 문자열 입력
4. `.github/workflows/collect.yml`이 자동으로 인식됨
5. Actions 탭에서 수동으로 "Run workflow" 클릭해 테스트

---

## 4. 설정 가이드

**모든 주요 설정은 `config/settings.py` 하나에 모여 있습니다.**

### 4-1. 수집기 활성화/비활성화

```python
# config/settings.py
ENABLED_COLLECTORS = {
    "arbeitnow":        True,   # 끄려면 False로
    "remotive":         True,
    "remote_ok":        False,  # 이 수집기만 비활성화
    "jobicy":           True,
    "we_work_remotely": True,
}
```

### 4-2. 호주 위치 필터 모드

```python
# False (기본값): 위치에 관계없이 비자 키워드가 있는 공고 수집
#                 → 글로벌 리모트 공고도 포함 (추천)
# True:           location 필드에 호주 관련 단어가 있는 공고만 수집
#                 → 더 엄격한 필터, 일부 공고 누락 가능
STRICT_LOCATION_FILTER: bool = False
```

### 4-3. 비자 키워드 추가/수정

```python
VISA_POSITIVE_KEYWORDS: list[str] = [
    "visa sponsorship",      # 이 키워드 중 하나라도 title 또는 description에 있으면 수집
    "subclass 482",          # 호주 특화 비자 서브클래스
    "work permit",
    # 새 키워드 추가:
    "right to work",         # 여기에 추가하면 됩니다
]

VISA_NEGATIVE_KEYWORDS: list[str] = [
    "no visa sponsorship",   # 이 키워드가 있으면 제외
    "must have full work rights",
    # 새 제외 키워드 추가:
    "must be australian citizen",
]
```

### 4-4. 수집 동작 조정

```python
MAX_JOBS_PER_SITE: int = 200     # 사이트당 최대 수집 수 (0 = 무제한)
REQUEST_DELAY_SECONDS: float = 1.5  # 요청 간 대기 시간 (서버 부하 방지)
HTTP_TIMEOUT_SECONDS: int = 30   # HTTP 타임아웃
MAX_RETRIES: int = 3             # 실패 시 재시도 횟수
```

---

## 5. 수집기별 상세 설명

### Group C — REST JSON API

#### Arbeitnow (`collectors/group_c/arbeitnow.py`)

| 항목 | 내용 |
|------|------|
| API URL | `https://www.arbeitnow.com/api/job-board-api` |
| 비자 필터 | API 파라미터 `visa_sponsorship=true` 직접 지원 |
| 위치 필터 | location 필드에 국가 포함 |
| 페이지네이션 | 지원 (최대 PAGE_LIMIT 페이지) |
| 인증 | 불필요 |

```python
# collectors/group_c/arbeitnow.py 상단에서 조정
FETCH_VISA_ONLY: bool = True   # False면 전체 수집 후 키워드 필터
PAGE_LIMIT: int = 10           # 수집 페이지 수 (1페이지 ≈ 100개)
```

#### Remotive (`collectors/group_c/remotive.py`)

| 항목 | 내용 |
|------|------|
| API URL | `https://remotive.com/api/remote-jobs` |
| 비자 필터 | 없음 → search 파라미터로 키워드 검색 |
| 페이지네이션 | 없음 (단일 응답, 최대 100개) |
| 인증 | 불필요 |

```python
# 검색할 쿼리 목록 (여러 쿼리를 순서대로 실행)
SEARCH_QUERIES: list[str] = [
    "visa sponsorship australia",
    "sponsor australia",
    # 추가하고 싶은 검색어를 여기에
]
```

#### Remote OK (`collectors/group_c/remote_ok.py`)

| 항목 | 내용 |
|------|------|
| API URL | `https://remoteok.com/api` |
| 비자 필터 | 없음 → 전체 목록 다운 후 태그 필터 |
| 인증 | 불필요 |
| 주의 | 전체 공고를 한 번에 받으므로 API 부하 큼 |

```python
FILTER_TAGS: list[str] = ["australia", "visa", "sponsor"]
MAX_AGE_DAYS: int = 30   # 30일 이내 공고만 처리
```

#### Jobicy (`collectors/group_c/jobicy.py`)

| 항목 | 내용 |
|------|------|
| API URL | `https://jobicy.com/api/v2/remote-jobs` |
| 비자 필터 | tag 파라미터로 키워드 검색 가능 |
| 위치 필터 | geo 파라미터 지원 (`australia`) |
| 인증 | 불필요 |

```python
GEO: str = "australia"          # 위치 필터
TAGS: list[str] = [
    "visa sponsorship",
    "sponsor",
    # 추가 태그
]
```

### Group B — RSS 피드

#### We Work Remotely (`collectors/group_b/we_work_remotely.py`)

| 항목 | 내용 |
|------|------|
| 피드 URL | `https://weworkremotely.com/remote-jobs.rss` |
| 비자 필터 | 없음 → 전체 피드 후 키워드 필터 |
| 카테고리 | 카테고리별 피드 URL 사용 가능 |

```python
FEED_URLS: list[str] = [
    "https://weworkremotely.com/remote-jobs.rss",
    # 특정 직군만 필요하면 카테고리 피드 추가:
    "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
]
```

---

## 6. 데이터베이스 스키마

### raw_jobs — 모든 수집 공고

```sql
id              BIGSERIAL   -- 자동 증가 PK
source_site     TEXT        -- 수집 사이트 (예: "arbeitnow")
external_id     TEXT        -- 사이트 고유 ID
url             TEXT        -- 공고 원본 URL
title           TEXT        -- 공고 제목
company         TEXT        -- 회사명
location_raw    TEXT        -- 원본 위치 문자열
raw_data        JSONB       -- API 응답 원본 전체
collected_at    TIMESTAMPTZ -- 수집 시각
is_staged       BOOLEAN     -- staged_jobs에 저장됐는지
visa_keywords   TEXT[]      -- 매칭된 비자 키워드 목록
visa_status     TEXT        -- NULL(미처리) / confirmed / possible / no
ai_reviewed_at  TIMESTAMPTZ -- AI 검수 시각 (나중에 채워짐)
```

**중복 방지:** `UNIQUE(source_site, external_id)` 제약으로 같은 공고가 두 번 들어오면 자동으로 건너뜀.

### staged_jobs — 정규화된 공고 (AI 검수 대기)

```sql
id               BIGSERIAL   -- PK
raw_job_id       BIGINT      -- raw_jobs.id 참조
source_site      TEXT        -- 수집 사이트
title            TEXT        -- 공고 제목 (정규화됨)
company          TEXT        -- 회사명
location         TEXT        -- 정규화된 위치
is_remote        BOOLEAN     -- 원격 근무 여부
job_type         TEXT        -- full_time / part_time / contract / internship
salary_min       INTEGER     -- 최저 연봉
salary_max       INTEGER     -- 최고 연봉
salary_currency  TEXT        -- 통화 (기본: AUD)
salary_period    TEXT        -- year / month / hour
description      TEXT        -- HTML 제거된 순수 텍스트
apply_url        TEXT        -- 지원 URL
posted_at        TIMESTAMPTZ -- 공고 게시일
normalized_at    TIMESTAMPTZ -- 정규화 시각
visa_keywords    TEXT[]      -- 매칭된 키워드
visa_status      TEXT        -- NULL → AI가 채울 필드
confidence_score FLOAT       -- AI 신뢰도 (0.0~1.0)
visa_evidence    TEXT        -- AI 판단 근거
```

### collection_runs — 수집 실행 로그

```sql
id              BIGSERIAL   -- PK
started_at      TIMESTAMPTZ -- 수집 시작 시각
finished_at     TIMESTAMPTZ -- 수집 완료 시각
status          TEXT        -- running / success / partial / failed
trigger         TEXT        -- scheduled / manual
sites_attempted INTEGER     -- 시도한 사이트 수
sites_success   INTEGER     -- 성공한 사이트 수
sites_failed    INTEGER     -- 실패한 사이트 수
total_fetched   INTEGER     -- 가져온 총 공고 수
total_new_raw   INTEGER     -- 새로 저장된 공고 수
total_staged    INTEGER     -- staged에 저장된 공고 수
error_messages  TEXT[]      -- 오류 메시지 목록
```

### 편의 뷰 (자동 생성)

```sql
-- AI 검수 대기 공고 목록
SELECT * FROM pending_ai_review;

-- 사이트별 수집 현황
SELECT * FROM collection_summary;
```

---

## 7. 커스터마이징 레시피

### 레시피 1: 새 수집기 추가 (예: LinkedIn Jobs RSS)

**Step 1: 수집기 파일 생성**

```python
# collectors/group_b/linkedin_au.py
from collectors.base import BaseCollector
from normalizer.schema import StandardJob
import feedparser

class LinkedInAuCollector(BaseCollector):
    site_name = "linkedin_au"  # DB에 저장될 식별자 (영문 소문자, 언더스코어)

    def fetch(self):
        feed_url = "https://www.linkedin.com/jobs/rss/..."
        feed = feedparser.parse(self.get_text(feed_url))

        for entry in feed.entries:
            yield StandardJob(
                source_site   = self.site_name,
                external_id   = entry.get("id", ""),
                raw_data      = {"title": entry.title, "link": entry.link},
                title         = entry.title,
                company       = None,  # 추출 불가 시 None
                location_raw  = "Australia",
                apply_url     = entry.link,
                description_raw = entry.get("summary", ""),
            )
```

**Step 2: `main.py`의 레지스트리에 등록**

```python
# main.py의 get_all_collectors() 함수 안
from collectors.group_b.linkedin_au import LinkedInAuCollector

REGISTRY = {
    ...
    "linkedin_au": LinkedInAuCollector,  # 추가
}
```

**Step 3: `config/settings.py`에 활성화**

```python
ENABLED_COLLECTORS = {
    ...
    "linkedin_au": True,  # 추가
}
```

---

### 레시피 2: 수집 주기 변경

`.github/workflows/collect.yml`에서 cron 표현식 수정:

```yaml
schedule:
  # 하루 2회 (UTC 00:00, 12:00)
  - cron: "0 0,12 * * *"

  # 매주 월요일 UTC 00:00만
  - cron: "0 0 * * 1"

  # 매일 1회 UTC 00:00
  - cron: "0 0 * * *"
```

> **참고:** GitHub Actions 무료 계정은 월 2,000분 제공.  
> 1회 실행이 약 2~5분이므로 하루 4회 = 월 약 300분 소모.

---

### 레시피 3: 특정 직군만 수집

각 수집기 파일에서 직군 필터 설정:

```python
# collectors/group_c/remotive.py
SEARCH_QUERIES = [
    "software engineer visa sponsorship australia",
    "data engineer visa australia",
    "devops visa australia",
]
CATEGORY = "software-dev"  # Remotive 카테고리 (빈 문자열 = 전체)
```

```python
# collectors/group_b/we_work_remotely.py
FEED_URLS = [
    # 프로그래밍 직군 피드만 사용
    "https://weworkremotely.com/categories/remote-programming-jobs.rss",
]
```

---

### 레시피 4: 수집 결과를 CSV로 내보내기

GitHub Actions 워크플로우에 단계 추가:

```yaml
# .github/workflows/collect.yml에 추가
- name: CSV 내보내기
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    python -c "
    import psycopg2
    import csv
    import os

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute('''
        SELECT title, company, location, apply_url, visa_keywords, normalized_at
        FROM staged_jobs
        WHERE normalized_at > NOW() - INTERVAL '24 hours'
        ORDER BY normalized_at DESC
    ''')
    rows = cur.fetchall()
    with open('latest_jobs.csv', 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['title','company','location','apply_url','keywords','collected_at'])
        w.writerows(rows)
    print(f'{len(rows)}개 공고 내보냄')
    "

- name: CSV 업로드 (Artifacts)
  uses: actions/upload-artifact@v4
  with:
    name: latest-jobs-${{ github.run_id }}
    path: latest_jobs.csv
    retention-days: 7
```

---

### 레시피 5: 호주 이외 지역 추가

`config/settings.py`에서 위치 키워드 추가:

```python
# 캐나다도 추가하고 싶을 때
AUSTRALIA_LOCATION_KEYWORDS = [
    # 기존 호주 항목들...
    "australia", "sydney", "melbourne",
    # 캐나다 추가
    "canada", "toronto", "vancouver", "montreal",
    ", ca",
]
```

또는 `STRICT_LOCATION_FILTER = False`로 설정하면 위치 무관 비자 키워드 매칭으로 전환됨.

---

### 레시피 6: Slack/Discord 알림 추가

`.github/workflows/collect.yml`에 스텝 추가:

```yaml
- name: Slack 알림 (새 공고 있을 때만)
  if: success()
  run: |
    python -c "
    import os, psycopg2, json, urllib.request

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute('''
        SELECT COUNT(*) FROM staged_jobs
        WHERE normalized_at > NOW() - INTERVAL '7 hours'
    ''')
    count = cur.fetchone()[0]

    if count > 0:
        payload = {'text': f'🦘 새 비자 공고 {count}개 수집됨!'}
        req = urllib.request.Request(
            os.environ['SLACK_WEBHOOK'],
            data=json.dumps(payload).encode(),
            headers={'Content-Type': 'application/json'}
        )
        urllib.request.urlopen(req)
    "
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}  # Secrets에 추가 필요
```

---

## 8. 자동화 설정 (GitHub Actions)

### 필요한 GitHub Secrets

| Secret 이름 | 내용 | 필수 여부 |
|------------|------|-----------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | **필수** |
| `SLACK_WEBHOOK` | Slack Incoming Webhook URL | 선택 |

**Secrets 설정 방법:**
1. GitHub 저장소 → Settings
2. 좌측 메뉴 → Secrets and variables → Actions
3. "New repository secret" 클릭

### 수동 실행 방법

1. GitHub 저장소 → Actions 탭
2. "Visa Job Collector" 워크플로우 클릭
3. "Run workflow" 버튼 클릭
4. 옵션 설정 후 실행:
   - **sites**: 특정 수집기만 실행 (예: `arbeitnow remotive`)
   - **dry_run**: 체크하면 DB 저장 없이 테스트

### 실행 시간 예측

| 수집기 수 | 예상 소요 시간 |
|-----------|--------------|
| 1개       | 1~2분 |
| 5개 (전체)| 3~8분 |

---

## 9. AI 검수 연동 준비

현재 `staged_jobs` 테이블의 `visa_status` 필드는 `NULL` 상태입니다.  
AI 연동 시 이 필드를 채우면 됩니다.

### 준비된 DB 뷰 활용

```sql
-- AI 검수 대기 공고 조회 (AI 스크립트에서 이 뷰를 읽으면 됨)
SELECT staged_id, source_site, title, company, description_preview
FROM pending_ai_review
LIMIT 50;
```

### AI 연동 시 추가할 테이블 (나중에)

```sql
-- 나중에 migrations/002_verified.sql 파일로 추가
CREATE TABLE verified_jobs (
    id               BIGSERIAL PRIMARY KEY,
    staged_job_id    BIGINT REFERENCES staged_jobs(id),
    visa_confidence  TEXT CHECK (visa_confidence IN ('confirmed', 'possible')),
    confidence_score FLOAT,
    visa_evidence    TEXT,
    verified_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 로컬 AI (Ollama) 연동 예시

```python
# ai_screener/ollama_screener.py (나중에 추가)
import requests

def screen_with_ollama(description: str) -> dict:
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "llama3",
        "prompt": f"Does this job offer visa sponsorship in Australia?\n\n{description[:2000]}\n\nAnswer: confirmed/possible/no",
        "stream": False,
    })
    # ... 결과 파싱
```

### Claude API 연동 예시

```python
# ai_screener/claude_screener.py (나중에 추가)
import anthropic

client = anthropic.Anthropic()

def screen_with_claude(description: str) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"""..."""
        }]
    )
    # ... 결과를 staged_jobs.visa_status에 업데이트
```

---

## 10. 문제 해결

### "DATABASE_URL 환경변수가 설정되지 않았습니다"

```bash
# 로컬: .env 파일에 DATABASE_URL이 있는지 확인
cat .env | grep DATABASE_URL

# GitHub Actions: Secrets 설정 확인
# Settings → Secrets and variables → Actions
```

### "psycopg2 설치 오류"

```bash
# macOS
brew install postgresql
pip install psycopg2-binary

# Ubuntu/Debian
sudo apt-get install libpq-dev
pip install psycopg2-binary
```

### 공고가 수집되지 않을 때

1. `--dry-run`으로 API 응답 확인:
   ```bash
   python main.py --dry-run --sites arbeitnow
   ```

2. `config/settings.py`에서 키워드 확인:
   - `VISA_POSITIVE_KEYWORDS`에 너무 구체적인 키워드만 있지 않은지
   - `STRICT_LOCATION_FILTER = True`면 `False`로 바꿔서 테스트

3. 특정 수집기 오류 확인:
   - GitHub Actions → 해당 워크플로우 실행 → 로그 확인

### 중복 공고가 들어올 때

중복은 `UNIQUE(source_site, external_id)` 제약으로 자동 방지됩니다.  
같은 공고가 두 번 수집되면 `ON CONFLICT DO NOTHING`으로 건너뛰며  
`is_new=False` 로그가 찍힙니다. 정상 동작입니다.

### GitHub Actions가 실행되지 않을 때

- `schedule` 트리거는 저장소에 최근 활동이 있어야 동작합니다
- 60일 이상 비활성 저장소는 스케줄이 자동 중단됩니다
- Actions 탭 → "Enable Actions" 버튼이 있으면 클릭

---

## 라이선스

MIT License — 자유롭게 수정·사용·배포 가능합니다.
