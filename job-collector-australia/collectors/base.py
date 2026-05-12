# -*- coding: utf-8 -*-
"""
collectors/base.py — 수집기 추상 기반 클래스
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
새 수집기를 추가할 때는 이 클래스를 상속해서
fetch() 메서드만 구현하면 됩니다.
나머지 저장·필터·로깅은 BaseCollector가 처리합니다.
"""

from __future__ import annotations

import time
from abc import ABC, abstractmethod
from typing import Iterator

import httpx

from config.settings import HTTP_TIMEOUT_SECONDS, MAX_JOBS_PER_SITE, REQUEST_DELAY_SECONDS
from normalizer import StandardJob, save_standard_job
from utils.logger import get_logger


class BaseCollector(ABC):
    """
    모든 수집기의 기반 클래스.

    서브클래스에서 반드시 구현해야 할 것:
        - site_name (str): DB에 저장될 사이트 식별자
        - fetch() → Iterator[StandardJob]: 공고 스트림 반환

    선택 구현:
        - before_fetch(): 수집 전 초기화 (세션 셋업 등)
        - after_fetch():  수집 후 정리
    """

    # 서브클래스에서 반드시 지정
    site_name: str = ""

    def __init__(self) -> None:
        if not self.site_name:
            raise NotImplementedError("site_name을 지정하세요.")
        self.logger = get_logger(f"collector.{self.site_name}")
        self._client: httpx.Client | None = None

    # ──────────────────────────────────────────
    # HTTP 클라이언트 (공통)
    # ──────────────────────────────────────────

    @property
    def client(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(
                timeout=HTTP_TIMEOUT_SECONDS,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (compatible; VisaJobBot/1.0; "
                        "+https://github.com/your-org/visa-job-collector)"
                    ),
                    "Accept": "application/json",
                },
                follow_redirects=True,
            )
        return self._client

    def get_json(self, url: str, params: dict | None = None, retries: int = 3) -> dict | list:
        """
        JSON GET 요청. 실패 시 최대 retries 번 재시도.

        Args:
            url:     요청 URL
            params:  쿼리 파라미터
            retries: 재시도 횟수

        Returns:
            파싱된 JSON (dict 또는 list)

        Raises:
            httpx.HTTPError: 모든 재시도 실패 시
        """
        for attempt in range(1, retries + 1):
            try:
                resp = self.client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except (httpx.HTTPError, Exception) as e:
                self.logger.warning(f"요청 실패 (시도 {attempt}/{retries}): {url} — {e}")
                if attempt < retries:
                    time.sleep(REQUEST_DELAY_SECONDS * attempt)
        raise httpx.HTTPError(f"모든 재시도 실패: {url}")

    def get_text(self, url: str, retries: int = 3) -> str:
        """RSS/XML 등 텍스트 응답 GET."""
        for attempt in range(1, retries + 1):
            try:
                resp = self.client.get(url)
                resp.raise_for_status()
                return resp.text
            except (httpx.HTTPError, Exception) as e:
                self.logger.warning(f"요청 실패 (시도 {attempt}/{retries}): {url} — {e}")
                if attempt < retries:
                    time.sleep(REQUEST_DELAY_SECONDS * attempt)
        raise httpx.HTTPError(f"모든 재시도 실패: {url}")

    # ──────────────────────────────────────────
    # 서브클래스 구현 인터페이스
    # ──────────────────────────────────────────

    @abstractmethod
    def fetch(self) -> Iterator[StandardJob]:
        """
        API/피드에서 공고를 가져와 StandardJob으로 변환해 yield.

        예시:
            def fetch(self):
                data = self.get_json("https://api.example.com/jobs")
                for item in data["jobs"]:
                    yield StandardJob(
                        source_site=self.site_name,
                        external_id=str(item["id"]),
                        title=item["title"],
                        ...
                    )
        """
        ...

    def before_fetch(self) -> None:
        """수집 전 초기화 훅 (필요 시 오버라이드)."""

    def after_fetch(self) -> None:
        """수집 후 정리 훅 (필요 시 오버라이드)."""

    # ──────────────────────────────────────────
    # 실행 메서드 (외부에서 호출)
    # ──────────────────────────────────────────

    def run(self, conn) -> dict:
        """
        수집기 실행 진입점. main.py에서 호출합니다.

        Args:
            conn: 활성 DB 연결 (트랜잭션 커밋은 main.py가 관리)

        Returns:
            {
                "site":      str,
                "fetched":   int,  # API에서 받아온 공고 수
                "new_raw":   int,  # raw_jobs에 새로 저장된 수
                "staged":    int,  # staged_jobs에 저장된 수
                "skipped":   int,  # 중복 또는 필터 제외
                "errors":    int,  # 개별 공고 처리 오류
            }
        """
        self.logger.info(f"━━ 수집 시작: {self.site_name} ━━")
        stats = {"site": self.site_name, "fetched": 0, "new_raw": 0, "staged": 0, "skipped": 0, "errors": 0}

        try:
            self.before_fetch()

            for job in self.fetch():
                # 최대 수집 수 제한
                if MAX_JOBS_PER_SITE and stats["fetched"] >= MAX_JOBS_PER_SITE:
                    self.logger.info(f"최대 수집 수({MAX_JOBS_PER_SITE}) 도달, 중단")
                    break

                stats["fetched"] += 1

                try:
                    result = save_standard_job(conn, job)
                    conn.commit()  # 공고별 커밋 (중간 실패 시 손실 최소화)

                    if result["is_new"]:
                        stats["new_raw"] += 1
                        if result["is_staged"]:
                            stats["staged"] += 1
                    else:
                        stats["skipped"] += 1

                except Exception as e:
                    conn.rollback()
                    stats["errors"] += 1
                    self.logger.error(f"공고 저장 실패: {job.title[:40]} — {e}")

                time.sleep(0)  # 배치 내 딜레이 없음 (사이트 간 딜레이는 main.py에서)

        except Exception as e:
            self.logger.error(f"수집 중 치명적 오류: {e}", exc_info=True)
            raise
        finally:
            self.after_fetch()
            if self._client:
                self._client.close()
                self._client = None

        self.logger.info(
            f"━━ 완료: {self.site_name} | "
            f"가져옴={stats['fetched']} 새공고={stats['new_raw']} "
            f"저장됨={stats['staged']} 중복={stats['skipped']} 오류={stats['errors']} ━━"
        )
        return stats


