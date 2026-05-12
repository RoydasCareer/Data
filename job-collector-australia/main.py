# -*- coding: utf-8 -*-
"""
main.py — 수집 파이프라인 진입점
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GitHub Actions 또는 로컬에서 실행:
    python main.py
    python main.py --sites arbeitnow remotive   ← 특정 수집기만 실행
    python main.py --dry-run                    ← DB 저장 없이 테스트
    python main.py --migrate-only               ← DB 마이그레이션만 실행
"""

from __future__ import annotations

import argparse
import sys
import time
from datetime import datetime, timezone

from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드 (로컬 개발용)

from config.settings import ENABLED_COLLECTORS, REQUEST_DELAY_SECONDS
from database.connection import finish_run, get_db, run_migrations, start_run
from utils.logger import get_logger

logger = get_logger("main")


# ──────────────────────────────────────────
# 수집기 레지스트리 — 새 수집기 추가 시 여기에 등록
# ──────────────────────────────────────────
def get_all_collectors():
    """
    활성화된 수집기 인스턴스 목록 반환.

    새 수집기를 추가하는 방법:
        1. collectors/group_X/my_site.py 파일 생성 (BaseCollector 상속)
        2. 아래 REGISTRY에 등록
        3. config/settings.py의 ENABLED_COLLECTORS에 추가
    """
    from collectors.group_b.we_work_remotely import WeWorkRemotelyCollector
    from collectors.group_c.arbeitnow import ArbeitnowCollector
    from collectors.group_c.jobicy import JobicyCollector
    from collectors.group_c.remote_ok import RemoteOkCollector
    from collectors.group_c.remotive import RemotiveCollector

    REGISTRY = {
        "arbeitnow":        ArbeitnowCollector,
        "remotive":         RemotiveCollector,
        "remote_ok":        RemoteOkCollector,
        "jobicy":           JobicyCollector,
        "we_work_remotely": WeWorkRemotelyCollector,
    }

    collectors = []
    for name, cls in REGISTRY.items():
        if ENABLED_COLLECTORS.get(name, False):
            collectors.append(cls())

    return collectors, REGISTRY


# ──────────────────────────────────────────
# 메인 실행
# ──────────────────────────────────────────

def run(sites: list[str] | None = None, dry_run: bool = False) -> int:
    """
    수집 파이프라인 실행.

    Args:
        sites:   실행할 수집기 이름 목록 (None이면 활성화된 전체)
        dry_run: True면 DB에 저장하지 않고 로그만 출력

    Returns:
        exit code (0 = 성공, 1 = 부분 실패, 2 = 전체 실패)
    """
    started_at = datetime.now(tz=timezone.utc)
    logger.info("=" * 60)
    logger.info(f"  Visa Job Collector 시작: {started_at.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    logger.info(f"  dry_run={dry_run}")
    logger.info("=" * 60)

    collectors, registry = get_all_collectors()

    # sites 인수로 필터링
    if sites:
        unknown = set(sites) - set(registry.keys())
        if unknown:
            logger.error(f"알 수 없는 수집기: {unknown}")
            logger.info(f"사용 가능: {list(registry.keys())}")
            return 2

        collectors = [c for c in collectors if c.site_name in sites]
        # 비활성화된 수집기도 직접 지정 시 실행
        active_names = {c.site_name for c in collectors}
        for name in sites:
            if name not in active_names:
                logger.info(f"{name}이 비활성화 상태이지만 --sites 지정으로 강제 실행")
                collectors.append(registry[name]())

    if not collectors:
        logger.warning("실행할 수집기가 없습니다. config/settings.py의 ENABLED_COLLECTORS를 확인하세요.")
        return 2

    logger.info(f"실행 수집기: {[c.site_name for c in collectors]}")

    # ── DB 연결 및 마이그레이션 ──
    with get_db() as conn:
        if not dry_run:
            logger.info("DB 마이그레이션 확인 중...")
            run_migrations(conn)
            conn.commit()
            run_id = start_run(conn, trigger="manual" if sites else "scheduled")
            conn.commit()
        else:
            run_id = None

        # ── 수집기 순차 실행 ──
        all_stats = []
        site_errors: list[str] = []

        for i, collector in enumerate(collectors):
            try:
                if dry_run:
                    logger.info(f"[DRY-RUN] {collector.site_name} 수집 시뮬레이션")
                    count = 0
                    for job in collector.fetch():
                        count += 1
                        if count <= 3:
                            logger.info(f"  예시: {job.title[:60]} | {job.company} | {job.location_raw}")
                    logger.info(f"[DRY-RUN] {collector.site_name} 총 {count}개 공고 발견")
                    all_stats.append({"site": collector.site_name, "fetched": count,
                                      "new_raw": 0, "staged": 0, "skipped": 0, "errors": 0})
                else:
                    stats = collector.run(conn)
                    all_stats.append(stats)

            except Exception as e:
                error_msg = f"{collector.site_name}: {e}"
                site_errors.append(error_msg)
                logger.error(f"수집기 실패: {error_msg}", exc_info=True)
                all_stats.append({"site": collector.site_name, "fetched": 0,
                                   "new_raw": 0, "staged": 0, "skipped": 0, "errors": 1})

            # 수집기 간 딜레이 (마지막 사이트는 생략)
            if i < len(collectors) - 1:
                logger.info(f"{REQUEST_DELAY_SECONDS}초 대기 중...")
                time.sleep(REQUEST_DELAY_SECONDS)

        # ── 최종 통계 출력 ──
        logger.info("=" * 60)
        logger.info("  수집 완료 요약")
        logger.info("=" * 60)

        total_fetched = total_new_raw = total_staged = 0
        for s in all_stats:
            logger.info(
                f"  {s['site']:<22} | "
                f"가져옴={s['fetched']:>4} | "
                f"신규={s['new_raw']:>4} | "
                f"저장={s['staged']:>4} | "
                f"중복={s['skipped']:>4} | "
                f"오류={s['errors']:>2}"
            )
            total_fetched += s["fetched"]
            total_new_raw += s["new_raw"]
            total_staged  += s["staged"]

        logger.info("-" * 60)
        logger.info(f"  합계: 가져옴={total_fetched} | 신규={total_new_raw} | 저장됨={total_staged}")
        if site_errors:
            logger.warning(f"  실패 사이트 수: {len(site_errors)}")
            for err in site_errors:
                logger.warning(f"    ✗ {err}")
        logger.info("=" * 60)

        # ── 실행 로그 마무리 ──
        if not dry_run and run_id:
            sites_success = len(all_stats) - len(site_errors)
            status = (
                "success"  if not site_errors else
                "partial"  if sites_success > 0 else
                "failed"
            )
            finish_run(
                conn, run_id,
                status=status,
                sites_attempted=len(collectors),
                sites_success=sites_success,
                sites_failed=len(site_errors),
                total_fetched=total_fetched,
                total_new_raw=total_new_raw,
                total_staged=total_staged,
                error_messages=site_errors or None,
            )
            conn.commit()

    elapsed = (datetime.now(tz=timezone.utc) - started_at).total_seconds()
    logger.info(f"총 소요 시간: {elapsed:.1f}초")

    if not all_stats or all(s["errors"] == 1 for s in all_stats):
        return 2
    if site_errors:
        return 1
    return 0


# ──────────────────────────────────────────
# CLI 진입점
# ──────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Visa Job Collector — 호주 비자 스폰서 채용 공고 수집기"
    )
    parser.add_argument(
        "--sites", nargs="+", metavar="SITE",
        help="실행할 수집기 이름 (예: --sites arbeitnow remotive)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="DB 저장 없이 수집 테스트만 실행"
    )
    parser.add_argument(
        "--migrate-only", action="store_true",
        help="DB 마이그레이션만 실행하고 종료"
    )

    args = parser.parse_args()

    if args.migrate_only:
        logger.info("마이그레이션만 실행합니다...")
        with get_db() as conn:
            run_migrations(conn)
            conn.commit()
        logger.info("완료")
        sys.exit(0)

    exit_code = run(sites=args.sites, dry_run=args.dry_run)
    sys.exit(exit_code)


