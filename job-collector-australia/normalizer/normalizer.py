# -*- coding: utf-8 -*-
"""
normalizer/normalizer.py — StandardJob → DB 저장
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
수집기에서 StandardJob을 만들면 이 함수 하나로 DB에 저장됩니다.
필터 결과에 따라 raw_jobs만 저장하거나 staged_jobs에도 저장합니다.
"""

from __future__ import annotations

from database.connection import insert_staged_job, upsert_raw_job
from normalizer.schema import StandardJob
from utils.filters import should_include_job
from utils.logger import get_logger

logger = get_logger("normalizer")


def save_standard_job(conn, job: StandardJob) -> dict:
    """
    StandardJob을 받아 raw_jobs (+ 조건 충족 시 staged_jobs)에 저장.

    Returns:
        {
            "is_new":     bool,   # raw_jobs에 새로 저장됐는지
            "is_staged":  bool,   # staged_jobs에 저장됐는지
            "raw_id":     int,    # raw_jobs PK
            "staged_id":  int | None,
        }
    """
    # 비자 키워드 + 위치 필터 (수집기가 이미 필터했으면 job.is_staged=True)
    if job.is_staged:
        include = True
        matched_keywords = job.visa_keywords
    else:
        include, matched_keywords = should_include_job(
            title=job.title,
            description=job.description or job.description_raw,
            location=job.location_raw,
            force_visa_positive=False,
        )

    # ── raw_jobs 저장 ──
    raw_id, is_new = upsert_raw_job(
        conn,
        source_site=job.source_site,
        external_id=job.external_id,
        url=job.apply_url,
        title=job.title,
        company=job.company,
        location_raw=job.location_raw,
        raw_data=job.raw_data,
        visa_keywords=matched_keywords,
        is_staged=include,
    )

    if not is_new:
        return {"is_new": False, "is_staged": False, "raw_id": raw_id, "staged_id": None}

    if not include:
        logger.debug(f"[SKIP] {job.source_site} | {job.title[:50]} — 키워드/위치 불일치")
        return {"is_new": True, "is_staged": False, "raw_id": raw_id, "staged_id": None}

    # ── staged_jobs 저장 ──
    staged_id = insert_staged_job(
        conn,
        raw_job_id=raw_id,
        source_site=job.source_site,
        title=job.title,
        company=job.company,
        location=job.effective_location(),
        is_remote=job.is_remote,
        job_type=job.job_type,
        salary_min=job.salary_min,
        salary_max=job.salary_max,
        salary_currency=job.salary_currency,
        salary_period=job.salary_period,
        description=job.description,
        apply_url=job.apply_url,
        posted_at=job.posted_at,
        visa_keywords=matched_keywords,
    )

    logger.info(
        f"[NEW] {job.source_site} | {job.company or '?'} | {job.title[:50]} "
        f"| keywords={matched_keywords}"
    )
    return {"is_new": True, "is_staged": True, "raw_id": raw_id, "staged_id": staged_id}


