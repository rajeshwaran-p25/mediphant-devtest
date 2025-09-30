# mediphant-devtest

## Medication Interaction Checker overview

A Next.js application that checks for potential medication interactions using a mock ruleset. This is an educational demonstration tool and should not be used for actual medical advice.

## Getting Started

### 1. Navigate to Web Project

```bash
cd  web
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and replace it values

```bash
cp .env.example .env
```

Required variables:

- `BASE_URL`: Api Base Url

### 4. Run the development server:

```bash
npm run dev
```

### 5. Open [http://localhost:3000](http://localhost:3000)

## Testing

Run the test suite:

```bash
npm run test
```

## API Endpoint

### POST /api/interactions

Request body:

```json
{
  "medA": "warfarin",
  "medB": "ibuprofen"
}
```

Response:

```json
{
  "pair": ["warfarin", "ibuprofen"],
  "isPotentiallyRisky": true,
  "reason": "Increased bleeding risk",
  "advice": "Avoid combination; consult clinician; prefer acetaminophen for pain relief"
}
```

## Retrieval overview

This implementation provides a minimal RAG-style retrieval system using Pinecone for vector search and OpenAI for embeddings. It includes both a primary Pinecone-based implementation and a fallback in-memory search for situations where Pinecone is unavailable.

## Getting Started

### 1. Navigate to Retrival Project

```bash
cd  retrieval
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and replace it values

```bash
cp .env.example .env
```

Required variables:

- `OPENAI_API_KEY`: OpenAI API key
- `PINECONE_API_KEY`: Pinecone API key
- `PINECONE_INDEX`: Pinecone index Name

### 4. Index the Corpus

Run the indexing script to embed and upload documents to Pinecone:

```bash
npm run index
```

### 5. Run the API

```bash
npm run dev
```

### Response Format

```json
{
  "answer": "Based on the available information: Medication List Management: Keep an up‑to‑date medication list; reconcile after every clinic or hospital visit.",
  "matches": [
    {
      "text": "Medication List Management: Keep an up‑to‑date medication list; reconcile after every clinic or hospital visit.",
      "score": 0.212
    },
    {
      "text": "Adherence Tools: Use a pill organizer or phone reminders to reduce unintentional nonadherence.",
      "score": 0.08
    },
    {
      "text": "High-Risk Drug Interactions: High‑risk interactions include anticoagulants with NSAIDs, ACE inhibitors with potassium‑sparing diuretics, and metformin around contrast imaging.",
      "score": 0.079
    }
  ]
}
```

## Native Api Call Kotlin

A Next.js application that checks for potential medication interactions using a mock ruleset. This is an educational demonstration tool and should not be used for actual medical advice.

## Getting Started

### 1. Navigate to Retrival Project

```bash
cd  mobile
```

### 2. Configure Environment Variables

Copy `env.example` to `env` and replace it values

```bash
cd app/src/main/assets
cp env.example .env
```

Required variables:

- `BASE_URL`: Api Base Url

### 4. Run the App with Android Studio:
