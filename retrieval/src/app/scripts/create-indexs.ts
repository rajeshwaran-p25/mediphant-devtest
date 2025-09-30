import { config } from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { promises as fs } from "fs";
import path from "path";
import type { Chunk, Vectors } from "../models";

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

async function parseFile(): Promise<Chunk[]> {
  const corpusPath = path.join(
    process.cwd(),
    "src",
    "app",
    "scripts",
    "corpus.md"
  );
  const content = await fs.readFile(corpusPath, "utf-8");

  const sections = content.split(/^##\s+/m).filter((s) => s.trim());

  const chunks: Chunk[] = sections.map((section, index) => {
    const lines = section.trim().split("\n");
    const title = lines[0].trim();
    const text = lines.slice(1).join(" ").trim();

    return {
      id: `chunk-${index}`,
      title,
      text,
      fullContent: `${title}: ${text}`,
    };
  });

  return chunks;
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 1536,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

async function indexDocuments(): Promise<void> {
  try {
    console.log("Parsing file...");
    const chunks = await parseFile();
    console.log(`Found ${chunks.length} chunks to index`);

    const indexName = process.env.PINECONE_INDEX || "medical-faq-index";
    const indexList = await pinecone.listIndexes();

    const indexExists = indexList.indexes?.some(
      (idx) => idx.name === indexName
    );

    if (!indexExists) {
      console.log(`Creating index: ${indexName}`);
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

      console.log("Waiting for index to be ready...");
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    const index = pinecone.index(indexName);

    console.log("Generating embeddings...");
    const vectors: Vectors[] = [];

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.fullContent);

      vectors.push({
        id: chunk.id,
        values: embedding,
        metadata: {
          title: chunk.title,
          text: chunk.text,
          fullContent: chunk.fullContent,
        },
      });

      console.log(`Embedded: ${chunk.title}`);
    }

    console.log("Upserting to Pinecone...");
    await index.upsert(vectors);

    console.log(`Successfully indexed ${vectors.length} documents!`);

    const stats = await index.describeIndexStats();
    console.log("Index stats:", stats);
  } catch (error) {
    console.error("Indexing failed:", error);
    process.exit(1);
  }
}

indexDocuments();
