"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckSquare2,
  ChevronDown,
  Clock3,
  FileText,
  Flag,
  Headphones,
  ListChecks,
  Pause,
  Play,
  Settings2,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { Meeting } from "@/data/meetings";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";
import type { ShareableMoment } from "@/lib/sharing";
import { ShareDialog } from "@/components/share-dialog";

type SummaryTemplate = "enhanced" | "demo";

const summaryTemplates: Record<SummaryTemplate, { label: string; description: string }> = {
  enhanced: {
    label: "Enhanced",
    description: "Structured decisions, takeaways, and meeting context.",
  },
  demo: {
    label: "Demo",
    description: "A presentation-ready walkthrough with moments and follow-through.",
  },
};

function timestampToSeconds(timestamp: string) {
  return timestamp
    .split(":")
    .map(Number)
    .reduce((total, part) => total * 60 + part, 0);
}

function formatPlaybackTime(totalSeconds: number) {
  const rounded = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState<SummaryTemplate>("enhanced");
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<number>>(() => new Set());
  const [focusedTimestamp, setFocusedTimestamp] = useState<string | null>(null);
  const [shareTarget, setShareTarget] = useState<ShareableMoment | null | undefined>(undefined);
  const currentTimeRef = useRef(0);
  const transcriptRefs = useRef(new Map<string, HTMLLIElement>());
  const templateTimerRef = useRef<number | null>(null);
  const focusTimerRef = useRef<number | null>(null);

  const transcript = useMemo(
    () => meeting.transcript.map((line) => ({ ...line, seconds: timestampToSeconds(line.timestamp) })),
    [meeting.transcript],
  );

  const participantsByName = useMemo(
    () => new Map(meeting.participants.map((participant) => [participant.name, participant])),
    [meeting.participants],
  );

  const highlightedTimestamps = useMemo(
    () => new Set(meeting.highlights.map((highlight) => highlight.timestamp)),
    [meeting.highlights],
  );

  const actionItemsByTimestamp = useMemo(() => {
    const actions = new Map<string, string[]>();

    meeting.actionItems.forEach((action) => {
      if (!action.timestamp) return;
      actions.set(action.timestamp, [...(actions.get(action.timestamp) ?? []), action.task]);
    });

    return actions;
  }, [meeting.actionItems]);

  const activeIndex = transcript.findLastIndex((line) => line.seconds <= currentTime);
  const playbackProgress = (currentTime / meeting.durationSeconds) * 100;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      const nextTime = Math.min(currentTimeRef.current + 0.25, meeting.durationSeconds);
      currentTimeRef.current = nextTime;
      setCurrentTime(nextTime);
      if (nextTime >= meeting.durationSeconds) setIsPlaying(false);
    }, 250);

    return () => window.clearInterval(timer);
  }, [isPlaying, meeting.durationSeconds]);

  useEffect(() => () => {
    if (templateTimerRef.current) window.clearTimeout(templateTimerRef.current);
    if (focusTimerRef.current) window.clearTimeout(focusTimerRef.current);
  }, []);

  const seekTo = (seconds: number) => {
    const nextTime = Math.min(Math.max(seconds, 0), meeting.durationSeconds);
    currentTimeRef.current = nextTime;
    setCurrentTime(nextTime);
  };

  const seekToMoment = (timestamp: string) => {
    seekTo(timestampToSeconds(timestamp));
    setFocusedTimestamp(timestamp);

    window.requestAnimationFrame(() => {
      transcriptRefs.current.get(timestamp)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    if (focusTimerRef.current) window.clearTimeout(focusTimerRef.current);
    focusTimerRef.current = window.setTimeout(() => setFocusedTimestamp(null), 1600);
  };

  const togglePlayback = () => {
    if (currentTime >= meeting.durationSeconds) {
      currentTimeRef.current = 0;
      setCurrentTime(0);
    }
    setIsPlaying((playing) => !playing);
  };

  const applySummaryTemplate = (template: SummaryTemplate) => {
    setTemplateMenuOpen(false);
    setCustomizationOpen(false);
    if (template === summaryTemplate) return;

    setIsSwitchingTemplate(true);
    setSummaryTemplate(template);
    if (templateTimerRef.current) window.clearTimeout(templateTimerRef.current);
    templateTimerRef.current = window.setTimeout(() => setIsSwitchingTemplate(false), 220);
  };

  const toggleAction = (index: number) => {
    setCompletedActions((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <main className="meeting-detail-page">
      <Link className="back-link detail-back-link" href="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My Calls
      </Link>

      <header className="meeting-detail-header">
        <div className="meeting-detail-title">
          <p className="eyebrow">Meeting recording</p>
          <div className="meeting-title-action-row">
            <h1>{meeting.title}</h1>
            <button className="meeting-share-button" onClick={() => setShareTarget(null)} type="button">
              <Share2 size={15} />
              Share
            </button>
          </div>
          <div className="detail-meta">
            <span><CalendarDays size={14} />{formatMeetingDate(meeting.date)} · {meeting.time}</span>
            <span><Clock3 size={14} />{formatDuration(meeting.durationSeconds)}</span>
          </div>
        </div>

        <div className="detail-participants">
          <div className="detail-avatar-stack" aria-label={`${meeting.participants.length} participants`}>
            {meeting.participants.map((participant) => (
              <span
                key={participant.name}
                style={{ background: participant.color }}
                title={`${participant.name}, ${participant.role}`}
              >
                {participant.initials}
              </span>
            ))}
          </div>
          <div>
            <strong><Users size={14} />{meeting.participants.length} participants</strong>
            <p>{meeting.participants.map((participant) => participant.name).join(", ")}</p>
          </div>
        </div>
      </header>

      <div className="meeting-detail-grid">
        <section className="recording-player-card" aria-label="Simulated recording player">
          <div className="recording-stage">
            <div className="recording-stage-grid" aria-hidden="true" />
            <div className="recording-badge"><span />Simulated recording</div>
            <div className={`stage-avatar ${isPlaying ? "is-playing" : ""}`} style={{ background: meeting.participants[0].color }}>
              <span>{meeting.participants[0].initials}</span>
            </div>
            <div className="stage-person">
              <strong>{meeting.participants[0].name}</strong>
              <span>{meeting.participants[0].role}</span>
            </div>
          </div>

          <div
            className="player-controls"
            style={{ "--playback-progress": `${playbackProgress}%` } as CSSProperties}
          >
            <div className="waveform-timeline">
              <div className="waveform-bars" aria-hidden="true">
                {Array.from({ length: 96 }, (_, index) => (
                  <i
                    key={index}
                    style={{ height: `${18 + ((index * 29 + meeting.id.length * 11) % 69)}%` }}
                  />
                ))}
              </div>
              <div className="waveform-played" aria-hidden="true" />
              <input
                aria-label="Recording timeline"
                max={meeting.durationSeconds}
                min="0"
                onChange={(event) => seekTo(Number(event.target.value))}
                step="0.1"
                type="range"
                value={currentTime}
              />
            </div>

            <div className="player-control-row">
              <button
                className="primary-play-button"
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause recording" : "Play recording"}
              >
                {isPlaying ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
              </button>
              <div className="player-time" aria-live="off">
                <strong>{formatPlaybackTime(currentTime)}</strong>
                <span>/</span>
                <span>{formatPlaybackTime(meeting.durationSeconds)}</span>
              </div>
              <span className="player-caption"><Headphones size={14} />Playback simulation</span>
            </div>
          </div>
        </section>

        <section className="transcript-panel" aria-labelledby="transcript-heading">
          <div className="transcript-heading-row">
            <div>
              <p className="eyebrow">Conversation</p>
              <h2 id="transcript-heading">Transcript</h2>
            </div>
            <span>{meeting.transcript.length} turns</span>
          </div>

          <div className="transcript-scroll">
            <ol className="transcript-list" aria-label="Meeting transcript">
              {transcript.map((line, index) => {
                const participant = participantsByName.get(line.speaker);
                const active = index === activeIndex;
                const isHighlight = highlightedTimestamps.has(line.timestamp);
                const linkedActions = actionItemsByTimestamp.get(line.timestamp);
                const isFocused = focusedTimestamp === line.timestamp;

                return (
                  <li
                    data-transcript-timestamp={line.timestamp}
                    key={`${line.timestamp}-${line.speaker}`}
                    ref={(node) => {
                      if (node) transcriptRefs.current.set(line.timestamp, node);
                      else transcriptRefs.current.delete(line.timestamp);
                    }}
                  >
                    <button
                      aria-current={active ? "true" : undefined}
                      className={`transcript-turn ${active ? "active" : ""} ${isHighlight ? "has-highlight" : ""} ${linkedActions ? "has-action" : ""} ${isFocused ? "is-focused" : ""}`}
                      onClick={() => seekTo(line.seconds)}
                      type="button"
                    >
                      <span
                        className="transcript-avatar"
                        style={{ background: participant?.color ?? "#3f4248" }}
                        aria-hidden="true"
                      >
                        {participant?.initials ?? line.speaker.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="transcript-copy">
                        <span className="transcript-speaker-line">
                          <strong>{line.speaker}</strong>
                          <time>{line.timestamp}</time>
                        </span>
                        {(isHighlight || linkedActions) && (
                          <span className="transcript-labels">
                            {isHighlight && <span className="transcript-label is-highlight"><Flag size={10} />Highlight</span>}
                            {linkedActions && <span className="transcript-label is-action"><CheckSquare2 size={10} />Action item</span>}
                          </span>
                        )}
                        <span className="transcript-text">{line.text}</span>
                      </span>
                      <span className="active-turn-marker" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>

      <div className="meeting-insights-grid">
        <section className="summary-panel" aria-labelledby="summary-heading">
          <div className="summary-heading-row">
            <div>
              <p className="eyebrow"><Sparkles size={12} />AI notes</p>
              <h2 id="summary-heading">Summary</h2>
            </div>

            <div className="summary-controls">
              <div className="summary-template-control">
                <button
                  aria-expanded={templateMenuOpen}
                  aria-haspopup="menu"
                  className="summary-template-trigger"
                  onClick={() => {
                    setTemplateMenuOpen((open) => !open);
                    setCustomizationOpen(false);
                  }}
                  type="button"
                >
                  <FileText size={14} />
                  {summaryTemplates[summaryTemplate].label}
                  <ChevronDown size={13} />
                </button>

                {templateMenuOpen && (
                  <div className="summary-template-menu" role="menu" aria-label="Summary templates">
                    {(Object.keys(summaryTemplates) as SummaryTemplate[]).map((template) => (
                      <button
                        aria-checked={summaryTemplate === template}
                        key={template}
                        onClick={() => applySummaryTemplate(template)}
                        role="menuitemradio"
                        type="button"
                      >
                        <span className="template-menu-icon">
                          {template === "enhanced" ? <Sparkles size={15} /> : <Play size={14} />}
                        </span>
                        <span>
                          <strong>{summaryTemplates[template].label}</strong>
                          <small>{summaryTemplates[template].description}</small>
                        </span>
                        {summaryTemplate === template && <Check className="template-check" size={15} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                aria-expanded={customizationOpen}
                aria-label="Customize summary"
                className="summary-settings-button"
                onClick={() => {
                  setCustomizationOpen((open) => !open);
                  setTemplateMenuOpen(false);
                }}
                title="Customize summary"
                type="button"
              >
                <Settings2 size={15} />
              </button>
            </div>
          </div>

          {customizationOpen && (
            <div className="summary-customization" role="dialog" aria-label="Customize summary template">
              <div>
                <strong>Customize summary</strong>
                <p>Choose how these seeded meeting notes are organized. Your selection stays active on this page.</p>
              </div>
              <button aria-label="Close summary customization" onClick={() => setCustomizationOpen(false)} type="button">
                <X size={15} />
              </button>
              <div className="customization-options">
                {(Object.keys(summaryTemplates) as SummaryTemplate[]).map((template) => (
                  <button
                    aria-pressed={summaryTemplate === template}
                    className={summaryTemplate === template ? "selected" : ""}
                    key={template}
                    onClick={() => applySummaryTemplate(template)}
                    type="button"
                  >
                    <span>{summaryTemplates[template].label}</span>
                    <small>{summaryTemplates[template].description}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className={`summary-content ${isSwitchingTemplate ? "is-switching" : ""}`}
            data-summary-template={summaryTemplate}
          >
            {summaryTemplate === "enhanced" ? (
              <div className="enhanced-summary">
                {meeting.summary.map((section, index) => (
                  <article className="summary-section" key={section.heading}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{section.heading}</h3>
                      <p>{section.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="demo-summary">
                <div className="demo-summary-title">
                  <p>Meeting demo brief</p>
                  <h3>{meeting.title}</h3>
                </div>

                <article>
                  <h4>Overview</h4>
                  <ul>
                    {meeting.summary.map((section) => (
                      <li key={section.heading}><strong>{section.heading}:</strong> {section.body}</li>
                    ))}
                  </ul>
                </article>

                <article>
                  <h4>Moments to show</h4>
                  <ul>
                    {meeting.highlights.map((highlight) => (
                      <li key={highlight.timestamp}>
                        <strong>{highlight.timestamp} · {highlight.title}</strong> — {highlight.note}
                      </li>
                    ))}
                  </ul>
                </article>

                <article>
                  <h4>Follow-through</h4>
                  <ul>
                    {meeting.actionItems.map((action) => (
                      <li key={`${action.owner}-${action.task}`}><strong>{action.owner}:</strong> {action.task}</li>
                    ))}
                  </ul>
                </article>
              </div>
            )}
          </div>
          <span className="sr-only" aria-live="polite">{summaryTemplates[summaryTemplate].label} summary template selected</span>
        </section>

        <aside className="meeting-insights-sidebar" aria-label="Meeting follow-up">
          <section className="action-items-panel" aria-labelledby="action-items-heading">
            <div className="insight-panel-heading">
              <div>
                <p className="eyebrow"><ListChecks size={12} />Follow-up</p>
                <h2 id="action-items-heading">Action items</h2>
              </div>
              <span>{completedActions.size}/{meeting.actionItems.length}</span>
            </div>

            <div className="action-items-list">
              {meeting.actionItems.map((action, index) => {
                const participant = participantsByName.get(action.owner);
                const complete = completedActions.has(index);

                return (
                  <div className={`action-item ${complete ? "complete" : ""}`} key={`${action.owner}-${action.task}`}>
                    <label className="action-checkbox">
                      <input
                        aria-label={`Mark ${action.task} as ${complete ? "open" : "completed"}`}
                        checked={complete}
                        onChange={() => toggleAction(index)}
                        type="checkbox"
                      />
                      <span><Check size={13} /></span>
                    </label>
                    <div className="action-item-copy">
                      <p>{action.task}</p>
                      <div className="action-item-meta">
                        <span className="mini-avatar" style={{ background: participant?.color ?? "#3f4248" }}>
                          {participant?.initials ?? action.owner.slice(0, 2).toUpperCase()}
                        </span>
                        <strong>{action.owner}</strong>
                        {action.due && <span>Due {action.due}</span>}
                        {action.timestamp && (
                          <button onClick={() => seekToMoment(action.timestamp!)} type="button">
                            {action.timestamp}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="highlights-panel" aria-labelledby="highlights-heading">
            <div className="insight-panel-heading">
              <div>
                <p className="eyebrow"><Flag size={12} />Moments</p>
                <h2 id="highlights-heading">Highlights</h2>
              </div>
              <span>{meeting.highlights.length}</span>
            </div>

            <div className="highlights-list">
              {meeting.highlights.map((highlight) => (
                <div
                  className="highlight-item"
                  data-highlight-timestamp={highlight.timestamp}
                  key={highlight.timestamp}
                >
                  <button
                    aria-label={`Play ${highlight.title} at ${highlight.timestamp}`}
                    className="highlight-play"
                    onClick={() => seekToMoment(highlight.timestamp)}
                    type="button"
                  >
                    <Play fill="currentColor" size={12} />
                  </button>
                  <button className="highlight-copy" onClick={() => seekToMoment(highlight.timestamp)} type="button">
                    <span className="highlight-time">{highlight.timestamp}</span>
                    <strong>{highlight.title}</strong>
                    <small>{highlight.note}</small>
                  </button>
                  <button className="highlight-share-button" onClick={() => setShareTarget(highlight)} type="button">
                    <Share2 size={12} /> Share
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      {shareTarget !== undefined && (
        <ShareDialog
          meeting={meeting}
          moment={shareTarget ?? undefined}
          onClose={() => setShareTarget(undefined)}
        />
      )}
    </main>
  );
}
