import type { Meeting } from "@/data/meetings";

export type ShareableMoment = Meeting["highlights"][number];

export function getMomentId(moment: ShareableMoment) {
  return `highlight-${moment.timestamp.replaceAll(":", "-")}`;
}

export function getMomentById(meeting: Meeting, momentId?: string) {
  if (!momentId) return undefined;
  return meeting.highlights.find((moment) => getMomentId(moment) === momentId);
}
