import { NextRequest, NextResponse } from "next/server";
import { initPinecone, searchPinecone } from "../../lib/pinecone";
import { fallbackSearch, synthesizeAnswer } from "../../lib/fallback-search";
import type { Response, SearchResult } from "../../models";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    let matches: SearchResult[] | null = null;
    let usedFallback = false;

    const pineconeAvailable = await initPinecone();

    if (pineconeAvailable) {
      matches = await searchPinecone(query);
    }

    if (!matches) {
      console.log("Using fallback search method");
      usedFallback = true;
      matches = fallbackSearch(query);
    }

    const answer = synthesizeAnswer(query, matches);

    const response: Response = {
      answer,
      matches: matches.map((m) => ({
        text: m.text,
        score: parseFloat(m.score.toFixed(3)),
      })),
    };

    if (usedFallback) {
      response.note =
        "Using fallback search (TF-based) as Pinecone is unavailable";
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("FAQ endpoint error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
