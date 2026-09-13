# Capture Test

- Tool: Codex desktop. The two independent canary sessions were run through the installed Codex CLI, which uses the same project hook configuration.
- Model: `gpt-5.6-terra` (verified in both canary session banners). It performed both planning and execution; there was no separate planning model.
- Mechanism: `.codex/hooks.json` registers the Codex `UserPromptSubmit` and `Stop` lifecycle events. `.codex/hooks/capture_8x.py` receives their JSON event payloads, pairs the verbatim prompt with the final assistant message by `session_id` and `turn_id`, and appends the pair to `.agent-logs/`.
- Canary logs:
  - `.agent-logs/2026-09-13_16-30-17_01a09b9a-d944-7e10-9154-c5de9ee635b4.md`
  - `.agent-logs/2026-09-13_16-30-52_01a09b9b-6181-7103-88ad-f066108321ee.md`
- Final implementation recheck: `.agent-logs/2026-09-13_16-33-06_01a09b9d-6db3-7dc1-a73d-5ab70ac4a4ed.md` also captured its complete pair after transient pairing state was moved outside the repository.
- First attempt that did not work: the first canary launch ran in the filesystem sandbox and Codex could not write its session-state database under `~/.codex` (`attempt to write a readonly database`). It did not send a prompt and created no capture entry. The subsequent independent canary launches were permitted outside that sandbox, with hook trust explicitly bypassed solely for the test.

## Canary 1 — raw entries

```text
[LOG_ENTRY type=PROMPT num=1 session=01a09b9a-d944-7e10-9154-c5de9ee635b4]
timestamp: 2026-09-13T16:30:17.418Z
model: gpt-5.6-terra

CAPTURE TEST — 8x assignment, Codex

[LOG_ENTRY type=RESPONSE num=1 session=01a09b9a-d944-7e10-9154-c5de9ee635b4]
timestamp: 2026-09-13T16:30:20.722Z
model: gpt-5.6-terra

Capture test received: “8x assignment, Codex.”
```

## Canary 2 — raw entries

```text
[LOG_ENTRY type=PROMPT num=1 session=01a09b9b-6181-7103-88ad-f066108321ee]
timestamp: 2026-09-13T16:30:52.193Z
model: gpt-5.6-terra

CAPTURE TEST — 8x assignment, Codex, session two

[LOG_ENTRY type=RESPONSE num=1 session=01a09b9b-6181-7103-88ad-f066108321ee]
timestamp: 2026-09-13T16:30:54.760Z
model: gpt-5.6-terra

Captured: “TEST — 8x assignment, Codex, session two.”
```
