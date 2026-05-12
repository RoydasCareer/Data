-- ═══════════════════════════════════════════════════════
-- 001_init.sql — 초기 테이블 생성
-- Supabase / Neon / 일반 PostgreSQL 모두 호환
-- ═══════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- ① raw_jobs — 수집된 모든 공고 (중복 방지 기준)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS raw_jobs (
    id              BIGSERIAL   PRIMARY KEY,
    source_site     TEXT        NOT NULL,           -- 수집 사이트명 (예: "arbeitnow")
    external_id     TEXT        NOT NULL,           -- 사이트 고유 공고 ID
    url             TEXT,                           -- 공고 원본 URL
    title           TEXT,                           -- 공고 제목 (원본)
    company         TEXT,                           -- 회사명
    location_raw    TEXT,                           -- 위치 문자열 (원본)
    raw_data        JSONB       NOT NULL,           -- API 응답 원본 전체
    collected_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- 필터 결과
    is_staged       BOOLEAN     NOT NULL DEFAULT FALSE,  -- staged_jobs에 저장됐는지
    visa_keywords   TEXT[],                              -- 매칭된 비자 키워드 목록
    -- AI 검수용 (나중에 채움)
    visa_status     TEXT        CHECK (visa_status IN ('confirmed', 'possible', 'no')),
    ai_reviewed_at  TIMESTAMPTZ,
    UNIQUE (source_site, external_id)               -- 중복 수집 방지
);

CREATE INDEX IF NOT EXISTS idx_raw_jobs_site        ON raw_jobs(source_site);
CREATE INDEX IF NOT EXISTS idx_raw_jobs_collected   ON raw_jobs(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_jobs_staged      ON raw_jobs(is_staged) WHERE is_staged = FALSE;
CREATE INDEX IF NOT EXISTS idx_raw_jobs_ai_pending  ON raw_jobs(visa_status) WHERE visa_status IS NULL AND is_staged = TRUE;

-- ──────────────────────────────────────────
-- ② staged_jobs — 정규화된 공고 (AI 검수 대기)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staged_jobs (
    id               BIGSERIAL   PRIMARY KEY,
    raw_job_id       BIGINT      REFERENCES raw_jobs(id) ON DELETE SET NULL,
    source_site      TEXT        NOT NULL,
    -- 표준화된 필드
    title            TEXT        NOT NULL,
    company          TEXT,
    location         TEXT,                          -- 정규화된 위치
    is_remote        BOOLEAN,
    job_type         TEXT,                          -- full_time | part_time | contract | internship
    salary_min       INTEGER,                       -- 연봉 최소 (해당 통화 기준)
    salary_max       INTEGER,                       -- 연봉 최대
    salary_currency  TEXT        DEFAULT 'AUD',
    salary_period    TEXT        DEFAULT 'year',    -- year | month | hour
    description      TEXT,                          -- HTML 제거된 순수 텍스트
    apply_url        TEXT,
    posted_at        TIMESTAMPTZ,
    normalized_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- 비자 관련
    visa_keywords    TEXT[],                        -- 매칭된 키워드
    -- AI 검수용 (나중에 채움)
    visa_status      TEXT        CHECK (visa_status IN ('confirmed', 'possible', 'no')),
    confidence_score FLOAT,                         -- 0.0 ~ 1.0
    visa_evidence    TEXT,                          -- AI 판단 근거
    ai_notes         TEXT,
    ai_reviewed_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_staged_jobs_source     ON staged_jobs(source_site);
CREATE INDEX IF NOT EXISTS idx_staged_jobs_normalized ON staged_jobs(normalized_at DESC);
CREATE INDEX IF NOT EXISTS idx_staged_jobs_ai_pending ON staged_jobs(visa_status) WHERE visa_status IS NULL;
CREATE INDEX IF NOT EXISTS idx_staged_jobs_raw        ON staged_jobs(raw_job_id);

-- ──────────────────────────────────────────
-- ③ collection_runs — 수집 실행 로그
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collection_runs (
    id              BIGSERIAL   PRIMARY KEY,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at     TIMESTAMPTZ,
    status          TEXT        NOT NULL DEFAULT 'running'  -- running | success | partial | failed
                                CHECK (status IN ('running', 'success', 'partial', 'failed')),
    trigger         TEXT        DEFAULT 'scheduled',        -- scheduled | manual
    -- 결과 통계
    sites_attempted INTEGER     DEFAULT 0,
    sites_success   INTEGER     DEFAULT 0,
    sites_failed    INTEGER     DEFAULT 0,
    total_fetched   INTEGER     DEFAULT 0,                  -- API에서 받아온 총 공고 수
    total_new_raw   INTEGER     DEFAULT 0,                  -- 새로 raw_jobs에 저장된 수
    total_staged    INTEGER     DEFAULT 0,                  -- staged_jobs에 저장된 수
    error_messages  TEXT[]
);

-- ──────────────────────────────────────────
-- 편의용 뷰 — AI 검수 대기 공고 목록
-- ──────────────────────────────────────────
CREATE OR REPLACE VIEW pending_ai_review AS
SELECT
    s.id            AS staged_id,
    s.raw_job_id,
    s.source_site,
    s.title,
    s.company,
    s.location,
    s.apply_url,
    s.visa_keywords,
    s.normalized_at,
    LEFT(s.description, 500) AS description_preview
FROM staged_jobs s
WHERE s.visa_status IS NULL
ORDER BY s.normalized_at DESC;

-- ──────────────────────────────────────────
-- 편의용 뷰 — 사이트별 수집 현황
-- ──────────────────────────────────────────
CREATE OR REPLACE VIEW collection_summary AS
SELECT
    source_site,
    COUNT(*)                                                    AS total_raw,
    COUNT(*) FILTER (WHERE is_staged = TRUE)                    AS total_staged,
    COUNT(*) FILTER (WHERE visa_status = 'confirmed')           AS confirmed,
    COUNT(*) FILTER (WHERE visa_status = 'possible')            AS possible,
    COUNT(*) FILTER (WHERE visa_status = 'no')                  AS not_sponsored,
    COUNT(*) FILTER (WHERE is_staged = TRUE AND visa_status IS NULL) AS pending_ai,
    MAX(collected_at)                                           AS last_collected
FROM raw_jobs
GROUP BY source_site
ORDER BY total_raw DESC;
