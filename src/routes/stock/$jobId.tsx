import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { AgentLog, SSEEvent } from "../../lib/stock/types";

export const Route = createFileRoute("/stock/$jobId")({
  validateSearch: (search: Record<string, unknown>) => ({
    ticker: (search.ticker as string) ?? "",
    displayName: (search.displayName as string) ?? "",
  }),
  component: AnalysisPage,
});

type PageStatus = "running" | "done" | "error";

const AGENT_ORDER = [
  "financial",
  "valuation",
  "moat",
  "growth",
  "bull",
  "bear",
  "moderator",
  "reviewer",
] as const;

const PHASE_LABELS: Record<string, string> = {
  financial: "Phase 1 — 병렬 분석",
  valuation: "Phase 1 — 병렬 분석",
  moat: "Phase 1 — 병렬 분석",
  growth: "Phase 1 — 병렬 분석",
  bull: "Phase 2 — 강세 / 약세 토론",
  bear: "Phase 2 — 강세 / 약세 토론",
  moderator: "Phase 3 — 중립 검증",
  reviewer: "Phase 4 — 최종 검증",
};

function StatusDot({ status }: { status: AgentLog["status"] }) {
  if (status === "pending")
    return <span className="h-2 w-2 rounded-full bg-border" />;
  if (status === "running")
    return (
      <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
    );
  if (status === "done")
    return <span className="h-2 w-2 rounded-full bg-green-400" />;
  return <span className="h-2 w-2 rounded-full bg-destructive" />;
}

function AgentCard({ agent }: { agent: AgentLog }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
        agent.status === "running"
          ? "border-yellow-400/40 bg-yellow-400/5"
          : agent.status === "done"
            ? "border-green-400/30 bg-green-400/5"
            : agent.status === "error"
              ? "border-destructive/30 bg-destructive/5"
              : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <StatusDot status={agent.status} />
        <span className="text-[13px] font-medium">{agent.label}</span>
        {agent.status === "running" && (
          <span className="ml-auto text-[11px] text-muted-foreground animate-pulse">
            분석 중
          </span>
        )}
        {agent.status === "done" && (
          <span className="ml-auto text-[11px] text-green-400">완료</span>
        )}
      </div>
      {agent.status !== "pending" && (
        <p className="mt-1.5 ml-4 text-[12px] text-muted-foreground leading-relaxed">
          {agent.message}
        </p>
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
        <span>전체 진행률</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <span className="text-muted-foreground">
      {elapsed}초 경과
    </span>
  );
}

function AnalysisPage() {
  const { jobId } = Route.useParams();
  const { ticker, displayName } = Route.useSearch();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentLog[]>([]);
  const [pageStatus, setPageStatus] = useState<PageStatus>("running");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef(Date.now());

  useEffect(() => {

    const sse = new EventSource(`/api/stock/job?jobId=${jobId}`);

    sse.onmessage = (e) => {
      const event: SSEEvent = JSON.parse(e.data);

      if (event.type === "agent_update") {
        setAgents((prev) => {
          const exists = prev.find((a) => a.agentId === event.agent.agentId);
          if (!exists) return [...prev, event.agent];
          return prev.map((a) =>
            a.agentId === event.agent.agentId ? event.agent : a,
          );
        });
      } else if (event.type === "job_done") {
        setPageStatus("done");
        sse.close();
      } else if (event.type === "job_error") {
        setErrorMsg(event.message);
        setPageStatus("error");
        sse.close();
      }
    };

    sse.onerror = () => {
      setErrorMsg("서버 연결이 끊어졌습니다");
      setPageStatus("error");
      sse.close();
    };

    return () => sse.close();
  }, [jobId]);

  // 아직 에이전트 데이터가 없으면 스켈레톤 8개 표시
  const displayAgents: AgentLog[] =
    agents.length > 0
      ? AGENT_ORDER.map(
          (id) =>
            agents.find((a) => a.agentId === id) ?? {
              agentId: id,
              label: id,
              status: "pending",
              message: "대기 중...",
            },
        )
      : AGENT_ORDER.map((id) => ({
          agentId: id,
          label: "...",
          status: "pending" as const,
          message: "대기 중...",
        }));

  const phase1 = displayAgents.filter((a) =>
    ["financial", "valuation", "moat", "growth"].includes(a.agentId),
  );
  const phase2 = displayAgents.filter((a) =>
    ["bull", "bear"].includes(a.agentId),
  );
  const phase3 = displayAgents.filter((a) => a.agentId === "moderator");
  const phase4 = displayAgents.filter((a) => a.agentId === "reviewer");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            to="/stock"
            className="text-[13px] text-muted-foreground hover:text-foreground transition mb-4 inline-block"
          >
            ← 새 분석
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight">
                {displayName || "분석 중..."}
              </h1>
              {ticker && (
                <p className="mt-1 text-[13px] text-muted-foreground font-mono">
                  {ticker}
                </p>
              )}
            </div>
            <div className="text-right text-[12px]">
              {pageStatus === "running" && (
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <ElapsedTimer startedAt={startedAt.current} />
                </div>
              )}
              {pageStatus === "done" && (
                <span className="text-green-400 font-medium">분석 완료 ✓</span>
              )}
              {pageStatus === "error" && (
                <span className="text-destructive">오류 발생</span>
              )}
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        <ProgressBar agents={displayAgents} />

        {/* Phase 1 — 병렬 분석 */}
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Phase 1 — 병렬 분석
          </p>
          <div className="grid grid-cols-2 gap-2">
            {phase1.map((a) => (
              <AgentCard key={a.agentId} agent={a} />
            ))}
          </div>
        </div>

        {/* Phase 2 — 강세 / 약세 토론 */}
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Phase 2 — Bull / Bear 토론
          </p>
          <div className="grid grid-cols-2 gap-2">
            {phase2.map((a) => (
              <AgentCard key={a.agentId} agent={a} />
            ))}
          </div>
        </div>

        {/* Phase 3 — 중립 검증 */}
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Phase 3 — 중립 검증
          </p>
          {phase3.map((a) => (
            <AgentCard key={a.agentId} agent={a} />
          ))}
        </div>

        {/* Phase 4 — 최종 검증 */}
        <div className="mb-8">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Phase 4 — 최종 검증
          </p>
          {phase4.map((a) => (
            <AgentCard key={a.agentId} agent={a} />
          ))}
        </div>

        {/* 완료 상태 */}
        {pageStatus === "done" && (
          <div className="rounded-2xl border border-green-400/30 bg-green-400/5 px-6 py-5 text-center">
            <p className="text-[15px] font-semibold text-foreground mb-1">
              분석이 완료되었습니다
            </p>
            <p className="text-[13px] text-muted-foreground mb-4">
              {displayName} 종합 리포트가 준비되었습니다
            </p>
            <button
              onClick={() => navigate({
                to: "/stock/$jobId/report",
                params: { jobId },
                search: { ticker, displayName },
              })}
              className="rounded-full bg-foreground px-6 py-2.5 text-[14px] font-medium text-background transition hover:bg-foreground/80"
            >
              리포트 보기 →
            </button>
          </div>
        )}

        {/* 에러 상태 */}
        {pageStatus === "error" && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-5 text-center">
            <p className="text-[14px] text-destructive mb-3">{errorMsg}</p>
            <Link
              to="/stock"
              className="inline-block rounded-full border border-border px-6 py-2.5 text-[14px] font-medium transition hover:bg-secondary"
            >
              다시 시도
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
