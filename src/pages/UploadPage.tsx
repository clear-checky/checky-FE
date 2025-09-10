import React, { useRef, useState } from 'react';

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
        </div>
      </div>
    </div>
  );
}
