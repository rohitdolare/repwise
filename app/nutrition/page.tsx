import type { Metadata } from "next";
import { GuidePage } from "@/components/guide-page";
import { NutritionCalculator } from "@/components/nutrition-calculator";
import { nutritionGuide } from "@/content/guides";

export const metadata: Metadata = {
  title: "Nutrition Basics",
  description: "Protein, calories, hydration, meal timing and muscle-building nutrition fundamentals.",
};

export default function NutritionPage() {
  return <GuidePage guide={nutritionGuide} eyebrow="06 · Nutrition" top={<NutritionCalculator />} />;
}
