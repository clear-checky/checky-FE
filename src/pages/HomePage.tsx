import { useState, useEffect, useRef } from 'react';
import HeaderButton from '../components/common/HeaderButton';
import Footer from '../components/common/Footer';

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasReachedLastSection, setHasReachedLastSection] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const lastSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const secondFeatureRef = useRef<HTMLDivElement>(null);
  const thirdFeatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 기능 섹션들을 위한 observer (민감하게)
    const featuresObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const targetId = entry.target.getAttribute('data-section-id');

          if (entry.isIntersecting) {
            // 섹션이 보이면 가시성 상태에 추가
            if (targetId) {
              setVisibleSections(prev => new Set(prev).add(targetId));
            }

            // 마지막 섹션에 도달하지 않았을 때만 다크모드 해제 (초록 배경)
            if (!hasReachedLastSection) {
              setIsDarkMode(false);
            }
          } else {
            // 섹션이 보이지 않으면 가시성 상태에서 제거
            if (targetId) {
              setVisibleSections(prev => {
                const newSet = new Set(prev);
                newSet.delete(targetId);
                return newSet;
              });
            }
          }
        });
      },
      {
        threshold: 0.1, // 10% 보이면 트리거
        rootMargin: '0px 0px 0px 0px' // 마진 없이 정확히 감지
      }
    );

    // 마지막 섹션을 위한 observer (바로 보이면 즉시 트리거)
    const lastSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 마지막 섹션이 보이면 즉시 다크모드 활성화
            setIsDarkMode(true);
          } else {
            // 마지막 섹션에서 벗어나면 hasReachedLastSection을 false로 리셋
            setHasReachedLastSection(false);
          }
        });
      },
      {
        threshold: 0, // 0% 즉시 트리거 (1px이라도 보이면)
        rootMargin: '0px 0px 0px 0px' // 마진 없이 정확히 감지
      }
    );

    // 기능 섹션들을 관찰
    const featureRefs = [
      { ref: featuresRef, id: 'features' },
      { ref: secondFeatureRef, id: 'second' },
      { ref: thirdFeatureRef, id: 'third' }
    ];

    featureRefs.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.setAttribute('data-section-id', id);
        featuresObserver.observe(ref.current);
      }
    });

    // 마지막 섹션을 관찰
    if (lastSectionRef.current) {
      lastSectionObserver.observe(lastSectionRef.current);
    }

    return () => {
      featureRefs.forEach(({ ref }) => {
        if (ref.current) {
          featuresObserver.unobserve(ref.current);
        }
      });
      if (lastSectionRef.current) {
        lastSectionObserver.unobserve(lastSectionRef.current);
      }
    };
  }, [hasReachedLastSection]);

  return (
    <div className="min-h-dvh relative overflow-hidden">
      {/* 기본 배경 */}
      <div className="absolute inset-0 bg-gradient-primary"></div>

      {/* 위로 올라가는 검은 배경 */}
      <div className={`absolute inset-0 bg-black transition-transform ${isDarkMode ? 'duration-[4000ms] ease-out' : 'duration-[1000ms] ease-in'} ${isDarkMode ? 'translate-y-0' : 'translate-y-full'
        }`}></div>
      <div className="relative z-10 flex flex-col justify-center items-center mt-40">
        <div className="text-center animate-diagonal-gradient">
          <p className="text-[44px] font-extrabold text-black mb-2">숨은 위험까지 찾아내는 든든한 계약 비서,</p>
          <h1 className="text-[120px] font-black text-black animate-diagonal-gradient" style={{
            fontWeight: 1000,
            letterSpacing: '2px',
            WebkitTextStroke: '4px transparent'
          }}>Checky</h1>
        </div>
        <h2 className="font-bold text-xl text-secondary mt-20">지금 바로 사용해보세요!</h2>
        <div className="flex items-center mt-4">
          <HeaderButton
            to="/upload"
            variant="primary"
            className="mt-4 mb-[120px] animate-bounce-float"
          >
            분석하러 가기
          </HeaderButton>
        </div>
        <img src="src/assets/user.svg"
          className="w-300 h-auto" />

        <h1 className="font-medium text-xl text-[#707070] mt-50 whitespace-pre-line text-center animate-bounce-slow">
          {`어렵고 복잡한 법률 용어,\n왠지 모르게 불안한 계약서,`}</h1>
        <h1 className="font-black text-3xl text-[#121212] mb-[150px] whitespace-pre-line text-center mt-6 animate-bounce-slow-delayed">
          AI 개인 법률 리스크 관리 서비스 Checky로 해결.</h1>
        <div ref={featuresRef} className={`mt-[50px] w-full flex items-center transition-all duration-700 ease-out ${visibleSections.has('features')
          ? 'transform translate-y-0 opacity-100'
          : 'transform translate-y-12 opacity-0'
          }`}>
          <div className="basis-1/2 flex flex-col items-start space-y-2 pl-[180px]">
            <span className={`inline-flex items-center rounded-full bg-[#D8D8D8]/[0.72] text-secondary
                            px-3 py-1 text-xl font-bold mb-6 transition-all duration-600 ease-out delay-100 ${visibleSections.has('features')
                ? 'transform translate-x-0 opacity-100'
                : 'transform -translate-x-6 opacity-0'
              }`}>
              Checky 기능
            </span>
            <div className={`font-bold text-4xl text-[#121212] mb-3 transition-all duration-600 ease-out delay-200 ${visibleSections.has('features')
              ? 'transform translate-x-0 opacity-100'
              : 'transform -translate-x-8 opacity-0'
              }`}>
              계약서 분석하기</div>
            <h1 className={`text-xl text-[#4A5344] leading-relaxed break-keep whitespace-pre-line transition-all duration-600 ease-out delay-300 ${visibleSections.has('features')
              ? 'transform translate-x-0 opacity-100'
              : 'transform -translate-x-6 opacity-0'
              }`}>
              {'사용자가 업로드한 계약서를\n법률 조항을 바탕으로 심층 분석해줍니다.'}</h1>
          </div>
          <div className="basis-1/2 flex justify-end">
            <img
              src="src/assets/report.svg"
              className={`w-[280px] sm:w-[480px] md:w-[600px] h-auto mt-20 transition-all duration-800 ease-out delay-400 ${visibleSections.has('features')
                ? 'transform translate-y-0 scale-100 opacity-100'
                : 'transform translate-y-8 scale-95 opacity-0'
                }`}
              alt="report"
            />
          </div>
        </div>

        <div ref={secondFeatureRef} className={`mt-[100px] w-full flex items-center flex-row-reverse transition-all duration-700 ease-out ${visibleSections.has('second')
          ? 'transform translate-y-0 opacity-100'
          : 'transform translate-y-12 opacity-0'
          }`}>
          <div className="basis-1/2 flex flex-col items-start space-y-2 pl-[180px]">
            <span className={`inline-flex items-center rounded-full bg-[#D8D8D8]/[0.72] text-secondary
                            px-3 py-1 text-xl font-bold mb-6 transition-all duration-600 ease-out delay-100 ${visibleSections.has('second')
                ? 'transform translate-x-0 opacity-100'
                : 'transform translate-x-6 opacity-0'
              }`}>
              Checky 기능
            </span>
            <div className={`font-bold text-4xl text-[#121212] mb-3 transition-all duration-600 ease-out delay-200 ${visibleSections.has('second')
              ? 'transform translate-x-0 opacity-100'
              : 'transform translate-x-8 opacity-0'
              }`}>
              내 계약서 한 눈에 보기</div>
            <h1 className={`text-xl text-[#4A5344] leading-relaxed break-keep whitespace-pre-line transition-all duration-600 ease-out delay-300 ${visibleSections.has('second')
              ? 'transform translate-x-0 opacity-100'
              : 'transform translate-x-6 opacity-0'
              }`}>
              {'사용자가 업로드한 계약서를 \n시각적인 차트로 보여주며 심층 분석 제공.'}</h1>
          </div>
          <div className="basis-1/2 flex justify-start">
            <img
              src="src/assets/safe.svg"
              className={`w-[280px] sm:w-[540px] md:w-[680px] h-auto mt-20 transition-all duration-800 ease-out delay-400 ${visibleSections.has('second')
                ? 'transform translate-y-0 scale-100 opacity-100'
                : 'transform translate-y-8 scale-95 opacity-0'
                }`}
              alt="report"
            />
          </div>
        </div>

        <div ref={thirdFeatureRef} className={`mt-[50px] w-full flex items-center transition-all duration-700 ease-out ${visibleSections.has('third')
          ? 'transform translate-y-0 opacity-100'
          : 'transform translate-y-12 opacity-0'
          }`}>
          <div className="basis-1/2 flex flex-col items-start space-y-2 pl-[180px]">
            <span className={`inline-flex items-center rounded-full bg-[#D8D8D8]/[0.72] text-secondary
                            px-3 py-1 text-xl font-bold mb-6 transition-all duration-600 ease-out delay-100 ${visibleSections.has('third')
                ? 'transform translate-x-0 opacity-100'
                : 'transform -translate-x-6 opacity-0'
              }`}>
              Checky 기능
            </span>
            <div className={`font-bold text-4xl text-[#121212] mb-3 transition-all duration-600 ease-out delay-200 ${visibleSections.has('third')
              ? 'transform translate-x-0 opacity-100'
              : 'transform -translate-x-8 opacity-0'
              }`}>
              계약서를 체키에게 물어보기</div>
            <h1 className={`text-xl text-[#4A5344] leading-relaxed break-keep whitespace-pre-line transition-all duration-600 ease-out delay-300 ${visibleSections.has('third')
              ? 'transform translate-x-0 opacity-100'
              : 'transform -translate-x-6 opacity-0'
              }`}>
              {'분석 리포트를 바탕으로\n체키에게 궁금한 점을 질문하세요.'}</h1>
          </div>
          <div className="basis-1/2 flex justify-end">
            <img
              src="src/assets/question.svg"
              className={`w-[280px] sm:w-[480px] md:w-[600px] h-auto mt-20 transition-all duration-800 ease-out delay-400 ${visibleSections.has('third')
                ? 'transform translate-y-0 scale-100 opacity-100'
                : 'transform translate-y-8 scale-95 opacity-0'
                }`}
              alt="report"
            />
          </div>
        </div>

        <div ref={lastSectionRef} className="mt-[80px] w-full flex items-center flex-row-reverse relative z-20">
          <div className="basis-1/2 flex flex-col justify-center items-center space-y-2 pr-32 text-center">
            <div className={`font-bold text-4xl text-[#FFFFFF] mt-[150px] mb-3 whitespace-pre-line transition-all duration-1000 ease-out ${isDarkMode ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-90'
              }`}>
              {'안심되는 계약서 작성,\n체키와 지금 시작해보세요'}</div>
            <h1 className={`text-md text-[#FFFFFF] leading-relaxed break-keep whitespace-pre-line transition-all duration-1000 ease-out delay-200 ${isDarkMode ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-90'
              }`}>
              {'개인정보 보호를 위해 모든 정보는 24시간 내 영구 삭제됩니다.'}</h1>
            <button
              onClick={() => window.location.href = '/upload'}
              className={`mt-[30px] mb-[180px] transition-all duration-3000 ease-out delay-400 hover:scale-105 bg-white text-green px-6 py-2 rounded-[10px] font-bold hover:bg-gray-100 ${isDarkMode ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-90'
                }`}
            >
              분석하러 가기
            </button>
          </div>
          <div className="basis-1/2 flex justify-start pl-35">
            <img
              src="src/assets/MacBook.svg"
              className={`w-[400px] sm:w-[720px] md:w-[960px] lg:w-[1200px] h-auto mt-20 transition-all duration-1000 ease-out delay-300 animate-bounce-float ${isDarkMode ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-90'
                }`}
              alt="report"
            />
          </div>
        </div>

      </div>

      {/* 푸터 - 홈페이지 메인 컨테이너 밖에서 독립적으로 전체 가로 길이 사용 */}
      <Footer />

    </div>
  );
}
