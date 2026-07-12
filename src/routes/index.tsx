import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Augmenta — 평범한 사람이 전문가처럼 AI를 쓰게 되는 곳" },
      {
        name: "description",
        content:
          "AI에게 전달하는 생각의 구조가 없어서 결과가 매번 다릅니다. Augmenta는 당신의 생각을 AI가 이해하는 언어로 번역하는 생각의 통역기입니다.",
      },
      { property: "og:title", content: "Augmenta — 생각의 통역기" },
      {
        property: "og:description",
        content: "평범한 사람이 전문가처럼 AI를 쓰게 되는 곳. 생각을 AI가 이해하는 언어로 번역합니다.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Marquee />
      <Problem />
      <BeforeAfter />
      <SocialProof />
      <Impact />
      <Journey />
      <Features />
      <Position />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-[15px] font-bold tracking-tight">Augmenta</span>
        </a>
        <nav className="hidden gap-7 text-[13px] text-muted-foreground md:flex">
          <a href="#problem" className="hover:text-foreground">문제</a>
          <a href="#beforeafter" className="hover:text-foreground">Before & After</a>
          <a href="#journey" className="hover:text-foreground">작동방식</a>
          <a href="#features" className="hover:text-foreground">기능</a>
          <a href="#pricing" className="hover:text-foreground">요금</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/stock"
            className="rounded-full border border-border px-4 py-1.5 text-[12px] font-medium transition hover:bg-secondary"
          >
            주식 분석 →
          </Link>
          <a
            href="#cta"
            className="rounded-full bg-foreground px-4 py-1.5 text-[12px] font-medium text-background transition hover:bg-accent"
          >
            Waitlist
          </a>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" />
      <path d="M7 17L12 7L17 17M9 14H15" stroke="var(--paper)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border grain">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pt-24">
        <div className="mb-8 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-block h-px w-8 bg-foreground" />
          <span>생각의 통역기 · v0.1</span>
        </div>

        <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-[-0.025em] text-balance md:text-[72px]">
          AI를 시작했는데,<br />
          <span className="inline-flex items-baseline">
            <em className="not-italic text-accent">왜 결과는</em>
          </span><br />
          <span className="inline-flex items-baseline">
            <em className="not-italic text-accent">항상 다를까</em>
            <span className="ml-1 inline-block h-[0.9em] w-[0.08em] translate-y-[0.05em] bg-foreground blink" aria-hidden />
          </span>
          <span>요?</span>
        </h1>

        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
          ChatGPT에게 물어보는데 어떤 말을 해야 할지 모르겠고, 답변이 마음에 안 들어 다시 고치고, 
          결국 <span className="text-foreground font-medium">"AI는 나랑 안 맞나?"</span> 생각하게 됩니다.
          <br /><br />
          문제는 AI가 아닙니다. <span className="text-foreground font-medium">AI에게 전달하는 생각의 구조가 없기 때문입니다.</span>
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-background transition hover:bg-accent"
          >
            얼리 액세스 신청
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
          <Link
            to="/stock"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-[14px] font-medium text-foreground hover:bg-secondary transition"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            AI 주식 분석 체험하기
            <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */
function Marquee() {
  const items = [
    "AI Beginner",
    "1인 창업자",
    "마케터",
    "기획자",
    "크리에이터",
    "사이드 프로젝트",
    "개발 비전문가",
    "AI Power User",
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-border bg-foreground text-background">
      <div className="flex whitespace-nowrap py-4 marquee">
        {row.map((t, i) => (
          <span key={i} className="mx-6 font-display text-[14px] font-medium tracking-tight opacity-90">
            <span className="mr-6 text-accent">✦</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PROBLEM ---------------- */
function Problem() {
  const items = [
    {
      n: "01",
      title: "어떤 말을 해야 할지 모르겠다",
      body: '"마케팅 글 써줘"라고 하면 뻔한 내용이 나옵니다. 내 상황이 반영되지 않고, 다시 수정 요청을 반복하게 됩니다.',
    },
    {
      n: "02",
      title: "답변이 마음에 안 들어 다시 고친다",
      body: '원하는 방향의 답변을 얻기 어렵습니다. 매번 다른 결과가 나오고, 원하는 톤과 형식을 맞추는 데 시간이 오래 걸립니다.',
    },
    {
      n: "03",
      title: '"AI는 나랑 안 맞나?"',
      body: '결국 AI 활용을 포기하거나, 제대로 쓰는 사람과의 격차가 벌어집니다. 문제는 AI가 아니라 생각을 전달하는 구조입니다.',
    },
  ];
  return (
    <section id="problem" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader kicker="THE REAL PROBLEM" title={<>문제는 AI가 아닙니다.<br />생각의 구조가 없기 때문입니다.</>} />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {items.map((it) => (
            <div key={it.n} className="bg-card p-7">
              <div className="font-mono text-[11px] tracking-[0.2em] text-accent">{it.n}</div>
              <h3 className="mt-4 font-display text-[22px] font-bold tracking-tight">{it.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- BEFORE / AFTER ---------------- */
function BeforeAfter() {
  return (
    <section id="beforeafter" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader
          kicker="BEFORE & AFTER"
          title={
            <>
              내 생각을<br />
              <span className="text-accent">AI가 이해하는 형태</span>로 변환
            </>
          }
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* BEFORE */}
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">✕</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Before</span>
            </div>
            <h3 className="font-display text-[22px] font-bold tracking-tight">
              "좋은 질문을 해야 한다는데… 뭘 어떻게?"
            </h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-border bg-background p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">사용자</div>
                <p className="text-[14px] leading-relaxed">"마케팅 글 써줘"</p>
              </div>
              <div className="flex justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="rounded-xl border border-border bg-background p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">AI</div>
                <p className="text-[14px] leading-relaxed">"물론입니다. 마케팅 글을 작성해드릴게요."</p>
              </div>
              <div className="flex justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-destructive mb-2">결과</div>
                <ul className="space-y-1 text-[14px] leading-relaxed text-foreground">
                  <li>• 뻔한 내용</li>
                  <li>• 내 상황 반영 X</li>
                  <li>• 다시 수정 요청 반복</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-7">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">✓</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">After</span>
            </div>
            <h3 className="font-display text-[22px] font-bold tracking-tight">
              "우리 제품 홍보 글 써줘"
            </h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">사용자</div>
                <p className="text-[14px] leading-relaxed">"우리 제품 홍보 글 써줘"</p>
              </div>
              <div className="flex justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-accent">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="rounded-xl border border-accent/30 bg-background p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">Augmenta가 자동 변환</div>
                <pre className="font-mono text-[12px] leading-relaxed text-foreground whitespace-pre-wrap">
{`너는 10년차 퍼포먼스 마케터야.

목표:
30대 직장인 신규 고객 확보

제품:
OOO

톤:
신뢰감 + 친근함

출력:
광고 문구 5개
CTA 포함`}
                </pre>
              </div>
              <div className="flex justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-accent">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">결과</div>
                <ul className="space-y-1 text-[14px] leading-relaxed text-foreground">
                  <li>• 원하는 방향의 답변</li>
                  <li>• 재작업 감소</li>
                  <li>• 반복 사용 가능</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SOCIAL PROOF ---------------- */
function SocialProof() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader
          kicker="AI LITERACY"
          title={
            <>
              AI 시대의<br />
              <span className="text-accent">새로운 문해력</span>
            </>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="font-display text-[24px] font-bold tracking-tight leading-snug md:text-[28px]">
              이미 수백만 명이 AI를 사용하지만,<br />
              차이는 여기서 생깁니다.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive font-display font-bold text-[14px]">10</div>
                <div>
                  <div className="font-display text-[16px] font-bold">"AI 별거 없네"</div>
                  <p className="text-[13px] text-muted-foreground mt-1">결과가 매번 달라서 결국 포기</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-display font-bold text-[14px]">90</div>
                <div>
                  <div className="font-display text-[16px] font-bold">"내가 제대로 못 쓰는 것 같아"</div>
                  <p className="text-[13px] text-muted-foreground mt-1">확신 없이 반복하며 시간만 소모</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-accent/30 bg-accent/5 p-8">
            <p className="font-display text-[22px] font-bold tracking-tight leading-snug md:text-[26px]">
              Augmenta는<br />
              그 <span className="text-accent">90%</span>를 위한 도구입니다.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              AI를 잘 쓰는 사람과 못 쓰는 사람의 차이를 만드는 것은 재능이 아니라 
              <span className="text-foreground font-medium"> 질문의 구조</span>입니다.
            </p>
            <div className="mt-8 rounded-xl border border-border bg-background p-5">
              <p className="font-display text-[18px] font-bold tracking-tight leading-snug italic">
                "AI를 잘 쓰는 사람과 못 쓰는 사람의 차이를 만드는 것은 재능이 아니라 질문의 구조입니다."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- IMPACT (Numbers) ---------------- */
function Impact() {
  return (
    <section className="border-b border-border bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader
          kicker="IMPACT"
          dark
          title={
            <>
              숫자로 보는<br />
              <span className="text-accent">Augmenta의 차이</span>
            </>
          }
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-background/15 bg-background/15 md:grid-cols-2">
          {/* BEFORE */}
          <div className="bg-foreground p-8">
            <div className="flex items-center gap-2 mb-8">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 text-[10px] font-bold">✕</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-background/60">Augmenta 사용 전</span>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">⏱</span>
                  <span className="font-display text-[20px] font-bold">질문 작성</span>
                </div>
                <p className="mt-1 text-[14px] text-background/70 pl-9">10분 — 어떻게 물어볼지 고민</p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">🔄</span>
                  <span className="font-display text-[20px] font-bold">수정 반복</span>
                </div>
                <p className="mt-1 text-[14px] text-background/70 pl-9">3~5회 — 원하는 결과가 나올 때까지</p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">😕</span>
                  <span className="font-display text-[20px] font-bold">결과 만족</span>
                </div>
                <p className="mt-1 text-[14px] text-background/70 pl-9">낮음 — "다음에는 잘 해야지" 반복</p>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="bg-accent/10 p-8">
            <div className="flex items-center gap-2 mb-8">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">✓</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Augmenta 사용 후</span>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">⚡</span>
                  <span className="font-display text-[20px] font-bold">질문 구조화</span>
                </div>
                <p className="mt-1 text-[14px] text-background/80 pl-9">30초 — 생각만 입력하면 끝</p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">🔄</span>
                  <span className="font-display text-[20px] font-bold">수정</span>
                </div>
                <p className="mt-1 text-[14px] text-background/80 pl-9">1~2회 — 처음부터 방향이 맞음</p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">🎯</span>
                  <span className="font-display text-[20px] font-bold">목적 적중률</span>
                </div>
                <p className="mt-1 text-[14px] text-background/80 pl-9">향상 — 원하는 결과가 바로 나옴</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- JOURNEY ---------------- */
function Journey() {
  const [active, setActive] = useState(0);
  const steps = [
    {
      title: "Idea Input",
      sub: "아이디어 입력",
      desc: "자연어로 떠오르는 생각을 그대로 적습니다. “마케팅 콘텐츠를 자동 생성하고 싶어.”",
      tag: "natural language",
    },
    {
      title: "Augmentation",
      sub: "의도 구조화",
      desc: "Augmenta가 목적 · 필요한 정보 · 추천 AI 역할 · 최적 질문 구조를 생성합니다.",
      tag: "role · context · format",
    },
    {
      title: "Prompt Creation",
      sub: "프롬프트 생성",
      desc: "목적에 맞는 Prompt · Template · Workflow를 자동으로 만들어 줍니다.",
      tag: "auto-build",
    },
    {
      title: "Execute",
      sub: "실행",
      desc: "문서, 이미지, 분석, 콘텐츠, 서비스 아이디어까지 — 바로 실행해 결과물을 얻습니다.",
      tag: "one-click run",
    },
    {
      title: "Marketplace",
      sub: "공유 · 판매",
      desc: "Create → Share → Sell. 자신의 노하우를 상품화하고 수익을 얻습니다.",
      tag: "creator economy",
    },
  ];

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 3200);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <section id="journey" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader
          kicker="HOW IT WORKS"
          title={
            <>
              아이디어가 결과물이 되기까지<br />
              <span className="text-accent">다섯 걸음.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-10 md:grid-cols-[1.1fr_1fr]">
          {/* Step list */}
          <ol className="space-y-1">
            {steps.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.title}>
                  <button
                    onClick={() => setActive(i)}
                    className={`group flex w-full items-start gap-5 rounded-xl border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-accent bg-accent/5"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <span
                      className={`mt-1 font-mono text-[11px] tracking-[0.2em] ${
                        isActive ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="font-display text-[20px] font-bold tracking-tight md:text-[24px]">
                          {s.title}
                        </span>
                        <span className="text-[12px] text-muted-foreground">{s.sub}</span>
                      </span>
                      {isActive && (
                        <span className="mt-2 block text-[14px] leading-relaxed text-muted-foreground">
                          {s.desc}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Live panel */}
          <div className="sticky top-20 self-start rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                augmenta · step 0{active + 1}
              </span>
            </div>
            <div className="space-y-3 pt-5 font-mono text-[12.5px] leading-relaxed">
              <div className="text-muted-foreground">{`// ${steps[active].tag}`}</div>
              <div>
                <span className="text-accent">$</span> augmenta.run(<span className="text-foreground/70">"{steps[active].title}"</span>)
              </div>
              <div className="text-foreground/80">→ {steps[active].sub}</div>
              <div className="rounded-md bg-muted/50 p-3 text-foreground/80">
                {steps[active].desc}
              </div>
              <div className="text-muted-foreground">{`// status: ready`}<span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent blink" aria-hidden /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const feats = [
    {
      tag: "5.1",
      title: "AI Prompt Builder",
      desc: "목적 기반 Prompt 생성. 역할(Role) 추천 · Context 구조화 · 결과 형식 지정까지. 생각을 AI가 이해하는 언어로 번역합니다.",
      bullets: ["Role 추천", "Context 빌더", "Output Format"],
    },
    {
      tag: "5.2",
      title: "Prompt Marketplace",
      desc: "검증된 프롬프트를 발견하고 구매하세요. 카테고리 · 리뷰 · 평점으로 신뢰할 수 있는 결과를 보장합니다.",
      bullets: ["검증된 결과", "카테고리 탐색", "리뷰 · 평점"],
    },
    {
      tag: "5.3",
      title: "AI Workflow Library",
      desc: "Prompt를 넘어 '업무 해결 방법'을 거래합니다. 마케팅 · 채용 · 투자 분석 워크플로우를 원클릭으로 실행하세요.",
      bullets: ["멀티-스텝 자동화", "도구 연결", "원클릭 실행"],
    },
    {
      tag: "5.4",
      title: "Creator Economy",
      desc: "AI 전문가가 자신의 노하우를 상품화합니다. Prompt · Workflow · 구독 · Premium Pack으로 수익을 창출하세요.",
      bullets: ["수익 분배 80%", "팔로워 · 구독", "Featured 노출"],
    },
  ];
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader
          kicker="CORE FEATURES"
          title={
            <>
              질문하고, 실행하고,<br />
              <span className="text-accent">팔 수 있는</span> AI 인프라.
            </>
          }
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {feats.map((f) => (
            <article
              key={f.tag}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:border-foreground"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                  /{f.tag}
                </span>
                <span className="font-mono text-[11px] text-accent opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </div>
              <h3 className="mt-4 font-display text-[26px] font-bold tracking-tight md:text-[30px]">
                {f.title}
              </h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- POSITION ---------------- */
function Position() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader
          kicker="POSITIONING"
          title={
            <>
              PromptBase와<br />
              <span className="text-accent">다릅니다.</span>
            </>
          }
        />
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[1fr_1fr] border-b border-border bg-foreground px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-background/70 md:text-[11px]">
            <span>PromptBase</span>
            <span className="text-accent">Augmenta</span>
          </div>
          <div className="grid grid-cols-[1fr_1fr] items-center px-5 py-6 border-b border-border">
            <div>
              <div className="font-display text-[18px] font-bold tracking-tight text-muted-foreground">좋은 프롬프트를 사는 곳</div>
              <p className="mt-1 text-[13px] text-muted-foreground">프롬프트만 구매, 실행은 직접</p>
            </div>
            <div>
              <div className="font-display text-[18px] font-bold tracking-tight text-accent">평범한 사람이 전문가처럼 AI를 쓰게 되는 곳</div>
              <p className="mt-1 text-[13px] text-foreground">생각 → 구조 → 실행 → 결과까지 연결</p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_1fr] items-center px-5 py-6 border-b border-border">
            <div>
              <div className="font-display text-[18px] font-bold tracking-tight text-muted-foreground">템플릿 중심</div>
              <p className="mt-1 text-[13px] text-muted-foreground">상황에 맞게 수정해야 함</p>
            </div>
            <div>
              <div className="font-display text-[18px] font-bold tracking-tight text-accent">의도 중심</div>
              <p className="mt-1 text-[13px] text-foreground">내 상황을 AI가 이해하는 구조로 자동 변환</p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_1fr] items-center px-5 py-6">
            <div>
              <div className="font-display text-[18px] font-bold tracking-tight text-muted-foreground">단일 프롬프트</div>
              <p className="mt-1 text-[13px] text-muted-foreground">한 번의 질문에 그침</p>
            </div>
            <div>
              <div className="font-display text-[18px] font-bold tracking-tight text-accent">Workflow + 실행</div>
              <p className="mt-1 text-[13px] text-foreground">멀티스텝 자동화로 결과물까지 연결</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "₩0",
      sub: "시작하기",
      features: ["Prompt 생성 월 제한", "기본 Marketplace 탐색", "커뮤니티 워크플로우"],
      cta: "무료로 시작",
      ink: false,
    },
    {
      name: "Pro",
      price: "₩19,000",
      sub: "월 / 1인",
      features: [
        "Unlimited Prompt 생성",
        "Advanced Builder · 멀티 Role",
        "Workflow 무제한 실행",
        "Marketplace 우선 노출",
      ],
      cta: "Pro 시작",
      ink: true,
      href: "/checkout",
    },
    {
      name: "Creator",
      price: "수익 80%",
      sub: "플랫폼 수수료 20%",
      features: ["Prompt · Workflow 판매", "Premium Pack 구독", "Featured Creator 프로그램"],
      cta: "크리에이터 신청",
      ink: false,
    },
  ];
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeader
          kicker="MONETIZATION"
          title={<>쓰는 사람도, 만드는 사람도<br />함께 자라는 모델.</>}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-2xl border p-7 ${
                t.ink
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[20px] font-bold tracking-tight">{t.name}</h3>
                {t.ink && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-foreground">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-[40px] font-bold tracking-tight">{t.price}</span>
                <span className={`text-[12px] ${t.ink ? "text-background/60" : "text-muted-foreground"}`}>
                  {t.sub}
                </span>
              </div>
              <ul className={`mt-7 space-y-2.5 text-[13.5px] ${t.ink ? "text-background/85" : "text-foreground"}`}>
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              {(t as { href?: string }).href ? (
                <Link
                  to={(t as { href: string }).href}
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[13px] font-medium transition ${
                    t.ink
                      ? "bg-accent text-accent-foreground hover:opacity-90"
                      : "border border-foreground text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {t.cta} →
                </Link>
              ) : (
                <a
                  href="#cta"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[13px] font-medium transition ${
                    t.ink
                      ? "bg-accent text-accent-foreground hover:opacity-90"
                      : "border border-foreground text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {t.cta} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="cta" className="border-b border-border bg-accent text-accent-foreground">
      <div className="mx-auto max-w-4xl px-5 py-24 text-center md:py-32">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] opacity-80">
          Early Access · Limited
        </div>
        <h2 className="font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-balance md:text-[64px]">
          AI에게 말 걸었는데,<br />
          왜 자꾸 못 알아들을까요?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed opacity-90 md:text-[17px]">
          문제는 AI가 멍청해서가 아닙니다. 당신의 생각은 이미 좋은데, 
          아직 AI가 이해하는 언어로 번역되지 않았을 뿐입니다.
          <br /><br />
          <span className="font-bold">Augmenta는 생각의 통역기입니다.</span>
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setDone(true);
          }}
          className="mx-auto mt-10 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="flex-1 rounded-full border border-accent-foreground/20 bg-accent-foreground/10 px-5 py-3 text-[14px] text-accent-foreground placeholder:text-accent-foreground/50 outline-none focus:border-accent-foreground/60"
          />
          <button
            type="submit"
            className="rounded-full bg-accent-foreground px-6 py-3 text-[14px] font-medium text-accent transition hover:opacity-90"
          >
            {done ? "신청 완료 ✓" : "신청하기"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-display text-[15px] font-bold tracking-tight">Augmenta</span>
            </div>
            <p className="mt-3 max-w-sm text-[13px] text-muted-foreground">
              평범한 사람이 전문가처럼 AI를 쓰게 되는 곳 — 생각의 통역기.
            </p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            © {new Date().getFullYear()} Augmenta · Built for AI Creators
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- SECTION HEADER ---------------- */
function SectionHeader({
  kicker,
  title,
  dark,
}: {
  kicker: string;
  title: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${dark ? "text-background/60" : "text-muted-foreground"}`}>
        <span className={`inline-block h-px w-8 ${dark ? "bg-background" : "bg-foreground"}`} />
        {kicker}
      </div>
      <h2 className="mt-5 font-display text-[34px] font-bold leading-[1.05] tracking-[-0.02em] text-balance md:text-[56px]">
        {title}
      </h2>
    </div>
  );
}
