import React, { useMemo, useState } from "react";
import type { Article } from "./types";
import SentenceRow from "./SentenceRow";

export default function ClauseCard({ article }: { article: Article }) {
  const [open, setOpen] = useState<boolean>(article.sentences.length > 0);

  const hasWarningOrDanger = useMemo(
    () => article.sentences.some(s => s.risk === "warning" || s.risk === "danger"),
    [article.sentences]
  );

  const wrapClasses = hasWarningOrDanger
    ? "bg-yellow/20 border-yellow/60"
    : "bg-white/70 border-light-gray/60";

  // 화면에서만 토글, 프린트에서는 항상 보이기
  const bodyVisibility = `${open ? "block" : "hidden"} print:block`;

  return (
    <div className={`rounded-[10px] border ${wrapClasses} shadow-sm`}>
      {/* 🔹 제목은 항상 표시 */}
      <div className="w-full px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary">{article.title}</h3>
          {/* 🔹 토글 버튼은 프린트에서만 숨김 */}
          <button
            type="button"
            className="text-gray text-sm print:hidden"
            onClick={() => setOpen(v => !v)}
          >
            {open ? "접기" : "자세히"}
          </button>
        </div>
      </div>

      {/* 🔹 본문: 화면에서는 open 상태에 따르고, 프린트에서는 항상 보임 */}
      <div className={`${bodyVisibility} px-5 pb-5 space-y-3`}>
        {article.sentences.length === 0 ? (
          <p className="text-sm text-gray">표시할 문장이 없습니다.</p>
        ) : (
          article.sentences.map(s => <SentenceRow key={s.id} sentence={s} />)
        )}
      </div>
    </div>
  );
}