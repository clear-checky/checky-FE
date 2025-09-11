import React, { useMemo, useRef, useState, useEffect } from "react";
import SectionHeader from "../components/SectionHeader";
import ClauseCard from "../components/ClauseCard";
import SafetyScoreBar from "../components/SafetyScoreBar";
import type { Article } from "../components/types";
import { analyzeContract } from "../api/api"; // API 호출

type Counts = { danger: number; warning: number; safe: number; total: number };

// 문장 위험도 집계
const computeCounts = (articles: Article[]): Counts => {
  let danger = 0,
    warning = 0,
    safe = 0,
    total = 0;
  for (const a of articles) {
    for (const s of a.sentences) {
      total += 1;
      if (s.risk === "danger") danger += 1;
      else if (s.risk === "warning") warning += 1;
      else safe += 1;
    }
  }
  return { danger, warning, safe, total };
};

// ✅ Mock fallback 데이터
const MOCK: Article[] = [
  {
    id: 1,
    title: "제1조 (근로계약 기간)",
    sentences: [
      { id: "s1", text: "근로계약 기간은 2025년 1월 1일부터 2025년 12월 31일까지로 한다.", risk: "safe" },
      { id: "s2", text: "계약 기간 만료 후 상호 협의에 따라 갱신할 수 있다.", risk: "safe" },
    ],
  },
  {
    id: 3,
    title: "제3조 (근로시간 및 휴게)",
    sentences: [
      { id: "s3-1", text: "근로시간은 1일 8시간, 주 40시간을 원칙으로 한다.", risk: "safe" },
      {
        id: "s3-2",
        text: "휴게시간 중에도 상급자 지시에 즉시 응해야 하며, 이 시간은 근로시간으로 보지 않는다.",
        risk: "danger",
        why: "대기·콜 대기 등 사용자의 지휘감독 하에 있으면 실질적 휴게가 아니며 근로시간으로 볼 여지 큼.",
        fix: "휴게시간 동안 지휘감독을 배제하여 자유로운 이용을 보장하고, 불가피한 대기·지시가 있는 경우 해당 시간은 근로시간으로 본다.",
      },
    ],
  },
];

export default function AnalyzePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // API → 실패하면 Mock 사용
  useEffect(() => {
    analyzeContract(MOCK)
      .then((res) => {
        setArticles(res.articles);
      })
      .catch((err) => {
        console.error("API 실패 → Mock data 사용", err);
        setArticles(MOCK);
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => computeCounts(articles), [articles]);
  const safetyPercent = useMemo(() => {
    if (!counts.total) return 100;
    return Math.round((counts.safe / counts.total) * 1000) / 10;
  }, [counts]);

  const printRef = useRef<HTMLDivElement | null>(null);

  if (loading) {
    return <div className="p-10 text-center text-gray">분석 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-black mb-6">아르바이트 근로 계약서</h1>

        <SectionHeader
          title="계약서 요약"
          subtitle="조항을 클릭하면 상세 위험 문장과 수정 권고를 확인할 수 있어요."
          counts={{ danger: counts.danger, warning: counts.warning, safe: counts.safe }}
        />

        <div ref={printRef} className="space-y-4 print-scale-80">
          {articles.map((a) => (
            <ClauseCard key={a.id} article={a} />
          ))}

          <h2 className="mt-10 text-[22px] font-semibold text-black mb-2">내 계약서는 얼마나 안전할까?</h2>
          <div className="rounded-[10px] border border-light-gray/60 bg-white/70 p-6 shadow-sm">
            <p className="text-gray mb-4 text-center">
              전체 문장 대비 안전 지수는{" "}
              <span className="font-extrabold text-green text-[36px] px-3">{safetyPercent}%</span> 입니다.
            </p>
            <SafetyScoreBar danger={counts.danger} warning={counts.warning} safe={counts.safe} />
          </div>
        </div>
      </div>
    </div>
  );
}