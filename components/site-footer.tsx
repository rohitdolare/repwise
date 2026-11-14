import Link from "next/link";
import { Logo } from "./logo";
import { learnSections, navItems } from "./nav-items";

export function SiteFooter() {
  return (
    <footer className="hidden border-t bg-muted/40 md:block">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Don&apos;t just lift weights. Learn to train right. Built on evidence from ACSM, ISSN and peer-reviewed
            training research.
          </p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Educational content only — not medical advice. Consult a professional before starting a new program if you
            have injuries or health conditions.
          </p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Exercise photos from{" "}
            <a
              className="underline underline-offset-2"
              href="https://github.com/yuhonas/free-exercise-db"
              target="_blank"
              rel="noreferrer"
            >
              Free Exercise DB
            </a>{" "}
            (public domain). Muscle maps by{" "}
            <a
              className="underline underline-offset-2"
              href="https://github.com/GV79/react-body-highlighter"
              target="_blank"
              rel="noreferrer"
            >
              react-body-highlighter
            </a>{" "}
            (MIT). Technique videos are embedded from their creators&apos; YouTube channels using YouTube&apos;s
            official player.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Train</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {navItems.map((n) => (
              <li key={n.href}>
                <Link className="hover:text-foreground" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Learn</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {learnSections.map((n) => (
              <li key={n.href}>
                <Link className="hover:text-foreground" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
