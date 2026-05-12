# -*- coding: utf-8 -*-
"""
scripts/export_csv.py — staged_jobs를 CSV로 내보내기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사용법:
    python scripts/export_csv.py
    python scripts/export_csv.py --days 7          ← 최근 7일치만
    python scripts/export_csv.py --out jobs.csv    ← 파일명 지정
    python scripts/export_csv.py --all             ← 전체 (visa_status 무관)
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

load_dotenv()

from database.connection import get_db
from utils.logger import get_logger

logger = get_logger("export_csv")


def export(days: int | None, output: str, include_all: bool) -> None:
    """
    staged_jobs를 CSV로 내보내기.

    Args:
        days:        최근 N일치만 내보내기 (None = 전체)
        output:      출력 파일 경로
        include_all: True면 visa_status 필터 없이 전체 출력
    """
    with get_db() as conn:
        with conn.cursor() as cur:
            conditions = []
            params: list = []

            if days:
                cutoff = datetime.now(tz=timezone.utc) - timedelta(days=days)
                conditions.append("normalized_at >= %s")
                params.append(cutoff)

            where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

            cur.execute(f"""
                SELECT
                    s.id,
                    s.source_site,
                    s.title,
                    s.company,
                    s.location,
                    s.is_remote,
                    s.job_type,
                    s.salary_min,
                    s.salary_max,
                    s.salary_currency,
                    s.apply_url,
                    s.posted_at,
                    s.normalized_at,
                    array_to_string(s.visa_keywords, ', ') AS visa_keywords,
                    s.visa_status,
                    s.confidence_score,
                    LEFT(s.description, 300) AS description_preview
                FROM staged_jobs s
                {where}
                ORDER BY s.normalized_at DESC
            """, params)

            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]

    if not rows:
        logger.warning("내보낼 공고가 없습니다.")
        return

    with open(output, "w", newline="", encoding="utf-8-sig") as f:  # utf-8-sig = Excel 한글 호환
        writer = csv.writer(f)
        writer.writerow(columns)
        writer.writerows(rows)

    logger.info(f"{len(rows)}개 공고 → {output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="staged_jobs CSV 내보내기")
    parser.add_argument("--days",  type=int, default=None, help="최근 N일치 (기본: 전체)")
    parser.add_argument("--out",   default="staged_jobs_export.csv", help="출력 파일명")
    parser.add_argument("--all",   action="store_true", help="visa_status 필터 없이 전체")
    args = parser.parse_args()

    export(days=args.days, output=args.out, include_all=args.all)


