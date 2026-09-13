import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { meetings } from "@/data/meetings";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";

export function generateStaticParams() {
  return meetings.map((meeting) => ({ id: meeting.id }));
}

export default async function MeetingPlaceholder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = meetings.find((item) => item.id === id);

  if (!meeting) notFound();

  return (
    <AppShell>
      <main className="detail-placeholder">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to My Calls
        </Link>

        <div className="placeholder-card">
          <div className="placeholder-glow" aria-hidden="true" />
          <div className="eyebrow">Meeting recording</div>
          <h1>{meeting.title}</h1>
          <div className="placeholder-meta">
            <span><CalendarDays size={15} />{formatMeetingDate(meeting.date)}</span>
            <span><Clock3 size={15} />{formatDuration(meeting.durationSeconds)}</span>
            <span><Users size={15} />{meeting.participants.length} participants</span>
          </div>
          <p>
            The full meeting detail experience—playback, transcript, AI summary,
            sharing, and clips—will arrive in the next implementation slices.
          </p>
          <div className="placeholder-waveform" aria-hidden="true">
            {Array.from({ length: 54 }, (_, index) => (
              <i key={index} style={{ height: `${12 + ((index * 17) % 38)}%` }} />
            ))}
          </div>
          <div className="placeholder-progress">
            <span>0:00</span>
            <div><i /></div>
            <span>{formatDuration(meeting.durationSeconds)}</span>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
