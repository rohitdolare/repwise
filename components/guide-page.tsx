import type { Guide } from "@/content/guides";
import { Blocks, PageHeader, References, SectionNav } from "./content";

export function GuidePage({ guide, eyebrow, top }: { guide: Guide; eyebrow: string; top?: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={guide.title} description={guide.tagline} />
      <div className="mx-auto max-w-3xl px-4">
        <SectionNav items={guide.sections} />
        {top && <div className="mb-8">{top}</div>}
        <div className="space-y-6">
          {guide.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20 rounded-2xl border bg-card p-5 md:p-6">
              <h2 className="mb-4 font-heading text-xl font-bold md:text-2xl">{s.title}</h2>
              <Blocks blocks={s.blocks} />
            </section>
          ))}
        </div>
        <References items={guide.references} />
      </div>
    </>
  );
}
