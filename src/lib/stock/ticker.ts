interface TickerInfo {
  ticker: string;
  displayName: string;
}

// 국내 주요 종목 매핑 (코스피/코스닥 상위)
const KR_TICKERS: Record<string, TickerInfo> = {
  삼성전자: { ticker: "005930.KS", displayName: "삼성전자" },
  "삼성전자우": { ticker: "005935.KS", displayName: "삼성전자우" },
  sk하이닉스: { ticker: "000660.KS", displayName: "SK하이닉스" },
  lg에너지솔루션: { ticker: "373220.KS", displayName: "LG에너지솔루션" },
  삼성바이오로직스: { ticker: "207940.KS", displayName: "삼성바이오로직스" },
  현대차: { ticker: "005380.KS", displayName: "현대차" },
  현대자동차: { ticker: "005380.KS", displayName: "현대차" },
  기아: { ticker: "000270.KS", displayName: "기아" },
  셀트리온: { ticker: "068270.KS", displayName: "셀트리온" },
  포스코홀딩스: { ticker: "005490.KS", displayName: "POSCO홀딩스" },
  카카오: { ticker: "035720.KS", displayName: "카카오" },
  네이버: { ticker: "035420.KS", displayName: "NAVER" },
  naver: { ticker: "035420.KS", displayName: "NAVER" },
  카카오뱅크: { ticker: "323410.KS", displayName: "카카오뱅크" },
  lg화학: { ticker: "051910.KS", displayName: "LG화학" },
  삼성sdi: { ticker: "006400.KS", displayName: "삼성SDI" },
  "005930": { ticker: "005930.KS", displayName: "삼성전자" },
  "000660": { ticker: "000660.KS", displayName: "SK하이닉스" },
};

// 미국 주요 종목 매핑
const US_TICKERS: Record<string, TickerInfo> = {
  apple: { ticker: "AAPL", displayName: "Apple" },
  aapl: { ticker: "AAPL", displayName: "Apple" },
  microsoft: { ticker: "MSFT", displayName: "Microsoft" },
  msft: { ticker: "MSFT", displayName: "Microsoft" },
  nvidia: { ticker: "NVDA", displayName: "NVIDIA" },
  nvda: { ticker: "NVDA", displayName: "NVIDIA" },
  amazon: { ticker: "AMZN", displayName: "Amazon" },
  amzn: { ticker: "AMZN", displayName: "Amazon" },
  google: { ticker: "GOOGL", displayName: "Alphabet (Google)" },
  alphabet: { ticker: "GOOGL", displayName: "Alphabet (Google)" },
  googl: { ticker: "GOOGL", displayName: "Alphabet (Google)" },
  meta: { ticker: "META", displayName: "Meta Platforms" },
  tesla: { ticker: "TSLA", displayName: "Tesla" },
  tsla: { ticker: "TSLA", displayName: "Tesla" },
  netflix: { ticker: "NFLX", displayName: "Netflix" },
  nflx: { ticker: "NFLX", displayName: "Netflix" },
  "taiwan semiconductor": { ticker: "TSM", displayName: "TSMC" },
  tsmc: { ticker: "TSM", displayName: "TSMC" },
  tsm: { ticker: "TSM", displayName: "TSMC" },
  broadcom: { ticker: "AVGO", displayName: "Broadcom" },
  avgo: { ticker: "AVGO", displayName: "Broadcom" },
};

export function normalizeTicker(query: string): TickerInfo {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, "");

  // 국내 종목 먼저 검색
  if (KR_TICKERS[normalized]) return KR_TICKERS[normalized];

  // 공백 제거 전 원본도 시도
  const original = query.trim().toLowerCase();
  if (KR_TICKERS[original]) return KR_TICKERS[original];
  if (US_TICKERS[original]) return US_TICKERS[original];
  if (US_TICKERS[normalized]) return US_TICKERS[normalized];

  // 미인식 → 입력값 그대로 대문자 티커로 처리
  const upper = query.trim().toUpperCase();
  return { ticker: upper, displayName: upper };
}
