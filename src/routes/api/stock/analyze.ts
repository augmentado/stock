import { createFileRoute } from "@tanstack/react-router";
import { normalizeTicker } from "../../../lib/stock/ticker";
import { startAnalysis } from "../../../lib/stock/orchestrator.server";
import { getJob } from "../../../lib/stock/job-store.server";
import type { AnalyzeRequest, AnalyzeResponse } from "../../../lib/stock/types";

export const Route = createFileRoute("/api/stock/analyze")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const jobId = url.searchParams.get("jobId");
        if (!jobId) {
          return new Response(JSON.stringify({ error: "jobId가 필요합니다" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const job = getJob(jobId);
        if (!job) {
          return new Response(JSON.stringify({ error: "잡을 찾을 수 없습니다" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({ ticker: job.ticker, displayName: job.displayName }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
      POST: async ({ request }) => {
        const body: AnalyzeRequest = await request.json();
        const query = body?.query?.trim();

        if (!query) {
          return new Response(JSON.stringify({ error: "종목명을 입력해주세요" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { ticker, displayName } = normalizeTicker(query);
        const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        await startAnalysis(jobId, ticker, displayName);

        const res: AnalyzeResponse = { jobId, ticker, displayName };
        return new Response(JSON.stringify(res), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
