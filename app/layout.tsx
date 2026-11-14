import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { RestTimer } from "@/components/rest-timer";
import { ServiceWorker } from "@/components/service-worker";
import { exercises } from "@/content/exercises";
import { principles } from "@/content/principles";
import { cardioWorkouts } from "@/content/cardio";

/** Every page, so the installed app works fully offline at the gym. */
const offlineUrls = [
  "/",
  "/today",
  "/routine",
  "/exercises",
  "/learn",
  "/progress",
  "/principles",
  "/form-guide",
  "/recovery",
  "/nutrition",
  "/cardio",
  "/core",
  ...cardioWorkouts.map((w) => `/cardio/${w.id}`),
  ...exercises.map((e) => `/exercises/${e.slug}`),
  ...principles.map((p) => `/principles/${p.slug}`),
];

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Archivo({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "RepWise — Learn to train right",
    template: "%s · RepWise",
  },
  description:
    "Your personal gym manual and workout coach: today's workout, exercise technique, sets & reps, rest times and a built-in progressive overload tracker.",
  applicationName: "RepWise",
  appleWebApp: {
    capable: true,
    title: "RepWise",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9faf6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Follow the OS light/dark setting before first paint (no flash).
const themeScript = `(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');var a=function(){document.documentElement.classList.toggle('dark',m.matches)};a();m.addEventListener('change',a)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 pb-28 md:pb-12">{children}</main>
        <SiteFooter />
        <RestTimer />
        <BottomNav />
        <ServiceWorker urls={offlineUrls} />
      </body>
    </html>
  );
}
