const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatMeetingDate(value: string) {
  return dateFormatter.format(new Date(`${value}T12:00:00`));
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes === 0) return `${seconds}s`;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}
