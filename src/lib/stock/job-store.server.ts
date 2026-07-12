import type { AnalysisJob, AnalysisReport } from "./types";

// In-memory store — 개발/MVP 용도. 프로덕션에서는 Redis 또는 DB로 교체.
const jobs = new Map<string, AnalysisJob>();
const reports = new Map<string, AnalysisReport>();

export function createJob(job: AnalysisJob): void {
  jobs.set(job.jobId, job);
}

export function getJob(jobId: string): AnalysisJob | undefined {
  return jobs.get(jobId);
}

export function updateJob(jobId: string, patch: Partial<AnalysisJob>): void {
  const job = jobs.get(jobId);
  if (job) jobs.set(jobId, { ...job, ...patch });
}

export function saveReport(jobId: string, report: AnalysisReport): void {
  reports.set(jobId, report);
}

export function getReport(jobId: string): AnalysisReport | undefined {
  return reports.get(jobId);
}
