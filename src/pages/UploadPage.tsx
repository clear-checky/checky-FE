import React, { useRef, useState } from 'react';

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 파일 선택 핸들러
  const handleFileSelect = (file: File) => {
    // 파일 크기 체크 (20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('파일 크기는 20MB를 초과할 수 없습니다.');
      return;
    }

    setUploadedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 분석하기 버튼 클릭 핸들러
  const handleAnalyze = () => {
    if (!uploadedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    if (!isAgreed) {
      alert('개인정보 처리방침에 동의해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setLoadingProgress(0);

    // 로딩 진행률 애니메이션
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // TODO: 실제 분석 API 호출 및 분석 페이지로 이동
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    console.log('분석 시작:', uploadedFile.name);
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* 페이지 제목 */}
        <h1 className="text-3xl font-extrabold text-black mb-6">업로드 화면</h1>

        {/* 업로드 카드 */}
        <div className="bg-white rounded-[10px] border border-light-gray/60 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">
            계약서 분석하기
          </h2>

          {/* 파일 업로드 규칙 */}
          <div className="mb-6 space-y-2">
            <p className="text-sm text-gray">
              • 압축 형식(zip) 파일을 제외한 모든 유형의 파일을 등록할 수
              있습니다.
            </p>
            <p className="text-sm text-gray">
              • 파일은 한번에 하나만 업로드 할 수 있으며, 파일 1개 당 크기는
              20MB를 초과할 수 없습니다.
            </p>
          </div>

          {/* 파일 드래그 앤 드롭 영역 */}
          <div className="border-2 border-dashed border-primary/60 rounded-[10px] p-12 text-center hover:border-secondary/60 transition-colors bg-primary/20">
            <div className="text-gray mb-4">
              첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을
              직접 선택해 주세요.
            </div>

            {/* 파일 선택 버튼 */}
            <button
              type="button"
              onClick={handleFileButtonClick}
              className="bg-secondary text-white px-6 py-3 rounded-[10px] font-semibold hover:opacity-90 transition-opacity"
            >
              파일선택
            </button>

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.hwp,.txt"
            />
          </div>

          {/* 업로드된 파일 표시 */}
          {uploadedFile && (
            <div className="mt-4 p-4 bg-white rounded-[10px] border border-light-gray/60 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary/20 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-black">
                    {uploadedFile.name}
                  </div>
                  <div className="text-sm text-gray">
                    {Math.round(uploadedFile.size / 1024)}KB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="text-gray hover:text-red transition-colors"
              >
                삭제
              </button>
            </div>
          )}

          {/* 개인정보 동의 체크박스 */}
          <div className="mt-6">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={e => setIsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary accent-secondary"
              />
              <span className="text-sm text-gray">
                개인정보 처리방침에 동의합니다.
                <a href="#" className="text-secondary underline ml-1">
                  자세히 보기
                </a>
              </span>
            </label>
          </div>

          {/* 분석하기 버튼 */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!uploadedFile || !isAgreed}
              className={`px-8 py-3 rounded-[10px] font-bold transition-opacity ${
                uploadedFile && isAgreed
                  ? 'bg-secondary text-white hover:opacity-90'
                  : 'bg-gray/30 text-gray cursor-not-allowed'
              }`}
            >
              분석하기
            </button>
          </div>
        </div>
      </div>

      {/* 로딩 모달 */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-12 max-w-md w-full mx-4 text-center relative">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsAnalyzing(false)}
              className="absolute top-4 right-4 text-gray hover:text-red transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-xl font-semibold text-secondary mb-6">
              숨은 위험까지 찾아내는 든든한 계약 비서,
            </div>
            <div className="text-5xl font-extrabold text-secondary mb-8">
              Checky
            </div>
            <div className="text-gray mb-8">
              체키가 당신의 계약서를 분석 중입니다.
            </div>
            <div className="w-full bg-gray/20 rounded-full h-4 mb-2">
              <div
                className="bg-secondary h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-gray">
              {loadingProgress < 100
                ? `분석 중... ${loadingProgress}%`
                : '분석 완료!'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
