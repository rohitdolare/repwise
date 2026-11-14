"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, navItems } from "./nav-items";
import { cn } from "@/lib/utils";

/** App-style tab bar for phones (and the installed PWA). */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur-lg md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[0.68rem] font-medium text-muted-foreground transition-colors",
                  active && "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    active && "bg-primary text-primary-foreground",
                  )}
                >
                  <item.icon className="size-[1.15rem]" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
