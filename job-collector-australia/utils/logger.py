# -*- coding: utf-8 -*-
"""
utils/logger.py — 공통 로거
"""

import logging
import sys

from config.settings import LOG_LEVEL, LOG_PLAIN


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger  # 이미 설정된 경우 재사용

    level = getattr(logging, LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(level)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    if LOG_PLAIN:
        # GitHub Actions 친화적 포맷 (색상 없음)
        fmt = "[%(asctime)s] %(levelname)-8s %(name)s — %(message)s"
        datefmt = "%Y-%m-%d %H:%M:%S"
    else:
        fmt = "%(asctime)s \033[1m%(levelname)-8s\033[0m %(name)s — %(message)s"
        datefmt = "%H:%M:%S"

    handler.setFormatter(logging.Formatter(fmt, datefmt=datefmt))
    logger.addHandler(handler)
    logger.propagate = False
    return logger


