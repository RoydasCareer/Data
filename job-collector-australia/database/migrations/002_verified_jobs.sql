-- ═══════════════════════════════════════════════════════
-- 002_verified_jobs.sql — AI 검수 완료 공고 테이블
-- ※ AI 연동 준비가 됐을 때 자동으로 적용됩니다.
--   지금은 실행돼도 데이터는 비어 있습니다.
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS verified_jobs (
    id               BIGSERIAL    PRIMARY KEY,
    staged_job_id    BIGINT       REFERENCES staged_jobs(id) ON DELETE SET NULL,
    raw_job_id       BIGINT       REFERENCES raw_jobs(id)    ON DELETE SET NULL,
    source_site      TEXT         NOT NULL,

    -- 공고 핵심 정보 (staged_jobs에서 복사)
    title            TEXT         NOT NULL,
    company          TEXT,
    location         TEXT,
    apply_url        TEXT,
    posted_at        TIMESTAMPTZ,

    -- AI 검수 결과
    visa_confidence  TEXT         NOT NULL
                                  CHECK (visa_confidence IN ('confirmed', 'possible')),
    confidence_score FLOAT        CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    visa_evidence    TEXT,        -- AI가 판단한 근거 문장
    ai_model         TEXT,        -- 사용한 AI 모델 (예: "claude-sonnet-4", "llama3")
    ai_notes         TEXT,        -- 추가 메모

    verified_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verified_confidence ON verified_jobs(visa_confidence);
CREATE INDEX IF NOT EXISTS idx_verified_site       ON verified_jobs(source_site);
CREATE INDEX IF NOT EXISTS idx_verified_at         ON verified_jobs(verified_at DESC);

-- ──────────────────────────────────────────
-- 편의 뷰 — 최종 확정 공고 목록
-- ──────────────────────────────────────────
CREATE OR REPLACE VIEW confirmed_jobs AS
SELECT
    v.id,
    v.source_site,
    v.title,
    v.company,
    v.location,
    v.apply_url,
    v.posted_at,
    v.visa_confidence,
    v.confidence_score,
    v.visa_evidence,
    v.verified_at
FROM verified_jobs v
WHERE v.visa_confidence = 'confirmed'
ORDER BY v.verified_at DESC;

CREATE OR REPLACE VIEW possible_jobs AS
SELECT
    v.id,
    v.source_site,
    v.title,
    v.company,
    v.location,
    v.apply_url,
    v.posted_at,
    v.visa_confidence,
    v.confidence_score,
    v.visa_evidence,
    v.verified_at
FROM verified_jobs v
WHERE v.visa_confidence = 'possible'
ORDER BY v.confidence_score DESC, v.verified_at DESC;
