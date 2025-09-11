interface LoadingModalProps {
  isOpen: boolean;
  progress: number;
  onClose: () => void;
}

export default function LoadingModal({
  isOpen,
  progress,
  onClose,
}: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h2 className="text-lg font-semibold text-black">Checky</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
        </div>

        {/* 메인 콘텐츠 */}
        <div className="text-center">
          <h3 className="text-base font-medium text-black mb-2">
            체키가 당신의 계약서를 분석 중입니다.
          </h3>
          <p className="text-sm text-gray mb-6">
            {progress < 100 ? '분석 중...' : '분석 완료!'}
          </p>

          {/* 프로그레스 바 */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-secondary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 프로그레스 텍스트 */}
          <p className="text-sm text-gray">{progress}%</p>
        </div>
      </div>
    </div>
  );
}
