import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API 호출 함수들
const API_BASE_URL = 'http://localhost:8000'; // FastAPI 서버 URL
const USE_MOCK_DATA = false; // 백엔드 연결 문제로 임시 Mock 데이터 사용

// Mock 데이터 함수들
const mockUploadFile = async (file: File) => {
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    message: '파일이 성공적으로 업로드되었습니다.',
    file_id: `file_${Date.now()}`,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type.split('/')[1],
    extracted_text: `<<${file.name}>>\n\n- 이 파일은 Mock 데이터로 생성된 추출 텍스트입니다.\n- 실제 OCR 추출 결과를 시뮬레이션합니다.\n- 계약서 분석을 위한 텍스트 내용이 여기에 표시됩니다.`,
  };
};

const mockCheckAnalysisStatus = async (fileId: string) => {
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));

  // 랜덤하게 상태 반환 (테스트용)
  const random = Math.random();
  if (random < 0.3) {
    return 'processing';
  } else if (random < 0.9) {
    return 'completed';
  } else {
    return 'failed';
  }
};

// 실제 API 호출 함수들
const uploadFile = async (file: File) => {
  if (USE_MOCK_DATA) {
    return mockUploadFile(file);
  }

  console.log('파일 업로드 시작:', file.name);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    console.log('업로드 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('업로드 실패:', response.status, errorText);
      throw new Error(`파일 업로드에 실패했습니다. (${response.status})`);
    }

    const result = await response.json();
    console.log('업로드 성공:', result);
    return result;
  } catch (error) {
    console.error('업로드 에러:', error);
    throw error;
  }
};

const checkAnalysisStatus = async (fileId: string) => {
  if (USE_MOCK_DATA) {
    return mockCheckAnalysisStatus(fileId);
  }

  console.log('상태 확인 시작:', fileId);

  try {
    const response = await fetch(`${API_BASE_URL}/upload/status/${fileId}`);
    console.log('상태 확인 응답:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('상태 확인 실패:', response.status, errorText);
      throw new Error(`분석 상태 확인에 실패했습니다. (${response.status})`);
    }

    const data = await response.json();
    console.log('상태 확인 성공:', data);
    return data.status; // 백엔드에서 JSON 객체의 status 필드 반환
  } catch (error) {
    console.error('상태 확인 에러:', error);
    throw error;
  }
};

const getAnalysisResult = async (fileId: string) => {
  if (USE_MOCK_DATA) {
    // Mock 데이터로 분석 결과 반환
    return {
      id: fileId,
      title: '계약서 분석 결과',
      articles: [
        {
          id: '1',
          title: '계약서 조항 1',
          sentences: [
            {
              id: '1-1',
              text: '이 계약서는 안전합니다.',
              risk: 'safe' as const,
              why: '표준 계약 조건을 따르고 있습니다.',
              fix: '추가 조치 불필요',
            },
          ],
        },
      ],
    };
  }

  // 백엔드에서 분석 결과 API 호출
  const response = await fetch(`${API_BASE_URL}/upload/analysis/${fileId}`);

  if (!response.ok) {
    throw new Error('분석 결과를 가져오는데 실패했습니다.');
  }

  return response.json();
};

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);

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

  // 드래그 앤 드롭 핸들러들
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // 분석하기 버튼 클릭 핸들러
  const handleAnalyze = async () => {
    if (!uploadedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    if (!isAgreed) {
      alert('개인정보 처리방침에 동의해주세요.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setLoadingProgress(0);
      setPollingCount(0); // 폴링 카운트 초기화

      // 1. 파일 업로드
      setLoadingProgress(20);
      const uploadResult = await uploadFile(uploadedFile);
      setFileId(uploadResult.file_id);

      // 2. 분석 상태 확인 (폴링)
      const checkStatus = async () => {
        try {
          setPollingCount(prev => prev + 1);
          console.log(`폴링 횟수: ${pollingCount + 1}`);

          // 최대 30번 폴링 (1분) 후 타임아웃
          if (pollingCount >= 30) {
            console.log('폴링 타임아웃 - 분석 완료로 처리');
            setLoadingProgress(100);
            const analysisResult = await getAnalysisResult(
              uploadResult.file_id
            );
            setTimeout(() => {
              navigate(`/analyze/${uploadResult.file_id}`, {
                state: {
                  analysisResult,
                  extractedText: uploadResult.extracted_text,
                  fileName: uploadResult.file_name,
                },
              });
            }, 1000);
            return;
          }

          const statusResult = await checkAnalysisStatus(uploadResult.file_id);

          if (statusResult === 'completed') {
            setLoadingProgress(100);
            // 분석 결과 가져오기
            const analysisResult = await getAnalysisResult(
              uploadResult.file_id
            );
            // 분석 완료 후 분석 페이지로 이동
            console.log('분석 페이지로 전달할 데이터:', {
              analysisResult,
              extractedText: uploadResult.extracted_text,
              fileName: uploadResult.file_name,
            });
            setTimeout(() => {
              navigate(`/analyze/${uploadResult.file_id}`, {
                state: {
                  analysisResult,
                  extractedText: uploadResult.extracted_text,
                  fileName: uploadResult.file_name,
                },
              });
            }, 1000);
          } else if (statusResult === 'processing') {
            // 진행률 업데이트 (20% → 90%)
            setLoadingProgress(prev => Math.min(prev + 10, 90));
            setTimeout(checkStatus, 2000); // 2초마다 확인
          } else if (statusResult === 'uploaded') {
            // 파일 업로드 완료 - 분석 시작으로 처리
            setLoadingProgress(40);
            setTimeout(checkStatus, 2000); // 2초마다 확인
          } else if (statusResult === 'failed') {
            throw new Error('분석에 실패했습니다.');
          } else {
            // 기타 상태 - 계속 확인
            setLoadingProgress(prev => Math.min(prev + 5, 90));
            setTimeout(checkStatus, 2000);
          }
        } catch (error) {
          console.error('분석 상태 확인 실패:', error);
          alert('분석 중 오류가 발생했습니다.');
          setIsAnalyzing(false);
        }
      };

      // 3. 분석 상태 확인 시작
      setTimeout(checkStatus, 1000);
    } catch (error) {
      console.error('분석 시작 실패:', error);
      alert('파일 업로드에 실패했습니다.');
      setIsAnalyzing(false);
    }
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
              • 등록 가능한 파일 형식은 .pdf, .doc, .docx, .hwp, .txt, .jpg,
              .jpeg, .png 입니다.
            </p>
            <p className="text-sm text-gray">
              • 파일은 한번에 하나만 업로드 할 수 있으며, 파일 1개 당 크기는
              20MB를 초과할 수 없습니다.
            </p>
          </div>

          {/* 파일 드래그 앤 드롭 영역 */}
          <div
            className={`border-2 border-dashed rounded-[10px] p-12 text-center transition-colors ${
              isDragOver
                ? 'border-secondary bg-secondary/10'
                : 'border-primary/60 hover:border-secondary/60 bg-primary/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
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
              accept=".pdf,.doc,.docx,.hwp,.txt,.jpg,.jpeg,.png"
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
                className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary accent-secondary flex-shrink-0 mt-0.5"
              />
              <span className="text-sm text-gray leading-relaxed">
                AI가 계약서를 분석하는 과정에서 성명, 연락처 등 일부 개인정보가
                일시적으로 활용될 수 있습니다. 이 정보는 계약서 분석 목적 외에는
                사용되지 않으며, 어떠한 경우에도 제3자에게 제공되지 않습니다.
                모든 개인정보는 24시간이 지나면 복구할 수 없도록 영구적으로
                삭제됩니다. 이에 동의합니다.
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
