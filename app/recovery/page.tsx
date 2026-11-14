import type { Metadata } from "next";
import { GuidePage } from "@/components/guide-page";
import { recoveryGuide } from "@/content/guides";

export const metadata: Metadata = {
  title: "Warm-up & Recovery",
  description: "Dynamic warm-ups, ramp-up sets, rest periods, sleep, mobility and recovery habits.",
};

export default function RecoveryPage() {
  return <GuidePage guide={recoveryGuide} eyebrow="05 · Warm-up & recovery" />;
}
