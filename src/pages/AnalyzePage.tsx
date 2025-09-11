import React, { useMemo, useRef, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import ClauseCard from '../components/ClauseCard';
import SafetyScoreBar from '../components/SafetyScoreBar';
import type { Article } from '../components/types';

// 로컬 타입(정적 카운트 용) — types.ts 수정 없이 사용
type Counts = { danger: number; warning: number; safe: number; total: number };

// 가독성용 헬퍼: 문장 위험도 집계
const computeCounts = (articles: Article[]): Counts => {
  let danger = 0,
    warning = 0,
    safe = 0,
    total = 0;
  for (const a of articles) {
    for (const s of a.sentences) {
      total += 1;
      if (s.risk === 'danger') danger += 1;
      else if (s.risk === 'warning') warning += 1;
      else safe += 1;
    }
  }
  return { danger, warning, safe, total };
};

export default function AnalyzePage() {
  // ===== Mock Data (API 연동 시 교체) =====
  const [articles] = useState<Article[]>([
    {
      id: 1,
      title: '제1조 (근로계약 기간)',
      sentences: [
        {
          id: 's1-1',
          text: '근로계약 기간은 2025년 1월 1일부터 2025년 12월 31일까지로 한다.',
          risk: 'safe',
        },
        {
          id: 's1-2',
          text: '계약 기간 만료 후 상호 협의에 따라 갱신할 수 있다.',
          risk: 'safe',
        },
      ],
    },
    {
      id: 2,
      title: '제2조 (근무 장소 및 업무)',
      sentences: [
        {
          id: 's2-1',
          text: '근무 장소는 회사가 정한 사업장으로 한다.',
          risk: 'safe',
        },
        {
          id: 's2-2',
          text: '근로자의 주요 업무는 고객 응대 및 매장 관리로 한다.',
          risk: 'safe',
        },
      ],
    },
    {
      id: 3,
      title: '제3조 (근로시간 및 휴게)',
      sentences: [
        {
          id: 's3-1',
          text: '근로시간은 1일 8시간, 주 40시간을 원칙으로 한다.',
          risk: 'safe',
        },
        {
          id: 's3-2',
          text: '근로자는 근로시간 중 1시간의 휴게시간을 가진다.',
          risk: 'safe',
        },
        {
          id: 's3-3',
          text: '휴게시간 중에도 상급자 지시에 즉시 응해야 하며, 이 시간은 근로시간으로 보지 않는다.',
          risk: 'danger',
          why: '대기·콜 대기 등 사용자의 지휘감독 하에 있으면 실질적 휴게가 아니며 근로시간으로 볼 여지 큼.',
          fix: '휴게시간 동안 지휘감독을 배제하여 자유로운 이용을 보장하고, 불가피한 대기·지시가 있는 경우 해당 시간은 근로시간으로 본다.',
        },
      ],
    },
    {
      id: 7,
      title: '제7조',
      sentences: [
        {
          id: 's1',
          text: '근로자는 근무 중 발생하는 모든 손해(고객 불만, 기기 고장 등)를 전적으로 부담한다.',
          risk: 'danger',
          why: '사용자 책임/사업상 위험까지 근로자에게 포괄 전가하여 근로기준법·민법상 무효 가능.',
          fix: '업무상 고의·중과실에 한하여 손해배상 책임을 부담하며, 통상 손해범위 내에서 사용자와 협의한다.',
        },
        {
          id: 's2',
          text: '회사의 필요에 따라 근로자는 추가 근무를 거부할 수 없으며, 연장근로수당은 지급하지 않는다.',
          risk: 'danger',
          why: '연장근로는 근로자 동의와 법정수당 지급이 필수.',
          fix: '연장·야간·휴일근로는 사전 동의 하에 실시하며, 근로기준법에 따른 가산수당을 지급한다.',
        },
        {
          id: 's3',
          text: '근로자는 퇴직 후 5년간 동종 업종에 취업할 수 없다.',
          risk: 'warning',
          why: '광범위·장기간의 경업금지는 직업선택의 자유 과도 제한 가능. 정당한 이익·범위·기간 필요.',
          fix: '비밀정보 보호 범위 내에서 1년 이내, 동종 영업 중 경쟁우려가 현저한 직무로 한정.',
        },
        {
          id: 's4',
          text: '사용자는 필요에 따라 근로자를 즉시 해고할 수 있으며, 별도의 해고 예고나 사유 설명 의무가 없다.',
          risk: 'danger',
          why: '정당한 이유, 해고예고(30일) 또는 예고수당, 서면통지 의무 위반 소지.',
          fix: '징계사유 및 절차를 취업규칙에 따르며, 해고는 서면통지·예고(또는 예고수당 지급) 원칙을 따른다.',
        },
      ],
    },
  ]);

  // ===== 통계 (안전지수) =====
  const counts = useMemo(() => computeCounts(articles), [articles]);

  const safetyPercent = useMemo(() => {
    if (!counts.total) return 100;
    // 전체 문장 대비 안전지수(안전 비중)
    return Math.round((counts.safe / counts.total) * 1000) / 10; // 0.1% 단위
  }, [counts]);

  // PDF(인쇄) 영역 ref
  const printRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-black mb-6">
          아르바이트 근로 계약서
        </h1>

        {/* 계약서 요약 */}

        <SectionHeader
          title="계약서 요약"
          subtitle="조항을 클릭하면 상세 위험 문장과 수정 권고를 확인할 수 있어요."
          counts={{
            danger: counts.danger,
            warning: counts.warning,
            safe: counts.safe,
          }}
        />
        <div ref={printRef} className="space-y-4 print-scale-80">
          {articles.map(a => (
            <ClauseCard key={a.id} article={a} />
          ))}

          {/* 안전지수 영역 + PDF 다운로드 + 챗봇 연결 */}
          <h2 className="mt-10 text-[22px]  font-semibold text-black mb-2">
            내 계약서는 얼마나 안전할까?
          </h2>
          <div className="rounded-[10px] border border-light-gray/60 bg-white/70 p-6 shadow-sm">
            <p className="text-gray mb-4 text-center ">
              전체 문장 대비 안전 지수는{' '}
              <span className="font-extrabold text-secondary text-[30px] px-3">
                {safetyPercent}%
              </span>{' '}
              입니다.
            </p>
            <SafetyScoreBar
              danger={counts.danger}
              warning={counts.warning}
              safe={counts.safe}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
