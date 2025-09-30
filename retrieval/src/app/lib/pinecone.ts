import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import type { SearchResult } from "../models";

let pinecone: Pinecone | null = null;
let openai: OpenAI | null = null;
let index: any = null;

export async function initPinecone(): Promise<boolean> {
  if (!pinecone && process.env.PINECONE_API_KEY) {
    try {
      pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });

      const indexName = process.env.PINECONE_INDEX || "medical-faq-index";
      index = pinecone.index(indexName);

      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      return true;
    } catch (error) {
      console.error("Failed to initialize Pinecone:", error);
      return false;
    }
  }
  return !!pinecone;
}

async function generateQueryEmbedding(query: string): Promise<number[] | null> {
  if (!openai) return null;

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error in generating embedding:", error);
    return null;
  }
}

export async function searchPinecone(
  query: string,
  topK: number = 3
): Promise<SearchResult[] | null> {
  if (!index) return null;

  try {
    const embedding = await generateQueryEmbedding(query);
    if (!embedding) return null;

    const results = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });

    return results.matches.map((match: any) => ({
      text: match.metadata.fullContent || match.metadata.text,
      score: match.score,
      title: match.metadata.title,
    }));
  } catch (error) {
    console.error("Pinecone search error:", error);
    return null;
  }
}
