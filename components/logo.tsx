import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 place-items-center rounded-lg bg-primary font-heading text-lg font-black text-primary-foreground",
        className,
      )}
    >
      R
    </span>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-extrabold tracking-tight">RepWise</span>
        <span className="text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground">FITNESS GUIDE</span>
      </span>
    </span>
  );
}
