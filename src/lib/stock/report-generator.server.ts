import type {
  AnalysisReport,
  FinancialData,
  ValuationData,
  ScenarioDCF,
  MoatScore,
} from "./types";

// 종목별 시뮬레이션 프로파일
interface StockProfile {
  sector: string;
  currency: "KRW" | "USD";
  priceBase: number;
  revenueBase: number;  // 억원 or M USD
  revenueGrowthRate: number;
  marginBase: number;
  moatType: "brand" | "platform" | "semi" | "finance";
  tamB: number;  // TAM in billion USD
}

const PROFILES: Record<string, StockProfile> = {
  "NVDA": { sector: "반도체", currency: "USD", priceBase: 135, revenueBase: 44000, revenueGrowthRate: 0.85, marginBase: 0.55, moatType: "semi", tamB: 3000 },
  "AAPL": { sector: "소비자 전자", currency: "USD", priceBase: 195, revenueBase: 394000, revenueGrowthRate: 0.08, marginBase: 0.25, moatType: "brand", tamB: 2000 },
  "MSFT": { sector: "클라우드/소프트웨어", currency: "USD", priceBase: 420, revenueBase: 211000, revenueGrowthRate: 0.16, marginBase: 0.40, moatType: "platform", tamB: 4000 },
  "TSLA": { sector: "전기차", currency: "USD", priceBase: 250, revenueBase: 97700, revenueGrowthRate: 0.22, marginBase: 0.10, moatType: "brand", tamB: 1500 },
  "META": { sector: "소셜 미디어", currency: "USD", priceBase: 490, revenueBase: 134900, revenueGrowthRate: 0.22, marginBase: 0.38, moatType: "platform", tamB: 1200 },
  "AMZN": { sector: "이커머스/클라우드", currency: "USD", priceBase: 185, revenueBase: 574800, revenueGrowthRate: 0.12, marginBase: 0.07, moatType: "platform", tamB: 5000 },
  "GOOGL": { sector: "광고/클라우드", currency: "USD", priceBase: 170, revenueBase: 307400, revenueGrowthRate: 0.14, marginBase: 0.28, moatType: "platform", tamB: 3500 },
  "005930.KS": { sector: "반도체", currency: "KRW", priceBase: 78000, revenueBase: 2587000, revenueGrowthRate: 0.10, marginBase: 0.15, moatType: "semi", tamB: 800 },
  "000660.KS": { sector: "반도체", currency: "KRW", priceBase: 195000, revenueBase: 343000, revenueGrowthRate: 0.28, marginBase: 0.18, moatType: "semi", tamB: 300 },
  "035720.KS": { sector: "플랫폼", currency: "KRW", priceBase: 38000, revenueBase: 71000, revenueGrowthRate: 0.06, marginBase: 0.12, moatType: "platform", tamB: 100 },
  "035420.KS": { sector: "플랫폼", currency: "KRW", priceBase: 220000, revenueBase: 97000, revenueGrowthRate: 0.09, marginBase: 0.22, moatType: "platform", tamB: 150 },
};

const DEFAULT_PROFILE: StockProfile = {
  sector: "기타",
  currency: "USD",
  priceBase: 100,
  revenueBase: 50000,
  revenueGrowthRate: 0.10,
  marginBase: 0.15,
  moatType: "brand",
  tamB: 200,
};

function getProfile(ticker: string): StockProfile {
  return PROFILES[ticker] ?? DEFAULT_PROFILE;
}

function jitter(base: number, pct = 0.04): number {
  return base * (1 + (Math.random() * 2 - 1) * pct);
}

function round(v: number, d = 0): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function buildFinancialData(p: StockProfile): FinancialData[] {
  const years = ["2020", "2021", "2022", "2023", "2024"];
  const baseFCFRatio = 0.12;
  return years.map((year, i) => {
    const growthFactor = Math.pow(1 + p.revenueGrowthRate * 0.6, i - 4) * (1 + p.revenueGrowthRate);
    const revenue = round(jitter(p.revenueBase * growthFactor), 0);
    const opProfit = round(revenue * jitter(p.marginBase, 0.06));
    const netIncome = round(opProfit * jitter(0.82, 0.04));
    const fcf = round(revenue * jitter(baseFCFRatio, 0.08));
    const roe = round(jitter(14 + p.marginBase * 80, 0.1), 1);
    const debtRatio = round(jitter(45 - p.marginBase * 60, 0.1), 1);
    return { year, revenue, operatingProfit: opProfit, netIncome, fcf, roe, debtRatio };
  });
}

function buildValuationMultiples(p: StockProfile): ValuationData[] {
  const sectorPER = p.sector.includes("반도체") ? 28 : p.sector.includes("플랫폼") ? 35 : 22;
  return [
    { metric: "PER", current: round(jitter(sectorPER * 1.15, 0.08), 1), sector: round(jitter(sectorPER, 0.05), 1), label: "배" },
    { metric: "PBR", current: round(jitter(4.2, 0.1), 2), sector: round(jitter(3.1, 0.08), 2), label: "배" },
    { metric: "EV/EBITDA", current: round(jitter(18.5, 0.08), 1), sector: round(jitter(14.2, 0.06), 1), label: "배" },
    { metric: "PSR", current: round(jitter(5.8, 0.1), 2), sector: round(jitter(4.0, 0.08), 2), label: "배" },
  ];
}

function buildDCF(p: StockProfile): ScenarioDCF[] {
  const base = p.priceBase;
  return [
    { scenario: "bear", label: "약세 시나리오", targetPrice: round(base * jitter(0.72, 0.04)), upside: round(-28 + jitter(0, 0.2) * 10, 1) },
    { scenario: "base", label: "기본 시나리오", targetPrice: round(base * jitter(1.15, 0.04)), upside: round(15 + jitter(0, 0.3) * 8, 1) },
    { scenario: "bull", label: "강세 시나리오", targetPrice: round(base * jitter(1.55, 0.05)), upside: round(55 + jitter(0, 0.2) * 10, 1) },
  ];
}

function buildMoatScores(p: StockProfile): MoatScore[] {
  const profiles: Record<string, number[]> = {
    brand:    [82, 68, 55, 45, 73],
    platform: [75, 88, 90, 60, 70],
    semi:     [70, 72, 65, 90, 68],
    finance:  [65, 58, 50, 55, 80],
  };
  const bases = profiles[p.moatType];
  const categories = ["브랜드 파워", "전환 비용", "네트워크 효과", "규모의 경제", "특허/IP"];
  return categories.map((category, i) => ({
    category,
    score: Math.min(100, round(jitter(bases[i], 0.08))),
    max: 100,
  }));
}

function buildMoatSummary(p: StockProfile, totalScore: number): string {
  if (totalScore >= 75) return `${p.sector} 내 강력한 경쟁 해자 보유. 진입 장벽이 높아 장기 수익성 방어 가능.`;
  if (totalScore >= 60) return `${p.sector} 내 적정 수준의 경쟁 우위. 일부 항목 강화 필요.`;
  return `${p.sector} 내 경쟁 해자가 제한적. 신규 경쟁자 진입 리스크 주시 필요.`;
}

function buildBullPoints(p: StockProfile, displayName: string): string[] {
  const base = [
    `${displayName}의 ${p.sector} 내 시장 점유율은 지속적으로 확대 중`,
    `FCF 마진 개선 추세로 자사주 매입 및 배당 여력 증가`,
    `AI·클라우드 관련 신사업이 차세대 성장 동력으로 부상`,
    `비용 효율화를 통한 영업이익률 구조적 개선 진행 중`,
    `글로벌 경기 회복 시 수요 탄력성이 높아 실적 레버리지 기대`,
  ];
  return base.slice(0, 4);
}

function buildBearPoints(p: StockProfile, displayName: string): string[] {
  const base = [
    `현재 멀티플이 역사적 평균 대비 프리미엄 구간에 위치`,
    `글로벌 금리 변동성이 성장주 밸류에이션에 압력 요인`,
    `${p.sector} 경쟁 심화로 단기 마진 스퀴즈 가능성`,
    `거시경제 침체 시 실적 추정치 하향 조정 리스크`,
    `규제 리스크 및 지정학적 불확실성 상존`,
  ];
  return base.slice(0, 4);
}

function pickRecommendation(upside: number): AnalysisReport["finalVerdict"]["recommendation"] {
  if (upside >= 30) return "강력 매수";
  if (upside >= 10) return "매수";
  if (upside >= -5) return "중립";
  if (upside >= -20) return "매도";
  return "강력 매도";
}

export function generateReport(ticker: string, displayName: string): AnalysisReport {
  const p = getProfile(ticker);
  const financialData = buildFinancialData(p);
  const multiples = buildValuationMultiples(p);
  const dcf = buildDCF(p);
  const moatScores = buildMoatScores(p);
  const moatTotal = round(moatScores.reduce((s, m) => s + m.score, 0) / moatScores.length, 1);
  const baseScenario = dcf.find((d) => d.scenario === "base")!;
  const bearScenarioDCF = dcf.find((d) => d.scenario === "bear")!;
  const bullScenario = dcf.find((d) => d.scenario === "bull")!;
  const currentPrice = round(jitter(p.priceBase, 0.02));
  const confidence = round(jitter(84, 0.06));
  const growthRating: AnalysisReport["growth"]["growthRating"] =
    p.revenueGrowthRate >= 0.4 ? "매우 높음" : p.revenueGrowthRate >= 0.2 ? "높음" : p.revenueGrowthRate >= 0.1 ? "보통" : "낮음";

  const latestFin = financialData[financialData.length - 1];

  return {
    ticker,
    displayName,
    currentPrice,
    currency: p.currency,
    generatedAt: Date.now(),

    financial: {
      summary: `최근 5년 매출 CAGR ${round(p.revenueGrowthRate * 0.6 * 100, 1)}%, FCF 마진 ${round(latestFin.fcf / latestFin.revenue * 100, 1)}% 수준으로 재무 건전성 양호. ROE ${latestFin.roe}%로 자기자본 효율성 확인.`,
      data: financialData,
      highlights: [
        `2024년 매출 ${p.currency === "KRW" ? (latestFin.revenue / 10000).toFixed(0) + "조원" : (latestFin.revenue / 1000).toFixed(0) + "B USD"}`,
        `영업이익률 ${round(latestFin.operatingProfit / latestFin.revenue * 100, 1)}%`,
        `ROE ${latestFin.roe}% · 부채비율 ${latestFin.debtRatio}%`,
        `FCF ${p.currency === "KRW" ? (latestFin.fcf / 10000).toFixed(1) + "조원" : (latestFin.fcf / 1000).toFixed(0) + "B USD"}`,
      ],
    },

    valuation: {
      summary: `현재 PER ${multiples[0].current}배로 섹터 평균(${multiples[0].sector}배) 대비 ${round((multiples[0].current / multiples[0].sector - 1) * 100, 1)}% 프리미엄. DCF 기본 시나리오 기준 목표가 ${p.currency === "KRW" ? currentPrice.toLocaleString() + "원" : "$" + currentPrice}.`,
      multiples,
      dcf,
      fairValueRange: [bearScenarioDCF.targetPrice, bullScenario.targetPrice],
    },

    moat: {
      summary: buildMoatSummary(p, moatTotal),
      totalScore: moatTotal,
      scores: moatScores,
      verdict: moatTotal >= 70 ? "강한 해자" : moatTotal >= 55 ? "보통 해자" : "약한 해자",
    },

    growth: {
      summary: `TAM ${p.tamB}B USD 규모 시장에서 ${p.sector} 리더십 유지. AI·디지털 전환 수혜 카탈리스트 다수.`,
      tamSizeB: p.tamB,
      catalysts: [
        "AI 인프라 투자 사이클 지속",
        `${p.sector} 신제품 출시 일정`,
        "신흥 시장 점유율 확대",
        "구독·서비스 매출 비중 증가",
      ],
      risks: [
        "경기 침체에 따른 IT 투자 감소",
        "규제 강화 및 반독점 리스크",
        "환율 및 원자재 비용 변동",
      ],
      growthRating,
    },

    bullCase: {
      title: "강세 시나리오 — 매수 근거",
      points: buildBullPoints(p, displayName),
    },

    bearCase: {
      title: "약세 시나리오 — 리스크 요인",
      points: buildBearPoints(p, displayName),
    },

    moderatorVerdict: {
      summary: `Bull/Bear 논거를 교차 검증한 결과, 단기 밸류에이션 부담에도 불구하고 ${displayName}의 중장기 펀더멘털은 긍정적입니다. 목표가 범위 ${p.currency === "KRW" ? bearScenarioDCF.targetPrice.toLocaleString() + "~" + bullScenario.targetPrice.toLocaleString() + "원" : "$" + bearScenarioDCF.targetPrice + "~$" + bullScenario.targetPrice}.`,
      keyInsights: [
        `현재 주가는 DCF 적정가 범위 내에 위치`,
        `경쟁 해자 점수 ${moatTotal}점으로 장기 수익성 방어력 확인`,
        `${growthRating} 성장성과 ${round(latestFin.operatingProfit / latestFin.revenue * 100, 1)}% 영업이익률 조합 긍정적`,
        `단기 매크로 불확실성은 오히려 분할 매수 기회`,
      ],
    },

    finalVerdict: {
      recommendation: pickRecommendation(baseScenario.upside),
      targetPrice: baseScenario.targetPrice,
      confidence,
      rationale: `${displayName}은 ${p.sector} 내 견조한 경쟁 우위와 ${growthRating} 성장 잠재력을 보유. 현재 주가 기준 기본 시나리오 상승 여력 ${baseScenario.upside}%, 목표가 ${p.currency === "KRW" ? baseScenario.targetPrice.toLocaleString() + "원" : "$" + baseScenario.targetPrice}.`,
      keyRisks: [
        "거시경제 불확실성에 따른 실적 하향 조정",
        "경쟁 심화로 인한 마진 압박",
        "규제 환경 변화 리스크",
      ],
    },
  };
}
