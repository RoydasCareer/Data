# -*- coding: utf-8 -*-
"""
scripts/stats.py — 수집 현황 조회
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사용법:
    python scripts/stats.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

load_dotenv()

from database.connection import get_db
from utils.logger import get_logger

logger = get_logger("stats")


def print_stats() -> None:
    with get_db() as conn:
        with conn.cursor() as cur:

            # ── 사이트별 수집 현황 ──
            cur.execute("SELECT * FROM collection_summary")
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description]

            print("\n" + "═" * 90)
            print("  사이트별 수집 현황")
            print("═" * 90)
            fmt = "{:<22} {:>8} {:>8} {:>10} {:>9} {:>12} {:>10}"
            print(fmt.format(*cols))
            print("─" * 90)
            for row in rows:
                print(fmt.format(*[
                    (str(v)[:22] if v is not None else "-") for v in row
                ]))

            # ── AI 검수 대기 현황 ──
            cur.execute("SELECT COUNT(*) FROM staged_jobs WHERE visa_status IS NULL")
            pending = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM staged_jobs WHERE visa_status = 'confirmed'")
            confirmed = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM staged_jobs WHERE visa_status = 'possible'")
            possible = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM staged_jobs WHERE visa_status = 'no'")
            no_sponsor = cur.fetchone()[0]

            print("\n" + "═" * 60)
            print("  staged_jobs 전체 현황")
            print("═" * 60)
            print(f"  AI 검수 대기:      {pending:>6}개")
            print(f"  확정 (confirmed):  {confirmed:>6}개")
            print(f"  가능성 (possible): {possible:>6}개")
            print(f"  제외 (no):         {no_sponsor:>6}개")

            # ── 최근 수집 실행 기록 ──
            cur.execute("""
                SELECT started_at, status, total_fetched, total_new_raw, total_staged, trigger
                FROM collection_runs
                ORDER BY started_at DESC
                LIMIT 5
            """)
            runs = cur.fetchall()

            if runs:
                print("\n" + "═" * 90)
                print("  최근 수집 실행 기록 (최대 5개)")
                print("═" * 90)
                print(f"  {'시작 시각':<25} {'상태':<10} {'가져옴':>8} {'신규':>6} {'저장됨':>8} {'트리거'}")
                print("─" * 90)
                for r in runs:
                    print(f"  {str(r[0])[:24]:<25} {str(r[1]):<10} {r[2]:>8} {r[3]:>6} {r[4]:>8}  {r[5]}")

            print()


if __name__ == "__main__":
    print_stats()


