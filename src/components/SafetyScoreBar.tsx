import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";
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
  const navigate = useNavigate();
  const total = Math.max(danger + warning + safe, 1);
  const w = (n: number) => (n / total) * 100;

  const handleAskClick = () => {
    if (onAskClick) {
      onAskClick();
    } else {
      navigate('/chat');
    }
  };

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

      <div className="mt-5 flex items-center justify-center">
        <button
          type="button"
          onClick={handleAskClick}
          className="group relative inline-flex items-center gap-2 text-black font-semibold text-lg px-6 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <span className="relative z-10">계약서 안의 궁금한 내용, 체키에 물어보기</span>
          <ArrowRightCircle className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          {/* 호버 시 왼쪽에서 오른쪽으로 움직이는 초록색 배경 */}
          <div className="absolute inset-0 bg-green/80 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
        </button>
      </div>
    </div>
  );
}