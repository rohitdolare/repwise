import Link from "next/link";
import { AlertTriangle, ExternalLink, Lightbulb } from "lucide-react";
import type { Block, Reference } from "@/content/blocks";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-6 md:pt-12">
      {eyebrow && <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>}
      <h1 className="font-heading text-3xl font-black text-balance md:text-5xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-base text-pretty text-muted-foreground md:text-lg">{description}</p>}
      {children}
    </div>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="leading-relaxed text-pretty text-foreground/90">{block.text}</p>;
    case "h":
      return <h3 className="pt-2 font-heading text-lg font-bold">{block.text}</h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={cn("space-y-2 pl-5 leading-relaxed", block.ordered ? "list-decimal" : "list-disc", "marker:text-primary")}>
          {block.items.map((it) => (
            <li key={it} className="pl-1">
              {it}
            </li>
          ))}
        </Tag>
      );
    }
    case "table":
      return (
        <figure className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  {block.head.map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t">
                    {row.map((cell, c) => (
                      <td key={c} className={cn("px-3 py-2.5 align-top", c === 0 && "font-medium")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="border-t bg-muted/30 px-3 py-2 text-xs text-muted-foreground">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "callout": {
      const warn = block.tone === "warn";
      const Icon = warn ? AlertTriangle : Lightbulb;
      return (
        <div
          className={cn(
            "flex gap-3 rounded-xl border p-4",
            warn ? "border-warning/40 bg-warning/10" : "border-primary/30 bg-accent/60",
          )}
        >
          <Icon className={cn("mt-0.5 size-5 shrink-0", warn ? "text-warning" : "text-primary")} />
          <div className="space-y-1 text-sm leading-relaxed">
            {block.title && <p className="font-semibold">{block.title}</p>}
            <p>{block.text}</p>
          </div>
        </div>
      );
    }
  }
}

export function References({ items }: { items: Reference[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-10 rounded-xl border bg-muted/30 p-5">
      <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">Evidence & further reading</h2>
      <ul className="space-y-2 text-sm">
        {items.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
              {r.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SectionNav({ items }: { items: { id: string; title: string }[] }) {
  return (
    <nav aria-label="On this page" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
      {items.map((s) => (
        <Link
          key={s.id}
          href={`#${s.id}`}
          className="shrink-0 rounded-full border bg-card px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground"
        >
          {s.title}
        </Link>
      ))}
    </nav>
  );
}
