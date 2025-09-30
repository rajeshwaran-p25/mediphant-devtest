export interface Chunk {
  id: string;
  title: string;
  text: string;
  fullContent: string;
}

export interface SearchResult {
  text: string;
  score: number;
  title?: string;
}

export interface Response {
  answer: string;
  matches: SearchResult[];
  note?: string;
}

export interface Vectors {
  id: string;
  values: number[];
  metadata: {
    title: string;
    text: string;
    fullContent: string;
  };
}
