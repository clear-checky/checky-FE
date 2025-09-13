import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Article } from './types';
import SentenceRow from './SentenceRow';

export default function ClauseCard({ article }: { article: Article }) {
  // sentences가 undefined이거나 배열이 아닐 때 안전하게 처리
  const sentences = article.sentences || [];
  const [open, setOpen] = useState<boolean>(sentences.length > 0);

  const hasWarningOrDanger = useMemo(
    () => sentences.some(s => s.risk === 'warning' || s.risk === 'danger'),
    [sentences]
  );

  const wrapClasses = hasWarningOrDanger
    ? 'bg-yellow/20 border-yellow/60'
    : 'bg-white/70 border-light-gray/60';

  // 화면에서만 토글, 프린트에서는 항상 보이기
  const bodyVisibility = `${open ? 'block' : 'hidden'} print:block`;

  return (
    <div className={`rounded-[10px] border ${wrapClasses} shadow-sm transition-all duration-200 hover:shadow-md`}>
      {/* 🔹 제목은 항상 표시 */}
      <div className="w-full px-5 py-4">
        <div
          onClick={() => setOpen(v => !v)}
          className="flex items-center justify-between cursor-pointer group"
        >
          <h3 className={`text-lg font-bold text-black transition-colors duration-200 ${hasWarningOrDanger ? 'group-hover:text-red' : 'group-hover:text-green'}`}>{article.title}</h3>
          {/* 🔹 토글 버튼은 프린트에서만 숨김 */}
          <button
            type="button"
            className={`text-gray text-sm print:hidden transition-colors duration-200 flex items-center gap-1 ${hasWarningOrDanger ? 'group-hover:text-red' : 'group-hover:text-green'}`}
          >
            {open ? '접기' : '자세히'}
            <ChevronDown
              size={14}
              className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* 🔹 본문: 화면에서는 open 상태에 따르고, 프린트에서는 항상 보임 */}
      <div className={`${bodyVisibility} px-5 pb-5 space-y-3 transition-all duration-300 ease-in-out`}>
        {sentences.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray/70 italic">표시할 문장이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sentences.map(s => <SentenceRow key={s.id} sentence={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
