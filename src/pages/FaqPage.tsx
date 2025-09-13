export default function FaqPage() {
  return (
    <div>
      <div className="flex flex-col justify-center items-start ml-[120px] mt-12"> 
        <h1 className="font-bold text-2xl text-secondary mt-12">자주 묻는 질문</h1>

        <div className="mt-20 ml-12">
          <h2 className="font-semibold text-xl text-secondary">
            계약서에 표기된 개인정보는 보호가 되나요?
          </h2>
          <div className="mt-3 flex items-start gap-4">
            <div className="w-[7px] h-[40px] bg-[#2F3E2C]"></div>
            <p className="text-[#111827] font-normal text-lg mt-2">
              체키에 등록되는 모든 개인정보는 24시간 내로 영구 삭제됩니다.</p>
          </div>
        </div>

        <div className="mt-16 ml-12">
          <h2 className="font-semibold text-xl text-secondary">
            체키가 분석한 결과는 법적으로 효력이 있나요?
          </h2>
          <div className="mt-3 flex items-start gap-4">
            <div className="w-[7px] h-[40px] bg-[#2F3E2C]"></div>
            <p className="text-[#111827] font-normal text-lg mt-2">
              체키의 분석은 AI 기반으로 주의가 필요한 조항을 안내하는 참고 자료입니다. 최종적인 법적 판단이나 해석은 노무사·변호사 등 전문가 상담을 권장합니다.</p>
          </div>
        </div>

        <div className="mt-16 ml-12">
          <h2 className="font-semibold text-xl text-secondary">
            어떤 계약서를 분석할 수 있나요?
          </h2>
          <div className="mt-3 flex items-start gap-4">
            <div className="w-[7px] h-[40px] bg-[#2F3E2C]"></div>
            <p className="text-[#111827] font-normal text-lg mt-2">
              체키는 우선 근로계약서 분석에 최적화되어 있으며, 추후 임대차계약서·프리랜서 계약서 등으로 확장될 예정입니다.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
