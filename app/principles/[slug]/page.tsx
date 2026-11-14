import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Blocks, PageHeader, References } from "@/components/content";
import { OverloadPlanner } from "@/components/overload-planner";
import { getPrinciple, principles } from "@/content/principles";

export function generateStaticParams() {
  return principles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/principles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPrinciple(slug);
  return p ? { title: p.title, description: p.tagline } : {};
}

export default async function PrinciplePage({ params }: PageProps<"/principles/[slug]">) {
  const { slug } = await params;
  const p = getPrinciple(slug);
  if (!p) notFound();
  const idx = principles.findIndex((x) => x.slug === slug);
  const next = principles[(idx + 1) % principles.length];

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link href="/principles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Training principles
        </Link>
      </div>
      <PageHeader eyebrow={`Principle ${idx + 1} of ${principles.length}`} title={p.title} description={p.tagline} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_22rem]">
        <article className="min-w-0 space-y-8">
          <section className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
            <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">Key takeaways</h2>
            <ul className="space-y-2">
              {p.takeaways.map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </section>
          <Blocks blocks={p.body} />
          {p.slug === "progressive-overload" && <OverloadPlanner />}
          <References items={p.references} />
        </article>
        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">All principles</p>
          <nav className="flex flex-col gap-1">
            {principles.map((x) => (
              <Link
                key={x.slug}
                href={`/principles/${x.slug}`}
                className={`rounded-lg px-3 py-2 text-sm ${x.slug === slug ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-muted"}`}
              >
                {x.title}
              </Link>
            ))}
          </nav>
          <Link href={`/principles/${next.slug}`} className="flex items-center justify-between rounded-xl border bg-card p-4 hover:border-primary/60">
            <span>
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="font-semibold">{next.title}</span>
            </span>
            <ArrowRight className="size-4" />
          </Link>
        </aside>
      </div>
    </>
  );
}
