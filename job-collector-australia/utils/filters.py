# -*- coding: utf-8 -*-
"""
utils/filters.py — 비자 키워드 및 위치 필터 유틸리티
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
모든 수집기가 공통으로 사용하는 필터 함수 모음.
키워드는 config/settings.py 에서 수정하세요.
"""

from __future__ import annotations

from config.settings import (
    AUSTRALIA_LOCATION_KEYWORDS,
    STRICT_LOCATION_FILTER,
    VISA_NEGATIVE_KEYWORDS,
    VISA_POSITIVE_KEYWORDS,
)


def normalize_text(text: str | None) -> str:
    """비교용 소문자 텍스트로 변환"""
    if not text:
        return ""
    return text.lower().strip()


def is_australia_location(location: str | None) -> bool:
    """
    location 문자열이 호주 관련 지역인지 확인.

    Args:
        location: 공고의 위치 문자열 (예: "Sydney, AU", "Remote - Australia")

    Returns:
        True if location suggests Australia
    """
    loc = normalize_text(location)
    if not loc:
        return False

    return any(kw in loc for kw in AUSTRALIA_LOCATION_KEYWORDS)


def find_matching_visa_keywords(title: str | None, description: str | None) -> list[str]:
    """
    공고 제목 + 설명에서 매칭된 비자 키워드 목록 반환.

    Returns:
        매칭된 키워드 리스트 (없으면 빈 리스트)
    """
    combined = normalize_text(title) + " " + normalize_text(description)
    return [kw for kw in VISA_POSITIVE_KEYWORDS if kw in combined]


def has_negative_keywords(title: str | None, description: str | None) -> bool:
    """
    비자 스폰서 불가를 명시하는 부정 키워드가 있는지 확인.

    Returns:
        True if negative keywords found (= 제외 대상)
    """
    combined = normalize_text(title) + " " + normalize_text(description)
    return any(kw in combined for kw in VISA_NEGATIVE_KEYWORDS)


def should_include_job(
    title: str | None,
    description: str | None,
    location: str | None,
    force_visa_positive: bool = False,
) -> tuple[bool, list[str]]:
    """
    공고 포함 여부를 최종 판단하는 메인 필터 함수.

    Args:
        title:               공고 제목
        description:         공고 설명 전문
        location:            공고 위치 문자열
        force_visa_positive: True면 비자 키워드 없어도 통과 (API가 이미 필터했을 때)

    Returns:
        (include: bool, matched_keywords: list[str])
        - include=True  → staged_jobs에 저장
        - include=False → raw_jobs에만 저장 (중복 방지 기록용)
    """
    # 1. 부정 키워드 체크 — 발견 즉시 제외
    if has_negative_keywords(title, description):
        return False, []

    # 2. 비자 키워드 매칭
    matched = find_matching_visa_keywords(title, description)

    if not force_visa_positive and not matched:
        return False, []

    # 3. 위치 필터
    if STRICT_LOCATION_FILTER:
        if not is_australia_location(location):
            return False, matched

    return True, matched


