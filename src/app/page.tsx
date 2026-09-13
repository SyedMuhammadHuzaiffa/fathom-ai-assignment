import { AppShell } from "@/components/app-shell";
import { MeetingsDashboard } from "@/components/meetings-dashboard";
import { meetings } from "@/data/meetings";

export default function Home() {
  return (
    <AppShell>
      <MeetingsDashboard meetings={meetings} />
    </AppShell>
  );
}
