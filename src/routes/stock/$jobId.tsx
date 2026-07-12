import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { AgentId, AgentLog } from "../../lib/stock/types";

export const Route = createFileRoute("/stock/$jobId")({
  validateSearch: (search: Record<string, unknown>) => ({
    ticker: (search.ticker as string) ?? "",
    displayName: (search.displayName as string) ?? "",
  }),
  component: AnalysisPage,
});

type PageStatus = "running" | "done";

const AGENT_ORDER: AgentId[] = [
  "financial", "valuation", "moat", "growth",
  "bull", "bear", "moderator", "reviewer",
];

const AGENT_LABELS: Record<AgentId, string> = {
  financial: "재무 에이전트",
  valuation: "밸류에이션 에이전트",
  moat: "경쟁 해자 에이전트",
  growth: "성장 잠재력 에이전트",
  bull: "강세론 에이전트",
  bear: "약세론 에이전트",
  moderator: "사회자 에이전트",
  reviewer: "검증 에이전트",
};

// 클라이언트 시뮬레이션 스텝 정의
const SIM_STEPS: Array<{
  agentId: AgentId;
  messages: string[];
  durationMs: number;
}> = [
  { agentId: "financial", messages: ["최근 5년 재무제표 수집 중...", "FCF / ROE / 부채비율 계산 중...", "재무 트렌드 분석 완료"], durationMs: 3200 },
  { agentId: "valuation", messages: ["현재 주가 및 시가총액 수집 중...", "PER / PBR / EV·EBITDA 산출 중...", "DCF 3개 시나리오 계산 완료"], durationMs: 3800 },
  { agentId: "moat", messages: ["브랜드 / 전환비용 / 네트워크 효과 분석 중...", "경쟁사 대비 해자 점수 산출 중...", "해자 평가 완료"], durationMs: 2900 },
  { agentId: "growth", messages: ["TAM / SAM 규모 조사 중...", "신사업 카탈리스트 분석 중...", "성장성 평가 완료"], durationMs: 3400 },
];

function makeInitial(): AgentLog[] {
  return AGENT_ORDER.map((id) => ({
    agentId: id,
    label: AGENT_LABELS[id],
    status: "pending" as const,
    message: "대기 중...",
  }));
}

function StatusDot({ status }: { status: AgentLog["status"] }) {
  if (status === "pending") return <span className="h-2 w-2 rounded-full bg-border" />;
  if (status === "running") return <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />;
  if (status === "done") return <span className="h-2 w-2 rounded-full bg-green-400" />;
  return <span className="h-2 w-2 rounded-full bg-destructive" />;
}

function AgentCard({ agent }: { agent: AgentLog }) {
  return (
    <div className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
      agent.status === "running" ? "border-yellow-400/40 bg-yellow-400/5"
      : agent.status === "done" ? "border-green-400/30 bg-green-400/5"
      : "border-border bg-card"
    }`}>
      <div className="flex items-center gap-2.5">
        <StatusDot status={agent.status} />
        <span className="text-[13px] font-medium">{agent.label}</span>
        {agent.status === "running" && <span className="ml-auto text-[11px] text-muted-foreground animate-pulse">분석 중</span>}
        {agent.status === "done" && <span className="ml-auto text-[11px] text-green-400">완료</span>}
      </div>
      {agent.status !== "pending" && (
        <p className="mt-1.5 ml-4 text-[12px] text-muted-foreground leading-relaxed">{agent.message}</p>
      )}
    </div>
  );
}

function ProgressBar({ agents }: { agents: AgentLog[] }) {
  const done = agents.filter((a) => a.status === "done").length;
  const pct = Math.round((done / agents.length) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1.5 text-[12px] text-muted-foreground">
        <span>전체 진행률</span><span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return <span className="text-muted-foreground">{elapsed}초 경과</span>;
}

function AnalysisPage() {
  const { jobId } = Route.useParams();
  const { ticker, displayName } = Route.useSearch();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentLog[]>(makeInitial);
  const [pageStatus, setPageStatus] = useState<PageStatus>("running");
  const startedAt = useRef(Date.now());
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    function patch(agentId: AgentId, update: Partial<AgentLog>) {
      setAgents((prev) => prev.map((a) => a.agentId === agentId ? { ...a, ...update } : a));
    }

    async function runSim() {
      // Phase 1 — 4개 에이전트 병렬
      await Promise.all(SIM_STEPS.map(async ({ agentId, messages, durationMs }) => {
        const step = durationMs / messages.length;
        patch(agentId, { status: "running", message: messages[0], startedAt: Date.now() });
        for (let i = 1; i < messages.length; i++) {
          await delay(step);
          patch(agentId, { message: messages[i] });
        }
        await delay(step);
        patch(agentId, { status: "done", message: "분석 완료 ✓", finishedAt: Date.now() });
      }));

      // Phase 2 — Bull / Bear 병렬
      await Promise.all([
        (async () => {
          patch("bull", { status: "running", message: "강세 근거 구성 중...", startedAt: Date.now() });
          await delay(2400);
          patch("bull", { message: "매수 논리 정리 중..." });
          await delay(1800);
          patch("bull", { status: "done", message: "강세 논거 완료 ✓", finishedAt: Date.now() });
        })(),
        (async () => {
          patch("bear", { status: "running", message: "약세 근거 구성 중...", startedAt: Date.now() });
          await delay(2100);
          patch("bear", { message: "리스크 요인 정리 중..." });
          await delay(2000);
          patch("bear", { status: "done", message: "약세 논거 완료 ✓", finishedAt: Date.now() });
        })(),
      ]);

      // Phase 3
      patch("moderator", { status: "running", message: "Bull / Bear 교차 검증 중...", startedAt: Date.now() });
      await delay(2200);
      patch("moderator", { message: "중립 요약 작성 중..." });
      await delay(1600);
      patch("moderator", { status: "done", message: "중립 요약 완료 ✓", finishedAt: Date.now() });

      // Phase 4
      patch("reviewer", { status: "running", message: "수치 일관성 검증 중...", startedAt: Date.now() });
      await delay(1800);
      patch("reviewer", { message: "신뢰도 점수 산정 중..." });
      await delay(1200);
      patch("reviewer", { status: "done", message: "신뢰도 87 / 100 ✓", finishedAt: Date.now() });

      setPageStatus("done");
    }

    runSim();
  }, []);

  const phase1 = agents.filter((a) => ["financial", "valuation", "moat", "growth"].includes(a.agentId));
  const phase2 = agents.filter((a) => ["bull", "bear"].includes(a.agentId));
  const phase3 = agents.filter((a) => a.agentId === "moderator");
  const phase4 = agents.filter((a) => a.agentId === "reviewer");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <Link to="/stock" className="text-[13px] text-muted-foreground hover:text-foreground transition mb-4 inline-block">
            ← 새 분석
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight">{displayName || "분석 중..."}</h1>
              {ticker && <p className="mt-1 text-[13px] text-muted-foreground font-mono">{ticker}</p>}
            </div>
            <div className="text-right text-[12px]">
              {pageStatus === "running" && (
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <ElapsedTimer startedAt={startedAt.current} />
                </div>
              )}
              {pageStatus === "done" && <span className="text-green-400 font-medium">분석 완료 ✓</span>}
            </div>
          </div>
        </div>

        <ProgressBar agents={agents} />

        <div className="mb-5">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Phase 1 — 병렬 분석</p>
          <div className="grid grid-cols-2 gap-2">
            {phase1.map((a) => <AgentCard key={a.agentId} agent={a} />)}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Phase 2 — Bull / Bear 토론</p>
          <div className="grid grid-cols-2 gap-2">
            {phase2.map((a) => <AgentCard key={a.agentId} agent={a} />)}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Phase 3 — 중립 검증</p>
          {phase3.map((a) => <AgentCard key={a.agentId} agent={a} />)}
        </div>

        <div className="mb-8">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Phase 4 — 최종 검증</p>
          {phase4.map((a) => <AgentCard key={a.agentId} agent={a} />)}
        </div>

        {pageStatus === "done" && (
          <div className="rounded-2xl border border-green-400/30 bg-green-400/5 px-6 py-5 text-center">
            <p className="text-[15px] font-semibold text-foreground mb-1">분석이 완료되었습니다</p>
            <p className="text-[13px] text-muted-foreground mb-4">{displayName} 종합 리포트가 준비되었습니다</p>
            <button
              onClick={() => navigate({ to: "/stock/$jobId/report", params: { jobId }, search: { ticker, displayName } })}
              className="rounded-full bg-foreground px-6 py-2.5 text-[14px] font-medium text-background transition hover:bg-foreground/80"
            >
              리포트 보기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
