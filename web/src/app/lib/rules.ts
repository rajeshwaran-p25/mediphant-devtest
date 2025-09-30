import type { InteractionResult } from "../models";

export const InteractionResults: InteractionResult[] = [
  {
    medications: ["warfarin", "ibuprofen"],
    isPotentiallyRisky: true,
    reason: "Increased bleeding risk",
    advice:
      "Avoid combination; consult clinician; prefer acetaminophen for pain relief",
  },
  {
    medications: ["metformin", "contrast dye"],
    isPotentiallyRisky: true,
    reason: "Lactic acidosis risk around imaging contrast",
    advice: "Hold metformin per imaging protocol",
  },
  {
    medications: ["lisinopril", "spironolactone"],
    isPotentiallyRisky: true,
    reason: "Hyperkalemia risk",
    advice: "Monitor potassium, consult clinician",
  },
];

export function Rules(medA: string, medB: string): InteractionResult | null {
  const medicineA = medA.toLowerCase().trim();
  const medicineB = medB.toLowerCase().trim();

  for (const rule of InteractionResults) {
    const [med1, med2] = rule.medications;
    if (
      (medicineA === med1 && medicineB === med2) ||
      (medicineA === med2 && medicineB === med1)
    ) {
      return rule;
    }
  }

  return null;
}
