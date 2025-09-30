import { NextRequest, NextResponse } from "next/server";
import { interactionRequestSchema } from "../../../lib/validation";
import { Rules } from "../../../lib/rules";
import type { InteractionResult } from "../../models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const Result = interactionRequestSchema.safeParse(body);

    if (!Result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: Result.error.flatten() },
        { status: 400 }
      );
    }

    const { medA, medB } = Result.data;

    const rule = Rules(medA, medB);

    const result: InteractionResult = rule
      ? {
          medications: [medA, medB],
          isPotentiallyRisky: rule.isPotentiallyRisky,
          reason: rule.reason,
          advice: rule.advice,
        }
      : {
          medications: [medA, medB],
          isPotentiallyRisky: false,
          reason: "No known interaction in our mock database",
          advice:
            "These medications appear safe to take together based on our limited mock data. Always consult with a healthcare professional for real medical advice.",
        };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing interaction check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
