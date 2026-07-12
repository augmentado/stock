import { createFileRoute } from "@tanstack/react-router";
import { getReport } from "../../../lib/stock/job-store.server";
import { generateReport } from "../../../lib/stock/report-generator.server";

export const Route = createFileRoute("/api/stock/report")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const jobId = url.searchParams.get("jobId");
        const ticker = url.searchParams.get("ticker");
        const displayName = url.searchParams.get("displayName");

        if (!jobId) {
          return new Response(JSON.stringify({ error: "jobId가 필요합니다" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 먼저 in-memory에서 찾고, 없으면 ticker로 즉석 생성 (Vercel 서버리스 대응)
        let report = getReport(jobId);
        if (!report && ticker && displayName) {
          report = generateReport(ticker, decodeURIComponent(displayName));
        }

        if (!report) {
          return new Response(JSON.stringify({ error: "리포트를 찾을 수 없습니다" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(report), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
