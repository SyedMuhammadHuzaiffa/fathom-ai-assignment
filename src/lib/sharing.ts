import type { Meeting, TranscriptLine } from "@/data/meetings";

export type ShareableMoment = Meeting["highlights"][number];

export type ShareableClip = {
  start: string;
  end: string;
  endTime: string;
  durationSeconds: number;
  lines: TranscriptLine[];
};

function timestampToSeconds(timestamp: string) {
  return timestamp
    .split(":")
    .map(Number)
    .reduce((total, part) => total * 60 + part, 0);
}

function secondsToTimestamp(totalSeconds: number) {
  const rounded = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function getMomentId(moment: ShareableMoment) {
  return `highlight-${moment.timestamp.replaceAll(":", "-")}`;
}

export function getMomentById(meeting: Meeting, momentId?: string) {
  if (!momentId) return undefined;
  return meeting.highlights.find((moment) => getMomentId(moment) === momentId);
}

export function getTranscriptClip(meeting: Meeting, start?: string, end?: string): ShareableClip | undefined {
  if (!start || !end) return undefined;

  const startIndex = meeting.transcript.findIndex((line) => line.timestamp === start);
  const endIndex = meeting.transcript.findIndex((line) => line.timestamp === end);
  if (startIndex < 0 || endIndex < startIndex) return undefined;

  const endBoundarySeconds = endIndex < meeting.transcript.length - 1
    ? timestampToSeconds(meeting.transcript[endIndex + 1].timestamp)
    : meeting.durationSeconds;
  const startSeconds = timestampToSeconds(meeting.transcript[startIndex].timestamp);

  return {
    start,
    end,
    endTime: secondsToTimestamp(endBoundarySeconds),
    durationSeconds: Math.max(1, endBoundarySeconds - startSeconds),
    lines: meeting.transcript.slice(startIndex, endIndex + 1),
  };
}
