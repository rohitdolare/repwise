import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-2 font-heading text-3xl font-black">Missed rep.</h1>
      <p className="mt-2 text-muted-foreground">That page doesn&apos;t exist. Let&apos;s get you back to training.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/today" className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">
          Today&apos;s workout
        </Link>
        <Link href="/exercises" className="rounded-lg border px-4 py-2 font-semibold">
          Exercises
        </Link>
      </div>
    </div>
  );
}
