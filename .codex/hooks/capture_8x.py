#!/usr/bin/env python3
"""Write one immutable prompt/final-response pair per completed Codex turn."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import UTC, datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LOG_DIR = ROOT / ".agent-logs"
STATE_DIR = Path(tempfile.gettempdir()) / "codex-8x-capture-state" / re.sub(
    r"[^A-Za-z0-9._-]", "-", str(ROOT)
)


def utc_now() -> str:
    return datetime.now(UTC).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def clean_filename(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]", "-", value)


def git_author() -> str:
    return "SyedMuhammadHuzaiffa"


def state_path(session_id: str) -> Path:
    return STATE_DIR / f"{clean_filename(session_id)}.json"


def read_state(session_id: str) -> dict:
    path = state_path(session_id)
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def write_state(session_id: str, state: dict) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    path = state_path(session_id)
    temp_path = path.with_suffix(".tmp")
    temp_path.write_text(json.dumps(state, ensure_ascii=False), encoding="utf-8")
    temp_path.replace(path)


def new_log(session_id: str, model: str, timestamp: str) -> Path:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    day, clock = timestamp.split("T", 1)
    filename = f"{day}_{clock[:8].replace(':', '-')}_{clean_filename(session_id)}.md"
    path = LOG_DIR / filename
    header = (
        "---\n"
        f"session_id: {session_id}\n"
        f"date: {day}\n"
        f"author: {git_author()}\n"
        f"model: {model}\n"
        "tool: codex-desktop\n"
        f"project: {ROOT.name}\n"
        "total_exchanges: 0\n"
        f"first_prompt_time: {timestamp}\n"
        f"last_prompt_time: {timestamp}\n"
        "---\n\n"
        f"# Session Log - {day}\n\n"
        f"Session: `{session_id}` | Project: `{ROOT.name}` | Author: `{git_author()}`\n\n"
        "---\n"
    )
    path.write_text(header, encoding="utf-8")
    return path


def update_header(path: Path, exchanges: int, last_prompt_time: str) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"(?m)^total_exchanges: .*?$", f"total_exchanges: {exchanges}", text, count=1)
    text = re.sub(r"(?m)^last_prompt_time: .*?$", f"last_prompt_time: {last_prompt_time}", text, count=1)
    path.write_text(text, encoding="utf-8")


def handle_prompt(event: dict) -> None:
    session_id = str(event.get("session_id", "unknown-session"))
    turn_id = str(event.get("turn_id", "unknown-turn"))
    timestamp = utc_now()
    model = str(event.get("model") or "unknown")
    state = read_state(session_id)
    if not state:
        log_path = new_log(session_id, model, timestamp)
        state = {"log_path": str(log_path), "exchanges": 0, "pending": {}}
    state.setdefault("pending", {})[turn_id] = {
        "prompt": event.get("prompt", ""),
        "timestamp": timestamp,
        "model": model,
    }
    write_state(session_id, state)


def handle_stop(event: dict) -> None:
    session_id = str(event.get("session_id", "unknown-session"))
    turn_id = str(event.get("turn_id", "unknown-turn"))
    state = read_state(session_id)
    pending = state.get("pending", {}).pop(turn_id, None)
    if not pending:
        return
    path = Path(state["log_path"])
    exchange = int(state.get("exchanges", 0)) + 1
    response_timestamp = utc_now()
    response_model = str(event.get("model") or pending["model"])
    response = event.get("last_assistant_message") or ""
    entry = (
        f"\n[LOG_ENTRY type=PROMPT num={exchange} session={session_id}]\n"
        f"timestamp: {pending['timestamp']}\n"
        f"model: {pending['model']}\n\n"
        f"{pending['prompt']}\n\n"
        f"[LOG_ENTRY type=RESPONSE num={exchange} session={session_id}]\n"
        f"timestamp: {response_timestamp}\n"
        f"model: {response_model}\n\n"
        f"{response}\n"
    )
    with path.open("a", encoding="utf-8") as log:
        log.write(entry)
    state["exchanges"] = exchange
    update_header(path, exchange, pending["timestamp"])
    write_state(session_id, state)


def main() -> int:
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0
    if event.get("hook_event_name") == "UserPromptSubmit":
        handle_prompt(event)
    elif event.get("hook_event_name") == "Stop":
        handle_stop(event)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
