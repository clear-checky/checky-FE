import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-primary min-h-dvh">
      <div className="flex flex-col justify-center items-center mt-40"> 
            <img src="src/assets/Checky.svg" 
                className="w-200 h-auto" />
            <h1 className="font-bold text-xl text-secondary mt-20">지금 바로 사용해보세요!</h1>
            <div className="flex items-center mt-4">
            <button
              onClick={() => navigate('/upload')}
              className="bg-secondary text-white px-6 py-2 rounded-[10px] font-bold cursor-pointer mt-4 mb-[120px]"
            >
              분석하러 가기
            </button>
          </div>
            <img src="src/assets/user.svg" 
                className="w-300 h-auto" />

         <h1 className="font-medium text-xl text-[#707070] mt-50 whitespace-pre-line text-center">
          {`어렵고 복잡한 법률 용어,\n왠지 모르게 불안한 계약서,`}</h1>
         <h1 className="font-black text-3xl text-[#121212] mb-[150px] whitespace-pre-line text-center mt-20">
          AI 개인 법률 리스크 관리 서비스 Checky로 해결.</h1>
        <div className="mt-[50px] w-full flex items-center">
          <div className="basis-1/2 flex flex-col items-start space-y-2 pl-[180px]">
            <span className="inline-flex items-center rounded-full bg-[#D8D8D8]/[0.72] text-secondary
                            px-3 py-1 text-xl font-bold mb-6">
              Checky 기능
            </span>
            <div className="font-bold text-4xl text-[#121212] mb-3">
          계약서 분석하기</div>
          <h1 className="text-xl text-[#4A5344] leading-relaxed break-keep whitespace-pre-line">
          {'사용자가 업로드한 계약서를\n법률 조항을 바탕으로 심층 분석해줍니다.'}</h1>
          </div>
          <div className="basis-1/2 flex justify-end">
            <img
              src="src/assets/report.svg"
              className="w-[280px] sm:w-[480px] md:w-[600px] h-auto mt-20"
              alt="report"
            />
          </div>
        </div>

        <div className="mt-[100px] w-full flex items-center flex-row-reverse">
          <div className="basis-1/2 flex flex-col items-start space-y-2 pl-[180px]">
            <span className="inline-flex items-center rounded-full bg-[#D8D8D8]/[0.72] text-secondary
                            px-3 py-1 text-xl font-bold mb-6">
              Checky 기능
            </span>
            <div className="font-bold text-4xl text-[#121212] mb-3">
          내 계약서 한 눈에 보기</div>
          <h1 className="text-xl text-[#4A5344] leading-relaxed break-keep whitespace-pre-line">
          {'사용자가 업로드한 계약서를 \n시각적인 차트로 보여주며 심층 분석 제공.'}</h1>
          </div>
          <div className="basis-1/2 flex justify-start">
            <img
              src="src/assets/safe.svg"
              className="w-[280px] sm:w-[540px] md:w-[680px] h-auto mt-20"
              alt="report"
            />
          </div>
        </div>

         <div className="mt-[50px] w-full flex items-center">
          <div className="basis-1/2 flex flex-col items-start space-y-2 pl-[180px]">
            <span className="inline-flex items-center rounded-full bg-[#D8D8D8]/[0.72] text-secondary
                            px-3 py-1 text-xl font-bold mb-6">
              Checky 기능
            </span>
            <div className="font-bold text-4xl text-[#121212] mb-3">
          계약서를 체키에게 물어보기</div>
          <h1 className="text-xl text-[#4A5344] leading-relaxed break-keep whitespace-pre-line">
          {'분석 리포트를 바탕으로\n체키에게 궁금한 점을 질문하세요.'}</h1>
          </div>
          <div className="basis-1/2 flex justify-end">
            <img
              src="src/assets/question.svg"
              className="w-[280px] sm:w-[480px] md:w-[600px] h-auto mt-20"
              alt="report"
            />
          </div>
        </div>

        <div className="mt-[80px] w-full flex items-center flex-row-reverse">
          <div className="basis-1/2 flex flex-col justify-center items-center space-y-2 pr-32 text-center">
            <div className="font-bold text-4xl text-[#FFFFFF] mt-[150px] mb-3 whitespace-pre-line">
          {'안심되는 계약서 작성,\n체키와 지금 시작해보세요'}</div>
          <h1 className="text-md text-[#FFFFFF] leading-relaxed break-keep whitespace-pre-line">
          {'개인정보 보호를 위해 모든 정보는 24시간 내 영구 삭제됩니다.'}</h1>
                      <button
              onClick={() => navigate('/upload')}
              className="bg-[#000000] text-white px-6 py-2 rounded-[10px] font-bold cursor-pointer mt-[30px] mb-[180px]"
            >
              분석하러 가기
            </button>
          </div>
          <div className="basis-1/2 flex justify-start pl-35">
            <img
              src="src/assets/MacBook.svg"
              className="w-[360px] sm:w-[640px] md:w-[840px] lg:w-[1040px] h-auto mt-20"
              alt="report"
            />
          </div>
        </div>

         
      </div>

    </div>
  );
}
