import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/stock/")({
  component: StockSearchPage,
});

const SUGGESTIONS = [
  "삼성전자",
  "SK하이닉스",
  "NVIDIA",
  "Apple",
  "Tesla",
  "카카오",
  "NAVER",
  "Microsoft",
];

function StockSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stock/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "분석 요청에 실패했습니다");
        return;
      }

      const { jobId, ticker, displayName } = await res.json();
      navigate({ to: "/stock/$jobId", params: { jobId }, search: { ticker, displayName } });
    } catch {
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* 헤더 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[12px] text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            AI Analyst Team 대기 중
          </div>
          <h1 className="text-[36px] font-bold tracking-tight leading-tight">
            어떤 종목을 분석할까요?
          </h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            종목명 또는 티커를 입력하면 AI 애널리스트 팀이 즉시 분석을 시작합니다
          </p>
        </div>

        {/* 검색 폼 */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 삼성전자, AAPL, NVIDIA..."
            autoFocus
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 pr-36 text-[16px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition hover:bg-foreground/80 disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                요청 중
              </span>
            ) : (
              "분석 시작 →"
            )}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-center text-[13px] text-destructive">{error}</p>
        )}

        {/* 추천 종목 */}
        <div className="mt-6">
          <p className="mb-3 text-[12px] text-muted-foreground text-center">추천 종목</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] text-foreground transition hover:bg-secondary"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 안내 */}
        <p className="mt-10 text-center text-[12px] text-muted-foreground">
          KOSPI / KOSDAQ / S&amp;P500 주요 종목 지원 · 분석 소요 시간 약 20초
        </p>
      </div>
    </div>
  );
}
