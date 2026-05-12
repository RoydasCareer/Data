# -*- coding: utf-8 -*-
"""
collectors/group_c/jobicy.py — Jobicy 수집기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API: https://jobicy.com/api/v2/remote-jobs
문서: https://jobicy.com/jobs-rss-feed

특징:
  - geo 파라미터로 호주(australia) 필터 가능
  - tag 파라미터로 키워드 검색 가능
  - count 파라미터로 최대 50개 제한
  - industry 파라미터로 직군 필터 가능
  - 인증 불필요

커스터마이징 포인트:
  - GEO: 위치 필터 ("australia" 고정 권장)
  - TAGS: 검색 태그 목록
  - COUNT: 한 번에 가져올 공고 수 (최대 50)
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Iterator

from dateutil import parser as dateparser

from collectors.base import BaseCollector
from normalizer.schema import StandardJob, parse_job_type

# ── 수집기 설정 ────────────────────────────
GEO: str = "australia"       # 지역 필터 — 빈 문자열이면 전체
COUNT: int = 50              # 최대 50
# 여러 태그로 순차 검색 (결과 합산)
TAGS: list[str] = [
    "visa sponsorship",
    "sponsor",
]
API_URL = "https://jobicy.com/api/v2/remote-jobs"
# ──────────────────────────────────────────


class JobicyCollector(BaseCollector):
    site_name = "jobicy"

    def fetch(self) -> Iterator[StandardJob]:
        seen_ids: set[str] = set()

        for tag in TAGS:
            params: dict = {"count": COUNT, "tag": tag}
            if GEO:
                params["geo"] = GEO

            self.logger.info(f"태그='{tag}', geo='{GEO}' 검색 중...")
            try:
                data = self.get_json(API_URL, params=params)
            except Exception as e:
                self.logger.error(f"요청 실패: {e}")
                continue

            jobs: list[dict] = data.get("jobs", [])
            self.logger.info(f"  → {len(jobs)}개 공고")

            for item in jobs:
                job_id = str(item.get("id", ""))
                if job_id in seen_ids:
                    continue
                seen_ids.add(job_id)
                yield self._parse(item)

    def _parse(self, item: dict) -> StandardJob:
        posted_at = None
        if pub := item.get("pubDate"):
            try:
                posted_at = dateparser.parse(pub)
                if posted_at and posted_at.tzinfo is None:
                    posted_at = posted_at.replace(tzinfo=timezone.utc)
            except Exception:
                pass

        # salary 파싱 시도
        salary_min, salary_max = None, None
        if salary := item.get("annualSalaryMin"):
            try:
                salary_min = int(float(salary))
            except (ValueError, TypeError):
                pass
        if salary := item.get("annualSalaryMax"):
            try:
                salary_max = int(float(salary))
            except (ValueError, TypeError):
                pass

        return StandardJob(
            source_site    = self.site_name,
            external_id    = str(item.get("id", "")),
            raw_data       = item,
            title          = item.get("jobTitle", ""),
            company        = item.get("companyName"),
            location_raw   = item.get("jobGeo") or GEO,
            apply_url      = item.get("url"),
            posted_at      = posted_at,
            is_remote      = True,
            job_type       = parse_job_type(item.get("jobType")),
            salary_min     = salary_min,
            salary_max     = salary_max,
            salary_currency= item.get("salaryCurrency", "AUD"),
            description_raw= item.get("jobDescription"),
        )


