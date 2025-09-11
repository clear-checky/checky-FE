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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-12 max-w-md w-full mx-4 text-center relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
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
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-gray">
          {progress < 100 ? `분석 중... ${progress}%` : '분석 완료!'}
        </div>
      </div>
    </div>
  );
}
