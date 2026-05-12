# -*- coding: utf-8 -*-
"""
settings.py — 전체 설정 파일
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
여기서 수집 범위, 필터 조건, 동작 방식을 모두 제어합니다.
코드 수정 없이 이 파일만 편집해서 대부분의 커스터마이징이 가능합니다.
"""

from __future__ import annotations

# ──────────────────────────────────────────
# 활성화할 수집기 (True = 실행, False = 건너뜀)
# ──────────────────────────────────────────
ENABLED_COLLECTORS = {
    "arbeitnow":        True,   # Group C | visa_sponsorship 파라미터 지원
    "remotive":         True,   # Group C | 글로벌 리모트 전문
    "remote_ok":        True,   # Group C | JSON API
    "jobicy":           True,   # Group C | geo 파라미터 지원
    "we_work_remotely": True,   # Group B | RSS 피드
}

# ──────────────────────────────────────────
# 위치 필터 (호주 한정)
# ──────────────────────────────────────────

# True  → location 필드에 아래 단어가 있는 공고만 수집
# False → 위치 무관 + 비자 키워드 매칭만으로 수집 (글로벌 리모트 포함)
STRICT_LOCATION_FILTER: bool = False

# 호주 관련 위치 키워드 (소문자 비교)
AUSTRALIA_LOCATION_KEYWORDS: list[str] = [
    "australia",
    "sydney",
    "melbourne",
    "brisbane",
    "perth",
    "adelaide",
    "canberra",
    "hobart",
    "darwin",
    "gold coast",
    "newcastle",
    "wollongong",
    "geelong",
    "cairns",
    "townsville",
    ", au",      # "Sydney, AU" 패턴
    "(au)",
    "(australia)",
]

# ──────────────────────────────────────────
# 비자 키워드 필터
# ──────────────────────────────────────────

# 이 키워드 중 하나라도 title 또는 description에 있으면 수집
VISA_POSITIVE_KEYWORDS: list[str] = [
    # 일반 비자 스폰서 표현
    "visa sponsorship",
    "visa sponsor",
    "sponsor visa",
    "sponsorship available",
    "sponsorship provided",
    "we sponsor",
    "we will sponsor",
    "employer sponsored",
    "employer will sponsor",
    "work visa",
    "work permit",
    "relocation assistance",
    "relocation support",
    "we support visa",
    # 호주 특화 비자 서브클래스
    "subclass 482",
    "482 visa",
    "tss visa",
    "subclass 186",
    "186 visa",
    "ens visa",
    "employer nomination",
    "subclass 494",
    "494 visa",
    "regional sponsored",
    "skilled sponsored",
    "labour agreement",
    # 기타
    "open to sponsorship",
    "willing to sponsor",
    "sponsorship considered",
]

# 이 키워드가 있으면 수집 제외 (명시적 스폰서 불가)
VISA_NEGATIVE_KEYWORDS: list[str] = [
    "no visa sponsorship",
    "no sponsorship",
    "sponsorship not available",
    "visa sponsorship is not available",
    "we do not sponsor",
    "we cannot sponsor",
    "cannot provide sponsorship",
    "must have full work rights",
    "must have working rights",
    "must be eligible to work in australia",
    "australian citizen or permanent resident",
    "citizen or permanent resident",
    "permanent resident or citizen",
    "pr or citizen",
    "citizen or pr",
    "no relocation",
]

# ──────────────────────────────────────────
# 수집 동작 설정
# ──────────────────────────────────────────

# 한 번 실행에 사이트당 최대 수집 공고 수 (0 = 무제한)
MAX_JOBS_PER_SITE: int = 200

# API 요청 간 대기 시간 (초) — 서버 부하 방지
REQUEST_DELAY_SECONDS: float = 1.5

# HTTP 타임아웃 (초)
HTTP_TIMEOUT_SECONDS: int = 30

# 수집 실패 시 재시도 횟수
MAX_RETRIES: int = 3

# ──────────────────────────────────────────
# 로그 설정
# ──────────────────────────────────────────

# DEBUG | INFO | WARNING | ERROR
LOG_LEVEL: str = "INFO"

# GitHub Actions에서는 True (색상 없는 로그)
LOG_PLAIN: bool = True


