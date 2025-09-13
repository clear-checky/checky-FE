export default function FaqPage() {
  const faqs = [
    {
      q: 'Q. 계약서에 표기된 개인정보는 보호가 되나요?',
      a: '체키에 등록되는 모든 개인정보는 24시간 내로 영구 삭제됩니다.',
    },
    {
      q: 'Q. 체키가 분석한 결과는 법적으로 효력이 있나요?',
      a: '체키의 분석은 AI 기반으로 주의가 필요한 조항을 안내하는 참고 자료입니다. 최종적인 법적 판단이나 해석은 노무사·변호사 등 전문가 상담을 권장합니다.',
    },
    {
      q: 'Q. 어떤 계약서를 분석할 수 있나요?',
      a: '체키는 우선 근로계약서 분석에 최적화되어 있으며, 추후 임대차계약서·프리랜서 계약서 등으로 확장될 예정입니다.',
    },
    {
      q: 'Q. 계약서 파일 형식은 무엇을 지원하나요?',
      a: '등록 가능한 파일 형식은 pdf, doc, docx, hwp, txt, jpg, jpeg, png 입니다. 스캔본도 업로드 가능하며 OCR로 텍스트화합니다.',
    },
  ];

  return (
    <div className="w-full">
      {/* 중앙 컨테이너: 폭 제어 */}
      <div className="w-full max-w-7xl mx-auto mt-18">
        <h1 className="font-bold text-3xl text-secondary mb-14">자주 묻는 질문</h1>

        <ul className="mt-10 space-y-10">
          {faqs.map((item, idx) => (
            <li key={idx} className="w-full">
              {/* 질문 */}
              <h2 className="font-semibold text-lg text-xl text-[#000000]">
                {item.q}
              </h2>

              {/* 답변 박스 */}
              <div className="mt-2 w-full">
                <div className="bg-primary rounded-[10px] px-5 py-4 shadow-sm w-full">
                  <p className="text-[#000000] text-base leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
