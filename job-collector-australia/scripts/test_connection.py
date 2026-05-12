# -*- coding: utf-8 -*-
"""
scripts/test_connection.py — DB 연결 확인용 스크립트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사용법:
    python scripts/test_connection.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

load_dotenv()

from database.connection import get_db, run_migrations
from utils.logger import get_logger

logger = get_logger("test_connection")


def main() -> None:
    logger.info("DB 연결 테스트 시작...")

    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version()")
                version = cur.fetchone()[0]
                logger.info(f"✅ DB 연결 성공!")
                logger.info(f"   버전: {version[:50]}")

            logger.info("마이그레이션 실행 중...")
            run_migrations(conn)
            conn.commit()
            logger.info("✅ 마이그레이션 완료!")

            with conn.cursor() as cur:
                cur.execute("""
                    SELECT table_name FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_type = 'BASE TABLE'
                    ORDER BY table_name
                """)
                tables = [r[0] for r in cur.fetchall()]
                logger.info(f"   생성된 테이블: {tables}")

    except Exception as e:
        logger.error(f"❌ 연결 실패: {e}")
        logger.error("   DATABASE_URL 환경변수를 확인하세요.")
        sys.exit(1)

    logger.info("모든 확인 완료. 수집 준비 완료!")


if __name__ == "__main__":
    main()


