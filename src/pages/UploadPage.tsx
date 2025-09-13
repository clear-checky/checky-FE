import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  uploadFile,
  checkAnalysisStatus,
  parseContractToArticles,
  analyzeSentences,
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
  const [loadingStage, setLoadingStage] = useState<
    'uploading' | 'parsing' | 'analyzing' | 'completed'
  >('uploading');
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
      setLoadingStage('uploading');
      setLoadingProgress(0);
      setPollingCount(0); // 폴링 카운트 초기화

      // 1. 파일 업로드
      setLoadingProgress(20);
      const uploadResult = await uploadFile(uploadedFile);
      console.log('업로드 결과:', uploadResult);

      // 2. 분석 상태 확인 (폴링)
      const checkStatus = async () => {
        try {
          setPollingCount(prev => prev + 1);
          console.log(`폴링 횟수: ${pollingCount + 1}`);

          // 최대 30번 폴링 (1분) 후 타임아웃
          if (pollingCount >= 30) {
            console.log('폴링 타임아웃 - 분석 완료로 처리');
            setLoadingProgress(100);

            // 텍스트 파싱 단계
            setLoadingStage('parsing');
            setLoadingProgress(50);

            // 추출된 텍스트를 문장별로 파싱하여 articles 형태로 변환
            const parsedArticles = parseContractToArticles(
              uploadResult.extracted_text
            );
            console.log('파싱된 articles:', parsedArticles);

            // AI 분석 단계
            setLoadingStage('analyzing');
            setLoadingProgress(70);

            // AI 분석 수행 - 단순한 문장 배열로 전송
            const analysisResult = await analyzeSentences(
              parsedArticles,
              uploadResult.file_name
            );
            console.log('문장별 분석 결과:', analysisResult);

            // 백엔드에서 받은 분석 결과로 문장들의 risk 값 업데이트
            if (
              analysisResult &&
              analysisResult.articles &&
              analysisResult.articles.length > 0
            ) {
              // 백엔드에서 조항별로 그룹화된 결과를 그대로 사용
              const updatedArticles = analysisResult.articles;
              parsedArticles.splice(
                0,
                parsedArticles.length,
                ...updatedArticles
              );
            }

            // 분석 결과를 백엔드에 저장 (임시 비활성화)
            // try {
            //   await saveAnalysisResult(uploadResult.task_id, {
            //     articles: parsedArticles,
            //     analysisResult: analysisResult,
            //   });
            //   console.log('분석 결과 저장 완료');
            // } catch (error) {
            //   console.error('분석 결과 저장 실패:', error);
            // }

            setTimeout(() => {
              navigate(`/analyze/${uploadResult.task_id}`, {
                state: {
                  analysisResult,
                  extractedText: uploadResult.extracted_text,
                  fileName: uploadResult.file_name,
                  parsedArticles,
                },
              });
            }, 1000);
            return;
          }

          const statusResult = await checkAnalysisStatus(uploadResult.task_id);

          if (statusResult === 'completed') {
            setLoadingProgress(100);

            // 텍스트 파싱 단계
            setLoadingStage('parsing');
            setLoadingProgress(50);

            // 추출된 텍스트를 문장별로 파싱하여 articles 형태로 변환
            const parsedArticles = parseContractToArticles(
              uploadResult.extracted_text
            );
            console.log('파싱된 articles:', parsedArticles);

            // AI 분석 단계
            setLoadingStage('analyzing');
            setLoadingProgress(70);

            // AI 분석 수행 - 단순한 문장 배열로 전송
            const analysisResult = await analyzeSentences(
              parsedArticles,
              uploadResult.file_name
            );
            console.log('문장별 분석 결과:', analysisResult);

            // 백엔드에서 받은 분석 결과로 문장들의 risk 값 업데이트
            if (
              analysisResult &&
              analysisResult.articles &&
              analysisResult.articles.length > 0
            ) {
              // 백엔드에서 조항별로 그룹화된 결과를 그대로 사용
              const updatedArticles = analysisResult.articles;
              parsedArticles.splice(
                0,
                parsedArticles.length,
                ...updatedArticles
              );
            }

            // 분석 결과를 백엔드에 저장 (임시 비활성화)
            // try {
            //   await saveAnalysisResult(uploadResult.task_id, {
            //     articles: parsedArticles,
            //     analysisResult: analysisResult,
            //   });
            //   console.log('분석 결과 저장 완료');
            // } catch (error) {
            //   console.error('분석 결과 저장 실패:', error);
            // }

            // 분석 완료 단계
            setLoadingStage('completed');
            setLoadingProgress(100);

            // 분석 완료 후 분석 페이지로 이동
            console.log('분석 페이지로 전달할 데이터:', {
              analysisResult,
              extractedText: uploadResult.extracted_text,
              fileName: uploadResult.file_name,
              parsedArticles,
            });
            setTimeout(() => {
              navigate(`/analyze/${uploadResult.task_id}`, {
                state: {
                  analysisResult,
                  extractedText: uploadResult.extracted_text,
                  fileName: uploadResult.file_name,
                  parsedArticles,
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
    <div
      className="min-h-screen bg-white"
      style={{ minHeight: 'calc(100vh - 72px)' }}
    >
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* 업로드 카드 */}
        <div className="bg-white rounded-[10px] border border-light-gray/60 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary">
              계약서 분석하기
            </h2>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/samples/근로계약서.pdf';
                link.download = '근로계약서.pdf';
                link.click();
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer border border-gray-300"
            >
              📁 테스트 파일
            </button>
          </div>

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
            fileInputRef={fileInputRef}
            isUploading={isAnalyzing && loadingStage === 'uploading'}
          />

          {/* 개인정보 동의 체크박스 */}
          <div className="mt-6">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={e => setIsAgreed(e.target.checked)}
                className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary accent-secondary flex-shrink-0 mt-0.5 cursor-pointer"
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
                  ? 'bg-secondary text-white hover:opacity-90 cursor-pointer'
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
        stage={loadingStage}
        onClose={() => setIsAnalyzing(false)}
      />
    </div>
  );
}
