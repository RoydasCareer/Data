# -*- coding: utf-8 -*-
"""
normalizer/schema.py — 정규화된 공고의 표준 스키마
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
모든 수집기는 이 스키마로 변환 후 DB에 저장합니다.
새 수집기를 추가할 때 이 스키마를 채우는 매핑 함수만 작성하면 됩니다.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


JobType = Literal["full_time", "part_time", "contract", "internship", "freelance", "other"] | None
RemoteType = Literal["remote", "hybrid", "onsite"] | None


def strip_html(text: str | None) -> str | None:
    """HTML 태그 제거 및 공백 정리."""
    if not text:
        return None
    clean = re.sub(r"<[^>]+>", " ", text)
    clean = re.sub(r"&nbsp;", " ", clean)
    clean = re.sub(r"&amp;", "&", clean)
    clean = re.sub(r"&lt;", "<", clean)
    clean = re.sub(r"&gt;", ">", clean)
    clean = re.sub(r"&quot;", '"', clean)
    clean = re.sub(r"\s{2,}", " ", clean)
    return clean.strip() or None


def parse_job_type(raw: str | None) -> JobType:
    """다양한 job_type 문자열을 표준 값으로 변환."""
    if not raw:
        return None
    r = raw.lower().replace("-", "_").replace(" ", "_")
    if "full" in r:
        return "full_time"
    if "part" in r:
        return "part_time"
    if "contract" in r:
        return "contract"
    if "intern" in r:
        return "internship"
    if "freelance" in r or "freelancer" in r:
        return "freelance"
    return "other"


class StandardJob(BaseModel):
    """
    수집기 → DB 사이의 공통 데이터 컨테이너.

    수집기에서 이 모델을 채운 뒤 normalizer.py의
    save_standard_job()을 호출하면 raw_jobs + staged_jobs에 저장됩니다.
    """

    # ── 필수 식별 정보 ──
    source_site:    str           = Field(..., description="수집 사이트명 (예: 'arbeitnow')")
    external_id:    str           = Field(..., description="사이트 내 고유 공고 ID")
    raw_data:       dict          = Field(..., description="API 원본 응답 (변경 없이 저장)")

    # ── 공고 기본 정보 ──
    title:          str           = Field(..., description="공고 제목")
    company:        str | None    = None
    location_raw:   str | None    = None          # 원본 위치 문자열
    location:       str | None    = None          # 정규화된 위치 (비어 있으면 location_raw 사용)
    apply_url:      str | None    = None
    posted_at:      datetime | None = None

    # ── 근무 조건 ──
    is_remote:      bool | None   = None
    job_type:       JobType       = None

    # ── 급여 ──
    salary_min:     int | None    = None
    salary_max:     int | None    = None
    salary_currency: str          = "AUD"
    salary_period:  str           = "year"        # year | month | hour

    # ── 공고 내용 ──
    description_raw: str | None   = None          # HTML 포함 원본
    description:    str | None    = None          # HTML 제거된 순수 텍스트 (없으면 자동 변환)

    # ── 비자 관련 (필터 결과) ──
    visa_keywords:  list[str]     = Field(default_factory=list)
    is_staged:      bool          = False         # 비자 키워드 매칭 통과 여부

    @field_validator("description", mode="before")
    @classmethod
    def clean_description(cls, v, info):
        """description이 없으면 description_raw에서 HTML 제거해서 채움."""
        if v:
            return strip_html(v)
        # info.data에서 description_raw 접근 (Pydantic v2)
        raw = info.data.get("description_raw") if hasattr(info, "data") else None
        return strip_html(raw) if raw else None

    def effective_location(self) -> str | None:
        """저장에 사용할 최종 위치 문자열."""
        return self.location or self.location_raw


