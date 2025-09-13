import React, { useState } from "react";
import RiskPill from "./RiskPill";
import type { Sentence } from "./types";

export default function SentenceRow({ sentence }: { sentence: Sentence }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen((v) => !v);

  const textStyle =
    sentence.risk === "danger"
      ? "text-red font-semibold"
      : sentence.risk === "warning"
      ? "text-yellow font-semibold"
      : "text-black";

  const borderStyle =
    sentence.risk === "danger"
      ? "border-red"
      : sentence.risk === "warning"
      ? "border-yellow"
      : "border-light-gray/60";

  // 화면: open 이면 보이기 / 닫히면 숨기기
  // 프린트: 무조건 보이기 (print:block)
  const detailVisibility = `${open ? "block" : "hidden"} print:block`;

  return (
    <div
      className="cursor-pointer print:cursor-auto"
      onClick={handleClick}
    >
      {/* 문장 본문 */}
      <p className={`text-sm leading-6 ${textStyle} transition-transform duration-200 hover:scale-101 origin-center`}>
  {sentence.text}
</p>
      {/* 상세 사유/수정안 — 프린트엔 무조건 표시 */}
      <div
        className={`${detailVisibility} mt-2 rounded-[10px] ${borderStyle} bg-white/50 p-4 text-sm space-y-2 border`}
      >
        <RiskPill risk={sentence.risk} />

        {sentence.why && (
          <p>
            <span className="font-semibold">why ? </span>
            <span>{sentence.why}</span>
          </p>
        )}

        {sentence.fix && (
          <p>
            <span className="font-medium">이렇게 바꿔보세요 : </span>
            <span className="font-semibold">"{sentence.fix}"</span>
          </p>
        )}
      </div>
    </div>
  );
}