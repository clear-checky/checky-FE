import React from "react";
import DownloadPdfButton from "./DownloadPdfButton";

export default function SafetyScoreBar({
  danger,
  warning,
  safe,
  downloadTargetRef,
  onAskClick,
}: {
  danger: number;
  warning: number;
  safe: number;
  downloadTargetRef?: React.RefObject<HTMLElement>; // ✅ 부모에서 내려주는 인쇄 타깃
  onAskClick?: () => void;                           // ✅ 체키에 물어보기 액션(선택)
}) {
  const total = Math.max(danger + warning + safe, 1);
  const w = (n: number) => (n / total) * 100;

  return (
    <div>
      {/* 누적 막대 */}
      <div className="flex h-20 w-full overflow-hidden rounded-[10px] border border-light-gray/70 bg-white">
        <div className="h-full bg-red/80" style={{ width: `${w(danger)}%` }} title={`위험 ${danger}`} />
        <div className="h-full bg-yellow/80" style={{ width: `${w(warning)}%` }} title={`주의 ${warning}`} />
        <div className="h-full bg-green/80" style={{ width: `${w(safe)}%` }} title={`안전 ${safe}`} />
      </div>

      {/* 하단 라벨 */}
      <div className="mt-2 flex justify-between text-[12px] text-gray">
        <span>위험 {danger}</span>
        <span>주의 {warning}</span>
        <span>안전 {safe}</span>
      </div>

      {/* 액션 영역 */}
      <div className="mt-6 flex justify-center">
        <DownloadPdfButton targetRef={downloadTargetRef} label="분석 리포트 다운로드" />
      </div>

      <div className="mt-3 flex items-center justify-center">
        <button
          type="button"
          onClick={onAskClick}
          className="inline-flex items-center gap-2 text-black font-semibold"
        >
          <span>내 계약서 안의 궁금한 내용, 체키에 물어보기</span>
          {/* 화살표 아이콘 */}
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.293 4.293a1 1 0 011.414 0L14 9.586a1 1 0 010 1.414l-5.293 5.293a1 1 0 01-1.414-1.414L10.586 11H4a1 1 0 110-2h6.586L7.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
}