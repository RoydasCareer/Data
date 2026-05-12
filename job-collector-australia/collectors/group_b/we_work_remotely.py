# -*- coding: utf-8 -*-
"""
collectors/group_b/we_work_remotely.py — We Work Remotely 수집기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API: https://weworkremotely.com/remote-job-rss-feed
문서: https://weworkremotely.com/remote-job-rss-feed

특징:
  - RSS 피드 파싱 (feedparser 라이브러리 사용)
  - 카테고리별 피드 URL 제공 (전체 / 프로그래밍 / 디자인 등)
  - 검색 기능 없음 → 클라이언트 사이드 키워드 필터링
  - 인증 불필요

커스터마이징 포인트:
  - FEED_URLS: 수집할 RSS 피드 목록
    전체: https://weworkremotely.com/remote-jobs.rss
    프로그래밍: https://weworkremotely.com/categories/remote-programming-jobs.rss
    디자인: https://weworkremotely.com/categories/remote-design-jobs.rss
    경영: https://weworkremotely.com/categories/remote-management-jobs.rss
    마케팅: https://weworkremotely.com/categories/remote-marketing-jobs.rss
    운영: https://weworkremotely.com/categories/remote-operations-jobs.rss
    고객지원: https://weworkremotely.com/categories/remote-customer-support-jobs.rss
    영업: https://weworkremotely.com/categories/remote-sales-jobs.rss
"""

from __future__ import annotations

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Iterator

import feedparser

from collectors.base import BaseCollector
from normalizer.schema import StandardJob

# ── 수집기 설정 ────────────────────────────
FEED_URLS: list[str] = [
    "https://weworkremotely.com/remote-jobs.rss",
    # 필요한 카테고리 피드를 추가하세요:
    # "https://weworkremotely.com/categories/remote-programming-jobs.rss",
]
# ──────────────────────────────────────────


class WeWorkRemotelyCollector(BaseCollector):
    site_name = "we_work_remotely"

    def fetch(self) -> Iterator[StandardJob]:
        seen_ids: set[str] = set()

        for feed_url in FEED_URLS:
            self.logger.info(f"피드 파싱: {feed_url}")
            try:
                feed_text = self.get_text(feed_url)
                feed = feedparser.parse(feed_text)
            except Exception as e:
                self.logger.error(f"피드 로드 실패: {feed_url} — {e}")
                continue

            self.logger.info(f"  → {len(feed.entries)}개 항목")
            for entry in feed.entries:
                entry_id = entry.get("id") or entry.get("link", "")
                if entry_id in seen_ids:
                    continue
                seen_ids.add(entry_id)
                yield self._parse(entry)

    def _parse(self, entry) -> StandardJob:
        # 날짜 파싱
        posted_at = None
        if pub := entry.get("published"):
            try:
                posted_at = parsedate_to_datetime(pub)
            except Exception:
                try:
                    from dateutil import parser as dp
                    posted_at = dp.parse(pub)
                except Exception:
                    pass

        if posted_at and posted_at.tzinfo is None:
            posted_at = posted_at.replace(tzinfo=timezone.utc)

        # 제목에서 회사명 추출 (형식: "Company: Job Title")
        raw_title: str = entry.get("title", "")
        if ": " in raw_title:
            company, title = raw_title.split(": ", 1)
        else:
            company, title = None, raw_title

        # region 태그에서 위치 추출
        tags = entry.get("tags", [])
        location_raw = None
        for tag in tags:
            term = tag.get("term", "")
            # WWR은 region을 태그로 표시 (예: "Anywhere", "USA Only", "Australia")
            if term and term.lower() not in ("full-time", "part-time", "contract"):
                location_raw = term
                break

        # 링크에서 external_id 추출
        link: str = entry.get("link", "")
        # https://weworkremotely.com/remote-jobs/view/12345
        external_id = link.rstrip("/").split("/")[-1] if link else entry.get("id", "")

        return StandardJob(
            source_site   = self.site_name,
            external_id   = str(external_id),
            raw_data      = {
                "id":          external_id,
                "title":       entry.get("title", ""),
                "link":        link,
                "published":   entry.get("published", ""),
                "summary":     entry.get("summary", ""),
                "tags":        [t.get("term") for t in tags],
            },
            title         = title.strip(),
            company       = company.strip() if company else None,
            location_raw  = location_raw,
            apply_url     = link,
            posted_at     = posted_at,
            is_remote     = True,
            description_raw = entry.get("summary", ""),
        )


