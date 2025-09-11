import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  uploadFile,
  checkAnalysisStatus,
  getAnalysisResult,
} from '../api/uploadApi';
import FileUploadArea from '../components/FileUploadArea';
import LoadingModal from '../components/LoadingModal';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
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

  // 파일 제거 핸들러
  const handleRemoveFile = () => {
    setUploadedFile(null);
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

          {/* 파일 업로드 영역 */}
          <FileUploadArea
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileButtonClick={handleFileButtonClick}
            onFileInputChange={handleFileInputChange}
            uploadedFile={uploadedFile}
            onRemoveFile={handleRemoveFile}
          />

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
      <LoadingModal
        isOpen={isAnalyzing}
        progress={loadingProgress}
        onClose={() => setIsAnalyzing(false)}
      />
    </div>
  );
}
