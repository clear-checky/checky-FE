import React from "react";

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
      className="rounded-[10px] bg-secondary px-4 py-2 text-white shadow hover:opacity-90"
    >
      {label}
    </button>
  );
}