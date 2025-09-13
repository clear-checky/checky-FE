// src/api/api.ts
// 프론트 ↔ FastAPI 헬퍼
// .env.local 예) VITE_API_BASE_URL=http://127.0.0.1:8000

export type RiskLevel = 'danger' | 'warning' | 'safe';

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
  title?: string;
  file_name?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_history: ChatMessage[];
}

export interface ChatRequestAlt {
  question: string;
  conversation_history: ChatMessage[];
}

export interface ChatResponse {
  answer?: string;
  message?: string;
  conversation_history?: ChatMessage[];
}

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:8000';

/** 공통 fetch (타임아웃/에러 메시지 통일) */
async function request<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs = 20000, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isForm = init.body instanceof FormData;
    const res = await fetch(`${BASE_URL}${path}`, {
      // FormData면 Content-Type 자동 설정되도록 header 생략
      headers: isForm
        ? { ...(init.headers || {}) }
        : { 'Content-Type': 'application/json', ...(init.headers || {}) },
      signal: controller.signal,
      ...init,
    });

    if (!res.ok) {
      let detail = '';
      try {
        const body = await res.json();
        console.error('API Error Response:', body);
        detail = body?.detail || JSON.stringify(body);
      } catch {
        detail = res.statusText;
      }
      throw new Error(`[${res.status}] ${detail}`);
    }

    // 모든 API가 JSON 반환한다고 가정 (필요 시 분기)
    return (await res.json()) as T;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('요청이 시간 초과되었습니다.');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

/** ───── 분석(동기) : 바로 문장 배열을 보내서 분석 ───── */
export function analyzeContract(articles: Article[]) {
  return request<AnalyzeResponse>('/contract/analyze', {
    method: 'POST',
    body: JSON.stringify({ articles }),
  });
}

/** ───── 챗봇 Q&A ───── */
export function askChecky(
  message: string,
  conversationHistory: ChatMessage[] = []
) {
  console.log('Sending chat request:', {
    message,
    conversation_history: conversationHistory,
  });

  // 먼저 'message' 필드로 시도
  return request<ChatResponse>('/chat/', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversation_history: conversationHistory,
    }),
  });
}

/** ───── 챗봇 Q&A (대안) ───── */
export function askCheckyAlt(
  message: string,
  conversationHistory: ChatMessage[] = []
) {
  console.log('Sending chat request (alt):', {
    question: message,
    conversation_history: conversationHistory,
  });

  // 'question' 필드로 시도
  return request<ChatResponse>('/chat/', {
    method: 'POST',
    body: JSON.stringify({
      question: message,
      conversation_history: conversationHistory,
    }),
  });
}

/** ───── 챗봇 Q&A (간단한 버전) ───── */
export function askCheckySimple(message: string) {
  console.log('Sending simple chat request:', { message });

  // 가장 간단한 형태로 시도
  return request<ChatResponse>('/chat/', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

/** ───── 챗봇 Q&A (다른 필드명 시도) ───── */
export function askCheckyWithHistory(
  message: string,
  conversationHistory: ChatMessage[] = []
) {
  console.log('Sending chat request with history:', {
    message,
    history: conversationHistory,
  });

  // 'history' 필드명으로 시도
  return request<ChatResponse>('/chat/', {
    method: 'POST',
    body: JSON.stringify({
      message,
      history: conversationHistory,
    }),
  });
}

/** ───── 헬스 체크 ───── */
export function health() {
  return request<{ ok: boolean }>('/health', { method: 'GET' });
}

/** ───── OCR 파이프라인: 업로드 → 상태 → 결과 ───── */
// 1) 파일 업로드 → { task_id }
export function uploadFile(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  return request<{ task_id: string }>('/upload', {
    method: 'POST',
    body: fd,
  });
}

// 2) 상태 조회 → { status: 'queued'|'processing'|'completed'|'failed' }
export function getAnalysisStatus(taskId: string) {
  return request<{ status: 'queued' | 'processing' | 'completed' | 'failed' }>(
    `/analysis/status/${encodeURIComponent(taskId)}`,
    { method: 'GET' }
  );
}

// 3) 결과 조회 → AnalyzeResponse 형태라면 그대로 UI에 사용 가능
export function getAnalysisResult(taskId: string) {
  return request<AnalyzeResponse>(
    `/upload/analysis/${encodeURIComponent(taskId)}`,
    { method: 'GET' }
  );
}
