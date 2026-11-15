import { BookOpen, CalendarDays, Dumbbell, LineChart, Zap } from "lucide-react";

export const navItems = [
  { href: "/today", label: "Today", icon: Zap },
  { href: "/routine", label: "Plan", icon: CalendarDays },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: LineChart },
] as const;

export const learnSections = [
  { href: "/principles", label: "Training Principles" },
  { href: "/form-guide", label: "Form Guide" },
  { href: "/recovery", label: "Warm-up & Recovery" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/cardio", label: "Cardio & Conditioning" },
  { href: "/core", label: "Abs & Core" },
  { href: "/home-workouts", label: "Home Workouts" },
];

export function isActive(pathname: string, href: string) {
  if (href === "/learn") {
    return [
      "/learn",
      "/principles",
      "/form-guide",
      "/recovery",
      "/nutrition",
      "/cardio",
      "/core",
      "/home-workouts",
    ].some((p) => pathname.startsWith(p));
  }
  return pathname === href || pathname.startsWith(href + "/");
}
