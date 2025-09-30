import type { Chunk, SearchResult } from "../models";

export const FALLBACK_CORPUS: Chunk[] = [
  {
    id: "chunk-0",
    title: "Medication Adherence",
    text: "Medication adherence improves outcomes in diabetes; missed doses are a leading cause of poor control.",
    fullContent:
      "Medication Adherence: Medication adherence improves outcomes in diabetes; missed doses are a leading cause of poor control.",
  },
  {
    id: "chunk-1",
    title: "Medication List Management",
    text: "Keep an up-to-date medication list; reconcile after every clinic or hospital visit.",
    fullContent:
      "Medication List Management: Keep an up-to-date medication list; reconcile after every clinic or hospital visit.",
  },
  {
    id: "chunk-2",
    title: "Adherence Tools",
    text: "Use a pill organizer or phone reminders to reduce unintentional nonadherence.",
    fullContent:
      "Adherence Tools: Use a pill organizer or phone reminders to reduce unintentional nonadherence.",
  },
  {
    id: "chunk-3",
    title: "High-Risk Drug Interactions",
    text: "High-risk interactions include anticoagulants with NSAIDs, ACE inhibitors with potassium-sparing diuretics, and metformin around contrast imaging.",
    fullContent:
      "High-Risk Drug Interactions: High-risk interactions include anticoagulants with NSAIDs, ACE inhibitors with potassium-sparing diuretics, and metformin around contrast imaging.",
  },
  {
    id: "chunk-4",
    title: "Professional Consultation",
    text: "When in doubt, consult a pharmacist or clinician; online lists can be incomplete.",
    fullContent:
      "Professional Consultation: When in doubt, consult a pharmacist or clinician; online lists can be incomplete.",
  },
];

function calculateTFScore(query: string, text: string): number {
  const searchTerms = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();
  let score = 0;

  for (const term of searchTerms) {
    if (textLower.includes(term)) {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      const matches = textLower.match(regex);
      score += matches ? matches.length : 0;
    }
  }

  return score / Math.sqrt(text.length);
}

export function fallbackSearch(
  query: string,
  topK: number = 3
): SearchResult[] {
  const scores = FALLBACK_CORPUS.map((doc) => ({
    text: doc.fullContent,
    title: doc.title,
    score: calculateTFScore(query, `${doc.title} ${doc.text}`),
  }));

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topK).filter((s) => s.score > 0);
}

export function synthesizeAnswer(
  query: string,
  matches: SearchResult[]
): string {
  if (!matches || matches.length === 0) {
    return "I couldn't find relevant information to answer your question. Please consult a healthcare professional for medical advice.";
  }

  const data = query.toLowerCase();

  if (
    data.includes("adherence") ||
    data.includes("missed") ||
    data.includes("dose")
  ) {
    const relevant = matches.find((m) =>
      m.text.toLowerCase().includes("adherence")
    );
    if (relevant) {
      return `Based on medical guidelines: ${relevant.text} Consider using tools like pill organizers or phone reminders to improve adherence.`;
    }
  }

  if (data.includes("interaction") || data.includes("drug")) {
    const relevant = matches.find((m) =>
      m.text.toLowerCase().includes("interaction")
    );
    if (relevant) {
      return `Important drug interaction information: ${relevant.text} Always consult with a pharmacist or healthcare provider for personalized advice.`;
    }
  }

  if (data.includes("list") || data.includes("medication")) {
    const relevant = matches.find((m) => m.text.toLowerCase().includes("list"));
    if (relevant) {
      return `For medication management: ${relevant.text} This helps ensure safe and effective treatment.`;
    }
  }

  const topMatch = matches[0];
  let answer = `Based on the available information: ${topMatch.text}`;

  if (matches.length > 1 && matches[1].score > 0.7) {
    answer += ` Additionally, ${matches[1].text}`;
  }

  return answer;
}
