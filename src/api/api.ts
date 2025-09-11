// src/api/api.ts
// 프론트 → FastAPI 호출 헬퍼
// Vite 환경변수: .env.local에 VITE_API_BASE_URL=http://127.0.0.1:8000

export type RiskLevel = "danger" | "warning" | "safe";

export interface Sentence {
  id: string;
  text: string;
  risk: RiskLevel;
  why?: string;
  fix?: string;
}

export interface Article {
  id: number | string;
  title: string;
  sentences: Sentence[];
}

export interface AnalyzeResponse {
  articles: Article[];
  counts: { danger: number; warning: number; safe: number; total: number };
  safety_percent: number;
}

export interface ChatResponse {
  answer: string;
}

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

/** 공통 fetch (타임아웃/에러 메시지 통일) */
async function request<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs = 20000, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
      signal: controller.signal,
      ...init,
    });

    if (!res.ok) {
      // 서버가 보낸 에러 메시지 추출 시도
      let detail = "";
      try {
        const body = await res.json();
        detail = body?.detail || JSON.stringify(body);
      } catch (_) {
        detail = res.statusText;
      }
      throw new Error(`[${res.status}] ${detail}`);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("요청이 시간 초과되었습니다.");
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

/** 계약서 분석 */
export function analyzeContract(articles: Article[]) {
  return request<AnalyzeResponse>("/contract/analyze", {
    method: "POST",
    body: JSON.stringify({ articles }),
  });
}

/** 계약서 기반 Q&A */
export function askChecky(question: string, articles: Article[]) {
  return request<ChatResponse>("/contract/chat", {
    method: "POST",
    body: JSON.stringify({ question, articles }),
  });
}

/** 헬스 체크 */
export function health() {
  return request<{ ok: boolean }>("/health", { method: "GET" });
}