import Link from "next/link";

export default function SharedMeetingNotFound() {
  return (
    <main className="shared-not-found">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <p className="eyebrow">Shared meeting unavailable</p>
      <h1>This meeting link doesn&apos;t exist.</h1>
      <p>Check that the full link was copied correctly, or ask the person who shared it for a new link.</p>
      <Link href="/">Go to Fathom</Link>
    </main>
  );
}
