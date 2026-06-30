import { createAPIFileRoute } from "@tanstack/react-start/api";

// 서버에서만 사용하는 토스 시크릿 키 (테스트용 공개값)
const SECRET_KEY = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5pMqnN";

export const APIRoute = createAPIFileRoute("/api/confirm-payment")({
  POST: async ({ request }) => {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return new Response(JSON.stringify({ error: "필수 파라미터 누락" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const credentials = btoa(`${SECRET_KEY}:`);

    const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("토스 결제 승인 실패:", data);
      return new Response(JSON.stringify({ error: data.message ?? "승인 실패" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 실제 서비스에서는 여기서 DB에 구독 정보 저장
    console.log("결제 승인 완료:", data.orderId, data.totalAmount);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
