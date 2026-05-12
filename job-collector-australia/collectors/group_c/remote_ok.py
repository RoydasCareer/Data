# -*- coding: utf-8 -*-
"""
collectors/group_c/remote_ok.py — Remote OK 수집기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API: https://remoteok.com/api
문서: https://remoteok.com/api

특징:
  - 전체 공고 단일 JSON 반환 (검색 파라미터 없음)
  - 클라이언트 사이드 키워드 필터 필요
  - 첫 번째 원소는 메타데이터 (skip)
  - tags 배열에 키워드 포함됨
  - 인증 불필요

커스터마이징 포인트:
  - FILTER_TAGS: 이 태그가 있는 공고만 수집
  - MAX_AGE_DAYS: 최근 N일 이내 공고만 수집
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Iterator

from collectors.base import BaseCollector
from normalizer.schema import StandardJob

# ── 수집기 설정 ────────────────────────────
# 이 태그 중 하나라도 있는 공고 포함 (빈 리스트 = 태그 필터 없음)
FILTER_TAGS: list[str] = ["australia", "visa", "sponsor"]
# 최근 며칠 이내 공고만 수집 (0 = 무제한)
MAX_AGE_DAYS: int = 30
API_URL = "https://remoteok.com/api"
# ──────────────────────────────────────────


class RemoteOkCollector(BaseCollector):
    site_name = "remote_ok"

    def fetch(self) -> Iterator[StandardJob]:
        self.logger.info("전체 공고 목록 가져오는 중...")
        data = self.get_json(API_URL)

        # 첫 원소는 {legal: "..."} 메타데이터
        items = [item for item in data if isinstance(item, dict) and "id" in item]
        self.logger.info(f"총 {len(items)}개 공고 로드")

        cutoff = (
            datetime.now(tz=timezone.utc) - timedelta(days=MAX_AGE_DAYS)
            if MAX_AGE_DAYS else None
        )

        for item in items:
            # 날짜 필터
            if cutoff and (epoch := item.get("epoch")):
                try:
                    posted = datetime.fromtimestamp(int(epoch), tz=timezone.utc)
                    if posted < cutoff:
                        continue
                except (ValueError, TypeError):
                    pass

            # 태그 필터
            tags: list[str] = [t.lower() for t in (item.get("tags") or [])]
            if FILTER_TAGS and not any(ft in tags for ft in FILTER_TAGS):
                continue

            yield self._parse(item)

    def _parse(self, item: dict) -> StandardJob:
        posted_at = None
        if epoch := item.get("epoch"):
            try:
                posted_at = datetime.fromtimestamp(int(epoch), tz=timezone.utc)
            except (ValueError, TypeError):
                pass

        return StandardJob(
            source_site   = self.site_name,
            external_id   = str(item.get("id", "")),
            raw_data      = item,
            title         = item.get("position", ""),
            company       = item.get("company"),
            location_raw  = item.get("location"),
            apply_url     = item.get("url") or item.get("apply_url"),
            posted_at     = posted_at,
            is_remote     = True,
            description_raw = item.get("description"),
        )


