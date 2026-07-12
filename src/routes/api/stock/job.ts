import { createFileRoute } from "@tanstack/react-router";
import { getJob } from "../../../lib/stock/job-store.server";
import type { SSEEvent } from "../../../lib/stock/types";

export const Route = createFileRoute("/api/stock/job")({
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

        const encoder = new TextEncoder();

        function send(event: SSEEvent): Uint8Array {
          return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
        }

        const stream = new ReadableStream({
          async start(controller) {
            const POLL_MS = 300;
            const TIMEOUT_MS = 120_000;
            const started = Date.now();
            const seen = new Map<string, string>();

            const tick = async () => {
              if (Date.now() - started > TIMEOUT_MS) {
                controller.enqueue(
                  send({ type: "job_error", message: "분석 시간 초과" }),
                );
                controller.close();
                return;
              }

              const job = getJob(jobId);
              if (!job) {
                controller.enqueue(
                  send({ type: "job_error", message: "잡을 찾을 수 없습니다" }),
                );
                controller.close();
                return;
              }

              for (const agent of job.agents) {
                const key = `${agent.status}|${agent.message}`;
                if (seen.get(agent.agentId) !== key) {
                  seen.set(agent.agentId, key);
                  controller.enqueue(send({ type: "agent_update", agent }));
                }
              }

              if (job.status === "done") {
                controller.enqueue(send({ type: "job_done" }));
                controller.close();
                return;
              }

              if (job.status === "error") {
                controller.enqueue(
                  send({ type: "job_error", message: job.error ?? "분석 실패" }),
                );
                controller.close();
                return;
              }

              await new Promise<void>((r) => setTimeout(r, POLL_MS));
              await tick();
            };

            await tick();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
