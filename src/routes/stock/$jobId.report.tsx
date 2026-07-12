import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AnalysisReport } from "../../lib/stock/types";

export const Route = createFileRoute("/stock/$jobId/report")({
  component: ReportPage,
});

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function fmt(v: number, currency: string) {
  if (currency === "KRW") {
    if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억원`;
    if (v >= 10000) return `${(v / 10000).toFixed(0)}만원`;
    return `${v.toLocaleString()}원`;
  }
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}T`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}B`;
  return `$${v.toLocaleString()}M`;
}

function fmtPrice(v: number, currency: string) {
  return currency === "KRW" ? `${v.toLocaleString()}원` : `$${v.toLocaleString()}`;
}

const REC_COLORS: Record<string, string> = {
  "강력 매수": "text-emerald-400",
  매수: "text-green-400",
  중립: "text-yellow-400",
  매도: "text-orange-400",
  "강력 매도": "text-red-400",
};

const REC_BG: Record<string, string> = {
  "강력 매수": "border-emerald-400/30 bg-emerald-400/5",
  매수: "border-green-400/30 bg-green-400/5",
  중립: "border-yellow-400/30 bg-yellow-400/5",
  매도: "border-orange-400/30 bg-orange-400/5",
  "강력 매도": "border-red-400/30 bg-red-400/5",
};

// ── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 ${className}`}>
      {children}
    </div>
  );
}

function HighlightChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[12px] text-foreground">
      {children}
    </span>
  );
}

function FinalVerdictCard({ report }: { report: AnalysisReport }) {
  const { finalVerdict: fv, currentPrice, currency } = report;
  const colorClass = REC_COLORS[fv.recommendation] ?? "text-foreground";
  const bgClass = REC_BG[fv.recommendation] ?? "border-border bg-card";

  return (
    <Card className={`${bgClass} mb-6`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">종합 투자 의견</p>
          <p className={`text-[32px] font-bold ${colorClass}`}>{fv.recommendation}</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            목표가 {fmtPrice(fv.targetPrice, currency)} · 현재가 {fmtPrice(currentPrice, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground mb-1">AI 신뢰도</p>
          <p className="text-[28px] font-bold text-foreground">{fv.confidence}<span className="text-[16px] text-muted-foreground">/100</span></p>
        </div>
      </div>
      <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed">{fv.rationale}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {fv.keyRisks.map((r) => (
          <span key={r} className="text-[11px] rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            ⚠ {r}
          </span>
        ))}
      </div>
    </Card>
  );
}

function FinancialSection({ report }: { report: AnalysisReport }) {
  const { financial, currency } = report;
  const chartData = financial.data.map((d) => ({
    year: d.year,
    매출: d.revenue,
    영업이익: d.operatingProfit,
    FCF: d.fcf,
  }));

  return (
    <div className="mb-8">
      <SectionTitle>Phase 1 — 재무 분석</SectionTitle>
      <Card>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{financial.summary}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {financial.highlights.map((h) => <HighlightChip key={h}>{h}</HighlightChip>)}
        </div>
        <p className="text-[11px] text-muted-foreground mb-2">
          매출 / 영업이익 / FCF 추이 ({currency === "KRW" ? "억원" : "M USD"})
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gOp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => fmt(v, currency)} tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} width={70} />
            <Tooltip
              formatter={(v: number, name: string) => [fmt(v, currency), name]}
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="매출" stroke="#a3a3a3" fill="url(#gRev)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="영업이익" stroke="#4ade80" fill="url(#gOp)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="FCF" stroke="#60a5fa" fill="none" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
          </AreaChart>
        </ResponsiveContainer>

        {/* ROE / 부채비율 미니 테이블 */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left font-normal py-1.5 pr-4">연도</th>
                {financial.data.map((d) => (
                  <th key={d.year} className="text-right font-normal py-1.5 px-2">{d.year}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-t border-border">
                <td className="py-1.5 pr-4 text-muted-foreground">ROE (%)</td>
                {financial.data.map((d) => (
                  <td key={d.year} className="text-right py-1.5 px-2">{d.roe}</td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <td className="py-1.5 pr-4 text-muted-foreground">부채비율 (%)</td>
                {financial.data.map((d) => (
                  <td key={d.year} className="text-right py-1.5 px-2">{d.debtRatio}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ValuationSection({ report }: { report: AnalysisReport }) {
  const { valuation, currency } = report;
  const dcfColors: Record<string, string> = { bear: "#f87171", base: "#60a5fa", bull: "#4ade80" };

  return (
    <div className="mb-8">
      <SectionTitle>Phase 1 — 밸류에이션</SectionTitle>
      <Card>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">{valuation.summary}</p>

        {/* 멀티플 비교 바 차트 */}
        <p className="text-[11px] text-muted-foreground mb-2">섹터 대비 멀티플 비교</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={valuation.multiples} layout="vertical" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="metric" type="category" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} width={60} />
            <Tooltip
              formatter={(v: number, name: string) => [`${v}배`, name]}
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="current" name="현재" radius={[0, 4, 4, 0]} fill="#a3a3a3" />
            <Bar dataKey="sector" name="섹터 평균" radius={[0, 4, 4, 0]} fill="rgba(163,163,163,0.25)" />
          </BarChart>
        </ResponsiveContainer>

        {/* DCF 시나리오 */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {valuation.dcf.map((d) => (
            <div key={d.scenario} className="rounded-xl border border-border p-3 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{d.label}</p>
              <p className="text-[18px] font-bold" style={{ color: dcfColors[d.scenario] }}>
                {fmtPrice(d.targetPrice, currency)}
              </p>
              <p className={`text-[11px] mt-0.5 ${d.upside >= 0 ? "text-green-400" : "text-red-400"}`}>
                {d.upside >= 0 ? "+" : ""}{d.upside}%
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MoatSection({ report }: { report: AnalysisReport }) {
  const { moat } = report;
  const radarData = moat.scores.map((s) => ({ subject: s.category, value: s.score }));

  return (
    <div className="mb-8">
      <SectionTitle>Phase 1 — 경쟁 해자</SectionTitle>
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-md">{moat.summary}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-[11px] text-muted-foreground">해자 점수</p>
            <p className="text-[32px] font-bold text-foreground">{moat.totalScore}</p>
            <p className="text-[11px] text-muted-foreground">{moat.verdict}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888" }} />
            <Radar dataKey="value" stroke="#a3a3a3" fill="#a3a3a3" fillOpacity={0.15} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-2 space-y-2">
          {moat.scores.map((s) => (
            <div key={s.category} className="flex items-center gap-3">
              <span className="text-[12px] text-muted-foreground w-24 shrink-0">{s.category}</span>
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground/70"
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <span className="text-[12px] text-foreground w-8 text-right">{s.score}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function GrowthSection({ report }: { report: AnalysisReport }) {
  const { growth } = report;
  const ratingColor: Record<string, string> = {
    "매우 높음": "text-emerald-400",
    높음: "text-green-400",
    보통: "text-yellow-400",
    낮음: "text-orange-400",
  };

  return (
    <div className="mb-8">
      <SectionTitle>Phase 1 — 성장 잠재력</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-md">{growth.summary}</p>
          <div className="text-right shrink-0">
            <p className="text-[11px] text-muted-foreground">성장성 등급</p>
            <p className={`text-[22px] font-bold ${ratingColor[growth.growthRating]}`}>{growth.growthRating}</p>
            <p className="text-[11px] text-muted-foreground">TAM {growth.tamSizeB}B USD</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wide">성장 카탈리스트</p>
            <ul className="space-y-1.5">
              {growth.catalysts.map((c) => (
                <li key={c} className="text-[12px] text-foreground flex gap-2">
                  <span className="text-green-400 shrink-0">↑</span>{c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wide">주요 리스크</p>
            <ul className="space-y-1.5">
              {growth.risks.map((r) => (
                <li key={r} className="text-[12px] text-foreground flex gap-2">
                  <span className="text-red-400 shrink-0">↓</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DebateSection({ report }: { report: AnalysisReport }) {
  return (
    <div className="mb-8">
      <SectionTitle>Phase 2 — Bull / Bear 토론</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="border-green-400/20 bg-green-400/5">
          <p className="text-[12px] font-semibold text-green-400 mb-3">{report.bullCase.title}</p>
          <ul className="space-y-2">
            {report.bullCase.points.map((p) => (
              <li key={p} className="text-[12px] text-muted-foreground flex gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">+</span>{p}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="border-red-400/20 bg-red-400/5">
          <p className="text-[12px] font-semibold text-red-400 mb-3">{report.bearCase.title}</p>
          <ul className="space-y-2">
            {report.bearCase.points.map((p) => (
              <li key={p} className="text-[12px] text-muted-foreground flex gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">−</span>{p}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function ModeratorSection({ report }: { report: AnalysisReport }) {
  const { moderatorVerdict: mv } = report;
  return (
    <div className="mb-8">
      <SectionTitle>Phase 3 — 중립 검증</SectionTitle>
      <Card>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{mv.summary}</p>
        <ul className="space-y-2">
          {mv.keyInsights.map((ins) => (
            <li key={ins} className="text-[12px] text-foreground flex gap-2">
              <span className="text-blue-400 shrink-0">→</span>{ins}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

function ReportPage() {
  const { jobId } = Route.useParams();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/stock/report?jobId=${jobId}`)
      .then((r) => {
        if (!r.ok) throw new Error("리포트를 불러올 수 없습니다");
        return r.json();
      })
      .then(setReport)
      .catch((e: Error) => setError(e.message));
  }, [jobId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Link to="/stock/$jobId" params={{ jobId }} className="text-[13px] text-muted-foreground hover:text-foreground transition">
            ← 분석 페이지로
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          리포트 로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-12">

        {/* 헤더 */}
        <div className="mb-8">
          <Link
            to="/stock/$jobId"
            params={{ jobId }}
            className="text-[13px] text-muted-foreground hover:text-foreground transition mb-4 inline-block"
          >
            ← 분석 진행 현황
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight">{report.displayName}</h1>
              <p className="mt-1 text-[13px] text-muted-foreground font-mono">{report.ticker}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-muted-foreground">현재가</p>
              <p className="text-[22px] font-bold">{fmtPrice(report.currentPrice, report.currency)}</p>
            </div>
          </div>
        </div>

        {/* 최종 의견 (상단 고정) */}
        <FinalVerdictCard report={report} />

        {/* 각 Phase 섹션 */}
        <FinancialSection report={report} />
        <ValuationSection report={report} />
        <MoatSection report={report} />
        <GrowthSection report={report} />
        <DebateSection report={report} />
        <ModeratorSection report={report} />

        {/* 푸터 */}
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          본 리포트는 AI 시뮬레이션 데이터 기반으로 생성되었으며 투자 권유가 아닙니다.
        </p>
      </div>
    </div>
  );
}
