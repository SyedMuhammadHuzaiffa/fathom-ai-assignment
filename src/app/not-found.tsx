import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="brand-mark" aria-hidden="true"><i /><i /><i /></div>
      <p className="eyebrow">404</p>
      <h1>That recording isn&apos;t here.</h1>
      <p>It may have been moved or removed from this workspace.</p>
      <Link href="/">Return to My Calls</Link>
    </main>
  );
}
