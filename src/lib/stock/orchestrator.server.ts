import type { AgentId, AgentLog, AnalysisJob } from "./types";
import { createJob, updateJob, getJob, saveReport } from "./job-store.server";
import { generateReport } from "./report-generator.server";

// Feature 2에서 실제 AI 호출로 교체할 스텁 메시지
const AGENT_STEPS: Array<{
  agentId: AgentId;
  label: string;
  messages: string[];
  durationMs: number;
}> = [
  {
    agentId: "financial",
    label: "재무 에이전트",
    messages: [
      "최근 5년 재무제표 수집 중...",
      "FCF / ROE / 부채비율 계산 중...",
      "재무 트렌드 분석 완료",
    ],
    durationMs: 3200,
  },
  {
    agentId: "valuation",
    label: "밸류에이션 에이전트",
    messages: [
      "현재 주가 및 시가총액 수집 중...",
      "PER / PBR / EV·EBITDA 산출 중...",
      "DCF 3개 시나리오 계산 완료",
    ],
    durationMs: 3800,
  },
  {
    agentId: "moat",
    label: "경쟁 해자 에이전트",
    messages: [
      "브랜드 / 전환비용 / 네트워크 효과 분석 중...",
      "경쟁사 대비 해자 점수 산출 중...",
      "해자 평가 완료",
    ],
    durationMs: 2900,
  },
  {
    agentId: "growth",
    label: "성장 잠재력 에이전트",
    messages: [
      "TAM / SAM 규모 조사 중...",
      "신사업 카탈리스트 분석 중...",
      "성장성 평가 완료",
    ],
    durationMs: 3400,
  },
];

function makeInitialAgents(): AgentLog[] {
  const all: AgentId[] = [
    "financial",
    "valuation",
    "moat",
    "growth",
    "bull",
    "bear",
    "moderator",
    "reviewer",
  ];
  const labels: Record<AgentId, string> = {
    financial: "재무 에이전트",
    valuation: "밸류에이션 에이전트",
    moat: "경쟁 해자 에이전트",
    growth: "성장 잠재력 에이전트",
    bull: "강세론 에이전트",
    bear: "약세론 에이전트",
    moderator: "사회자 에이전트",
    reviewer: "검증 에이전트",
  };
  return all.map((id) => ({
    agentId: id,
    label: labels[id],
    status: "pending",
    message: "대기 중...",
  }));
}

export async function startAnalysis(
  jobId: string,
  ticker: string,
  displayName: string,
): Promise<void> {
  const job: AnalysisJob = {
    jobId,
    ticker,
    displayName,
    status: "running",
    agents: makeInitialAgents(),
    createdAt: Date.now(),
  };
  createJob(job);

  // 비동기로 시뮬레이션 실행 — 응답을 블로킹하지 않음
  runSimulation(jobId).catch(console.error);
}

async function runSimulation(jobId: string): Promise<void> {
  const delay = (ms: number) =>
    new Promise<void>((r) => setTimeout(r, ms));

  function updateAgent(agentId: AgentId, patch: Partial<AgentLog>) {
    const job = getJob(jobId);
    if (!job) return;
    const agents = job.agents.map((a) =>
      a.agentId === agentId ? { ...a, ...patch } : a,
    );
    updateJob(jobId, { agents });
  }

  // Phase 1: 4개 분석 에이전트 병렬 시뮬레이션
  await Promise.all(
    AGENT_STEPS.map(async ({ agentId, messages, durationMs }) => {
      const step = durationMs / messages.length;

      updateAgent(agentId, {
        status: "running",
        message: messages[0],
        startedAt: Date.now(),
      });

      for (let i = 1; i < messages.length; i++) {
        await delay(step);
        updateAgent(agentId, { message: messages[i] });
      }

      await delay(step);
      updateAgent(agentId, {
        status: "done",
        message: "분석 완료 ✓",
        finishedAt: Date.now(),
      });
    }),
  );

  // Phase 2: Bull / Bear 병렬
  await Promise.all([
    (async () => {
      updateAgent("bull", {
        status: "running",
        message: "강세 근거 구성 중...",
        startedAt: Date.now(),
      });
      await delay(2400);
      updateAgent("bull", {
        status: "running",
        message: "매수 논리 정리 중...",
      });
      await delay(1800);
      updateAgent("bull", {
        status: "done",
        message: "강세 논거 완료 ✓",
        finishedAt: Date.now(),
      });
    })(),
    (async () => {
      updateAgent("bear", {
        status: "running",
        message: "약세 근거 구성 중...",
        startedAt: Date.now(),
      });
      await delay(2100);
      updateAgent("bear", {
        status: "running",
        message: "리스크 요인 정리 중...",
      });
      await delay(2000);
      updateAgent("bear", {
        status: "done",
        message: "약세 논거 완료 ✓",
        finishedAt: Date.now(),
      });
    })(),
  ]);

  // Phase 3: Moderator
  updateAgent("moderator", {
    status: "running",
    message: "Bull / Bear 교차 검증 중...",
    startedAt: Date.now(),
  });
  await delay(2200);
  updateAgent("moderator", { message: "중립 요약 작성 중..." });
  await delay(1600);
  updateAgent("moderator", {
    status: "done",
    message: "중립 요약 완료 ✓",
    finishedAt: Date.now(),
  });

  // Phase 4: Reviewer
  updateAgent("reviewer", {
    status: "running",
    message: "수치 일관성 검증 중...",
    startedAt: Date.now(),
  });
  await delay(1800);
  updateAgent("reviewer", { message: "신뢰도 점수 산정 중..." });
  await delay(1200);
  updateAgent("reviewer", {
    status: "done",
    message: "신뢰도 87 / 100 ✓",
    finishedAt: Date.now(),
  });

  const job = getJob(jobId);
  if (job) {
    const report = generateReport(job.ticker, job.displayName);
    saveReport(jobId, report);
  }

  updateJob(jobId, { status: "done", finishedAt: Date.now() });
}
