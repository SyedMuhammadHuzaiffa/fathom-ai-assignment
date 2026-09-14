"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Headphones,
  Pause,
  Play,
  Users,
} from "lucide-react";
import type { Meeting } from "@/data/meetings";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";

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
  const currentTimeRef = useRef(0);

  const transcript = useMemo(
    () => meeting.transcript.map((line) => ({ ...line, seconds: timestampToSeconds(line.timestamp) })),
    [meeting.transcript],
  );

  const participantsByName = useMemo(
    () => new Map(meeting.participants.map((participant) => [participant.name, participant])),
    [meeting.participants],
  );

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

  const seekTo = (seconds: number) => {
    const nextTime = Math.min(Math.max(seconds, 0), meeting.durationSeconds);
    currentTimeRef.current = nextTime;
    setCurrentTime(nextTime);
  };

  const togglePlayback = () => {
    if (currentTime >= meeting.durationSeconds) {
      currentTimeRef.current = 0;
      setCurrentTime(0);
    }
    setIsPlaying((playing) => !playing);
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
          <h1>{meeting.title}</h1>
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

                return (
                  <li key={`${line.timestamp}-${line.speaker}`}>
                    <button
                      aria-current={active ? "true" : undefined}
                      className={`transcript-turn ${active ? "active" : ""}`}
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
    </main>
  );
}
