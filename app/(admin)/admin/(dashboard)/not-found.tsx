import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-md border border-slate-200 bg-white px-6 py-16 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-red">404</p>
      <h2 className="font-display mt-3 text-xl font-extrabold text-ink">Page not found</h2>
      <p className="mt-2 text-sm text-slate-500">That admin page doesn&apos;t exist.</p>
      <Link
        href="/admin"
        className="font-ui mt-6 inline-flex bg-brand-red px-5 py-3 text-xs tracking-wide text-white uppercase transition-colors hover:bg-ink"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
