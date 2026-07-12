import { createFileRoute } from "@tanstack/react-router";
import { getReport } from "../../../lib/stock/job-store.server";

export const Route = createFileRoute("/api/stock/report")({
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

        const report = getReport(jobId);
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
