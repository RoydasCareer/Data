# -*- coding: utf-8 -*-
"""
database/connection.py — DB 연결 및 공통 쿼리 함수
"""

from __future__ import annotations

import json
import os
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Generator

import psycopg
from psycopg import sql
from psycopg.rows import dict_row

from utils.logger import get_logger

logger = get_logger("database")


def get_connection():
    """PostgreSQL 연결 반환 (psycopg3 사용)"""
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise EnvironmentError(
            "DATABASE_URL 환경변수가 설정되지 않았습니다.\n"
            ".env 파일 또는 GitHub Secrets에 DATABASE_URL을 추가하세요."
        )

    try:
        conn = psycopg.connect(db_url, autocommit=False)
        return conn
    except Exception as e:
        logger.error(f"DB 연결 실패: {e}")
        raise


@contextmanager
def get_db():
    """컨텍스트 매니저 방식의 DB 연결"""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def run_migrations(conn) -> None:
    """마이그레이션 실행"""
    from pathlib import Path

    migrations_dir = Path(__file__).parent / "migrations"

    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS _migrations (
                filename TEXT PRIMARY KEY,
                applied_at TIMESTAMPTZ DEFAULT NOW()
            )
        """)
        conn.commit()

        sql_files = sorted(migrations_dir.glob("*.sql"))
        for sql_file in sql_files:
            cur.execute("SELECT 1 FROM _migrations WHERE filename = %s", (sql_file.name,))
            if cur.fetchone():
                logger.debug(f"마이그레이션 건너뜀: {sql_file.name}")
                continue

            logger.info(f"마이그레이션 실행: {sql_file.name}")
            cur.execute(sql_file.read_text(encoding="utf-8"))
            cur.execute("INSERT INTO _migrations (filename) VALUES (%s)", (sql_file.name,))
            conn.commit()
            logger.info(f"마이그레이션 완료: {sql_file.name}")


def upsert_raw_job(
    conn,
    *,
    source_site: str,
    external_id: str,
    url: str | None,
    title: str | None,
    company: str | None,
    location_raw: str | None,
    raw_data: dict,
    visa_keywords: list[str],
    is_staged: bool,
) -> tuple[int | None, bool]:
    """raw_jobs에 공고 저장"""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO raw_jobs
                (source_site, external_id, url, title, company,
                 location_raw, raw_data, visa_keywords, is_staged)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (source_site, external_id) DO NOTHING
            RETURNING id
        """, (
            source_site, external_id, url, title, company,
            location_raw,
            json.dumps(raw_data),
            visa_keywords or [],
            is_staged,
        ))
        row = cur.fetchone()
        if row:
            return row[0], True
        else:
            cur.execute(
                "SELECT id FROM raw_jobs WHERE source_site=%s AND external_id=%s",
                (source_site, external_id)
            )
            existing = cur.fetchone()
            return (existing[0] if existing else None), False


def insert_staged_job(
    conn,
    *,
    raw_job_id: int,
    source_site: str,
    title: str,
    company: str | None,
    location: str | None,
    is_remote: bool | None,
    job_type: str | None,
    salary_min: int | None,
    salary_max: int | None,
    salary_currency: str,
    salary_period: str,
    description: str | None,
    apply_url: str | None,
    posted_at: datetime | None,
    visa_keywords: list[str],
) -> int:
    """staged_jobs에 공고 저장"""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO staged_jobs
                (raw_job_id, source_site, title, company, location, is_remote,
                 job_type, salary_min, salary_max, salary_currency, salary_period,
                 description, apply_url, posted_at, visa_keywords)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            raw_job_id, source_site, title, company, location, is_remote,
            job_type, salary_min, salary_max, salary_currency, salary_period,
            description, apply_url, posted_at,
            visa_keywords or [],
        ))
        return cur.fetchone()[0]


def start_run(conn, trigger: str = "scheduled") -> int:
    """수집 실행 로그 시작"""
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO collection_runs (trigger) VALUES (%s) RETURNING id",
            (trigger,)
        )
        return cur.fetchone()[0]


def finish_run(
    conn,
    run_id: int,
    *,
    status: str,
    sites_attempted: int,
    sites_success: int,
    sites_failed: int,
    total_fetched: int,
    total_new_raw: int,
    total_staged: int,
    error_messages: list[str] | None = None,
) -> None:
    """수집 실행 로그 완료"""
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE collection_runs SET
                finished_at     = NOW(),
                status          = %s,
                sites_attempted = %s,
                sites_success   = %s,
                sites_failed    = %s,
                total_fetched   = %s,
                total_new_raw   = %s,
                total_staged    = %s,
                error_messages  = %s
            WHERE id = %s
        """, (
            status, sites_attempted, sites_success, sites_failed,
            total_fetched, total_new_raw, total_staged,
            error_messages or [],
            run_id,
        ))
