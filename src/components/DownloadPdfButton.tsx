import React from "react";
import { Download } from "lucide-react";

export default function DownloadPdfButton({
  targetRef,        // 현재는 window.print()라서 직접 쓰진 않지만, 나중에 react-to-print로 교체 시 사용
  label = "분석 리포트 다운로드",
}: {
  targetRef?: React.RefObject<HTMLElement>;
  label?: string;
}) {
  const onPrint = () => {
    window.print();
  };

  return (
    <button
      onClick={onPrint}
      className="group relative inline-flex items-center gap-2 rounded-[10px] bg-secondary px-4 py-2 text-white shadow overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <span className="relative z-10">{label}</span>
      <Download className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
      {/* 호버 시 왼쪽에서 오른쪽으로 움직이는 초록색 배경 */}
      <div className="absolute inset-0 bg-black/80 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
    </button>
  );
}