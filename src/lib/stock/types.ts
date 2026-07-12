export type AgentStatus = "pending" | "running" | "done" | "error";

export interface AgentLog {
  agentId: AgentId;
  label: string;
  status: AgentStatus;
  message: string;
  startedAt?: number;
  finishedAt?: number;
}

export type AgentId =
  | "financial"
  | "moat"
  | "valuation"
  | "growth"
  | "bull"
  | "bear"
  | "moderator"
  | "reviewer";

export type JobStatus = "queued" | "running" | "done" | "error";

export interface AnalysisJob {
  jobId: string;
  ticker: string;
  displayName: string;
  status: JobStatus;
  agents: AgentLog[];
  createdAt: number;
  finishedAt?: number;
  error?: string;
}

export interface AnalyzeRequest {
  query: string;
}

export interface AnalyzeResponse {
  jobId: string;
  ticker: string;
  displayName: string;
}

export type SSEEvent =
  | { type: "agent_update"; agent: AgentLog }
  | { type: "job_done" }
  | { type: "job_error"; message: string };

export interface FinancialData {
  year: string;
  revenue: number;       // 억원 or M USD
  operatingProfit: number;
  netIncome: number;
  fcf: number;
  roe: number;           // %
  debtRatio: number;     // %
}

export interface ValuationData {
  metric: string;
  current: number;
  sector: number;
  label: string;
}

export interface ScenarioDCF {
  scenario: "bear" | "base" | "bull";
  label: string;
  targetPrice: number;
  upside: number;        // % vs current price
}

export interface MoatScore {
  category: string;
  score: number;         // 0~100
  max: number;
}

export interface AnalysisReport {
  ticker: string;
  displayName: string;
  currentPrice: number;
  currency: string;
  generatedAt: number;

  // Phase 1 결과
  financial: {
    summary: string;
    data: FinancialData[];
    highlights: string[];
  };
  valuation: {
    summary: string;
    multiples: ValuationData[];
    dcf: ScenarioDCF[];
    fairValueRange: [number, number];
  };
  moat: {
    summary: string;
    totalScore: number;
    scores: MoatScore[];
    verdict: string;
  };
  growth: {
    summary: string;
    tamSizeB: number;    // TAM in billion USD
    catalysts: string[];
    risks: string[];
    growthRating: "낮음" | "보통" | "높음" | "매우 높음";
  };

  // Phase 2 결과
  bullCase: {
    title: string;
    points: string[];
  };
  bearCase: {
    title: string;
    points: string[];
  };

  // Phase 3 결과
  moderatorVerdict: {
    summary: string;
    keyInsights: string[];
  };

  // Phase 4 결과
  finalVerdict: {
    recommendation: "강력 매수" | "매수" | "중립" | "매도" | "강력 매도";
    targetPrice: number;
    confidence: number;   // 0~100
    rationale: string;
    keyRisks: string[];
  };
}
