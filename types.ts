
export enum Category {
  FRACTIONS = 'Fractions & Ratios',
  NUMBER_THEORY = 'Number Theory',
  LOGIC = 'Logic & Sequences',
  GEOMETRY = 'Geometry',
  ALGEBRA = 'Algebra',
  COUNTING = 'Counting & Probability'
}

export enum Division {
  E = 'Division E',
  M = 'Division M'
}

export interface SymbolDefinition {
  symbol: string;
  meaning: string;
}

export interface Problem {
  id: string;
  title: string;
  category: Category;
  division: Division;
  year?: string;
  contest?: number;
  description: string;
  latex?: string;
  hint?: string;
  solution: string[];
  answer: string;
  symbols?: SymbolDefinition[];
}

export interface AIResponse {
  problem: string;
  latex: string;
  explanation: string[];
  answer: string;
  category: string;
  symbols?: SymbolDefinition[];
}
