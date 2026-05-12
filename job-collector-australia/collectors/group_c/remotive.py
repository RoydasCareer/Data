# -*- coding: utf-8 -*-
"""
collectors/group_c/remotive.py — Remotive 수집기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API: https://remotive.com/api/remote-jobs
문서: https://remotive.com/remote-jobs/rss-feed

특징:
  - search 파라미터로 키워드 검색 가능
  - candidate_required_location으로 위치 필터 가능
  - 단일 페이지 응답 (페이지네이션 없음)
  - 인증 불필요

커스터마이징 포인트:
  - SEARCH_QUERIES: 검색할 키워드 목록
  - CATEGORY: 특정 직군만 수집 (빈 문자열 = 전체)
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Iterator

from dateutil import parser as dateparser

from collectors.base import BaseCollector
from normalizer.schema import StandardJob, parse_job_type

# ── 수집기 설정 ────────────────────────────
# 여러 쿼리를 순서대로 실행해 결과를 합산
SEARCH_QUERIES: list[str] = [
    "visa sponsorship australia",
    "sponsor australia",
    "work visa australia",
]
# 직군 필터 (예: "software-dev", "devops-sysadmin") — 빈 문자열 = 전체
CATEGORY: str = ""
API_URL = "https://remotive.com/api/remote-jobs"
# ──────────────────────────────────────────


class RemotiveCollector(BaseCollector):
    site_name = "remotive"

    def fetch(self) -> Iterator[StandardJob]:
        seen_ids: set[str] = set()  # 쿼리 중복 방지

        for query in SEARCH_QUERIES:
            params: dict = {"search": query, "limit": 100}
            if CATEGORY:
                params["category"] = CATEGORY

            self.logger.info(f"검색: '{query}'")
            try:
                data = self.get_json(API_URL, params=params)
            except Exception as e:
                self.logger.error(f"쿼리 실패: '{query}' — {e}")
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
        if pub := item.get("publication_date"):
            try:
                posted_at = dateparser.parse(pub)
                if posted_at and posted_at.tzinfo is None:
                    posted_at = posted_at.replace(tzinfo=timezone.utc)
            except Exception:
                pass

        # candidate_required_location으로 호주 관련 공고 판별
        location = item.get("candidate_required_location", "")

        return StandardJob(
            source_site   = self.site_name,
            external_id   = str(item.get("id", "")),
            raw_data      = item,
            title         = item.get("title", ""),
            company       = item.get("company_name"),
            location_raw  = location,
            apply_url     = item.get("url"),
            posted_at     = posted_at,
            is_remote     = True,  # Remotive는 전부 리모트
            job_type      = parse_job_type(item.get("job_type")),
            salary_min    = None,  # salary는 자유 형식 텍스트라 파싱 생략
            description_raw = item.get("description"),
        )


