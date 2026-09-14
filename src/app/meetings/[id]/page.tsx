import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { MeetingDetail } from "@/components/meeting-detail";
import { meetings } from "@/data/meetings";

export function generateStaticParams() {
  return meetings.map((meeting) => ({ id: meeting.id }));
}

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = meetings.find((item) => item.id === id);

  if (!meeting) notFound();

  return (
    <AppShell>
      <MeetingDetail meeting={meeting} />
    </AppShell>
  );
}
