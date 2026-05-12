# -*- coding: utf-8 -*-
"""
collectors/group_c/arbeitnow.py — Arbeitnow 수집기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API: https://www.arbeitnow.com/api/job-board-api
문서: https://www.arbeitnow.com/api/job-board-api

특징:
  - visa_sponsorship=true 파라미터 지원 (API 레벨 필터)
  - 페이지네이션 지원 (page 파라미터)
  - 인증 불필요
  - location 필드에 국가 포함됨

커스터마이징 포인트:
  - FETCH_VISA_ONLY: False로 바꾸면 모든 공고 수집 후 키워드 필터
  - PAGE_LIMIT: 수집할 최대 페이지 수
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Iterator

from collectors.base import BaseCollector
from normalizer.schema import StandardJob, parse_job_type

# ── 수집기 설정 ────────────────────────────
FETCH_VISA_ONLY: bool = True   # True = API에 visa_sponsorship=true 전달
PAGE_LIMIT: int = 10           # 최대 페이지 수 (1페이지 = ~100개)
API_URL = "https://www.arbeitnow.com/api/job-board-api"
# ──────────────────────────────────────────


class ArbeitnowCollector(BaseCollector):
    site_name = "arbeitnow"

    def fetch(self) -> Iterator[StandardJob]:
        page = 1
        while page <= PAGE_LIMIT:
            params: dict = {"page": page}
            if FETCH_VISA_ONLY:
                params["visa_sponsorship"] = "true"

            self.logger.info(f"페이지 {page} 요청 중...")
            data = self.get_json(API_URL, params=params)

            jobs: list[dict] = data.get("data", [])
            if not jobs:
                self.logger.info("더 이상 공고 없음, 종료")
                break

            for item in jobs:
                yield self._parse(item)

            # 다음 페이지 링크 없으면 종료
            if not data.get("links", {}).get("next"):
                break

            page += 1

    def _parse(self, item: dict) -> StandardJob:
        """Arbeitnow API 응답 → StandardJob 변환."""
        # created_at은 Unix timestamp
        posted_at = None
        if ts := item.get("created_at"):
            try:
                posted_at = datetime.fromtimestamp(int(ts), tz=timezone.utc)
            except (ValueError, TypeError):
                pass

        # visa_sponsorship이 True면 API가 이미 필터한 것
        is_visa_confirmed = bool(item.get("visa_sponsorship"))

        return StandardJob(
            source_site   = self.site_name,
            external_id   = str(item.get("slug") or item.get("id", "")),
            raw_data      = item,
            title         = item.get("title", ""),
            company       = item.get("company_name"),
            location_raw  = item.get("location"),
            apply_url     = item.get("url"),
            posted_at     = posted_at,
            is_remote     = bool(item.get("remote")),
            job_type      = parse_job_type(
                            ", ".join(item.get("job_types", [])) if item.get("job_types") else None
                            ),
            description_raw = item.get("description"),
            # visa_sponsorship=True면 키워드 필터 없이 바로 staged 처리
            is_staged     = is_visa_confirmed and FETCH_VISA_ONLY,
            visa_keywords = ["visa sponsorship"] if is_visa_confirmed else [],
        )


