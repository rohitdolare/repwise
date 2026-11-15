export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; title?: string; text: string; tone?: "tip" | "warn" };

export interface Reference {
  label: string;
  url: string;
}

const pubmed = (q: string) => `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(q)}`;

export const refs = {
  acsm: {
    label: "ACSM Position Stand — Progression models in resistance training for healthy adults (2009)",
    url: "https://pubmed.ncbi.nlm.nih.gov/19204579/",
  },
  volume: {
    label: "Schoenfeld, Ogborn & Krieger — Dose-response relationship between weekly training volume and muscle mass (2017)",
    url: pubmed("Dose-response relationship between weekly resistance training volume and increases in muscle mass Schoenfeld"),
  },
  frequency: {
    label: "Schoenfeld, Ogborn & Krieger — Effects of resistance training frequency on muscle hypertrophy (2016)",
    url: pubmed("Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis"),
  },
  loads: {
    label: "Schoenfeld et al. — Strength and hypertrophy adaptations between low- vs. high-load training (2017)",
    url: pubmed("Strength and Hypertrophy Adaptations Between Low- vs. High-Load Resistance Training: A Systematic Review and Meta-analysis"),
  },
  rir: {
    label: "Zourdos et al. — Novel resistance training–specific RPE scale measuring repetitions in reserve (2016)",
    url: pubmed("Novel Resistance Training-Specific Rating of Perceived Exertion Scale Measuring Repetitions in Reserve"),
  },
  failure: {
    label: "Refalo et al. — Influence of resistance training proximity-to-failure on hypertrophy (2023)",
    url: pubmed("Influence of Resistance Training Proximity-to-Failure on Skeletal Muscle Hypertrophy Refalo"),
  },
  deload: {
    label: "Bell et al. — Integrating deloading into strength and physique sports training programmes (2023)",
    url: pubmed("Integrating Deloading into Strength and Physique Sports Training Programmes Bell"),
  },
  protein: {
    label: "ISSN Position Stand — Protein and exercise (Jäger et al., 2017)",
    url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8",
  },
  proteinMeta: {
    label: "Morton et al. — Protein supplementation and resistance training gains: meta-analysis (2018)",
    url: pubmed("A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains Morton"),
  },
  timing: {
    label: "ISSN Position Stand — Nutrient timing (Kerksick et al., 2017)",
    url: pubmed("International society of sports nutrition position stand: nutrient timing Kerksick"),
  },
  creatine: {
    label: "ISSN Position Stand — Safety and efficacy of creatine supplementation (Kreider et al., 2017)",
    url: pubmed("International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation Kreider"),
  },
  sleep: {
    label: "AASM/SRS — Recommended amount of sleep for a healthy adult (Watson et al., 2015)",
    url: pubmed("Recommended Amount of Sleep for a Healthy Adult: A Joint Consensus Statement Watson"),
  },
  warmup: {
    label: "Research on warm-ups and resistance training performance (PubMed search)",
    url: pubmed("warm-up resistance training performance systematic review"),
  },
  who: {
    label: "WHO 2020 guidelines on physical activity and sedentary behaviour (Bull et al.)",
    url: pubmed("World Health Organization 2020 guidelines on physical activity and sedentary behaviour Bull"),
  },
  hrmax: {
    label: "Tanaka, Monahan & Seals — Age-predicted maximal heart rate revisited (2001)",
    url: pubmed("Age-predicted maximal heart rate revisited Tanaka"),
  },
  fourByFour: {
    label: "Helgerud et al. — Aerobic high-intensity intervals improve VO2max more than moderate training (2007)",
    url: pubmed("Aerobic high-intensity intervals improve VO2max more than moderate training Helgerud"),
  },
  tenTwentyThirty: {
    label: "Gunnarsson & Bangsbo — The 10-20-30 training concept improves performance and health (2012)",
    url: pubmed("The 10-20-30 training concept improves performance and health profile in moderately trained runners"),
  },
  concurrent: {
    label: "Wilson et al. — Concurrent training: interference of aerobic and resistance exercise (meta-analysis, 2012)",
    url: pubmed("Concurrent training: a meta-analysis examining interference of aerobic and resistance exercises Wilson"),
  },
  hiit: {
    label: "Gibala et al. — Physiological adaptations to low-volume, high-intensity interval training (2012)",
    url: pubmed("Physiological adaptations to low-volume, high-intensity interval training in health and disease Gibala"),
  },
  fitnessMortality: {
    label: "Mandsager et al. — Cardiorespiratory fitness and long-term mortality (2018)",
    url: pubmed("Association of Cardiorespiratory Fitness With Long-term Mortality Among Adults Undergoing Exercise Treadmill Testing"),
  },
  spotReduction: {
    label: "Vispute et al. — The effect of abdominal exercise on abdominal fat (2011)",
    url: pubmed("The effect of abdominal exercise on abdominal fat Vispute"),
  },
  suryaNamaskar: {
    label: "Studies on Surya Namaskar — flexibility, strength and cardiovascular effects (PubMed)",
    url: pubmed("Surya Namaskar"),
  },
} satisfies Record<string, Reference>;
