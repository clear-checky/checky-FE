import React, { useRef } from 'react';

interface FileUploadAreaProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileButtonClick: () => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFile: File | null;
  onRemoveFile: () => void;
}

export default function FileUploadArea({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileButtonClick,
  onFileInputChange,
  uploadedFile,
  onRemoveFile,
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* 파일 업로드 규칙 */}
      <div className="mb-6 space-y-2">
        <p className="text-sm text-gray">
          • 등록 가능한 파일 형식은 .pdf, .doc, .docx, .hwp, .txt, .jpg, .jpeg,
          .png 입니다.
        </p>
        <p className="text-sm text-gray">
          • 파일은 한번에 하나만 업로드 할 수 있으며, 파일 1개 당 크기는 20MB를
          초과할 수 없습니다.
        </p>
        <p className="text-sm text-gray">
          • 업로드된 파일은 24시간 후 자동으로 삭제됩니다.
        </p>
      </div>

      {/* 파일 선택 박스 */}
      <div
        className={`border-2 border-dashed rounded-[10px] p-8 text-center transition-colors ${
          isDragOver
            ? 'border-secondary bg-secondary/5'
            : 'border-gray-300 bg-light-green hover:border-secondary hover:bg-secondary/5'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="text-base font-medium text-black mb-1">
              파일을 드래그하거나 클릭하여 업로드하세요
            </p>
            <p className="text-sm text-gray">
              PDF, DOC, DOCX, HWP, TXT, JPG, JPEG, PNG 파일 지원
            </p>
          </div>
          <button
            onClick={onFileButtonClick}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            파일 선택
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onFileInputChange}
          accept=".pdf,.doc,.docx,.hwp,.txt,.jpg,.jpeg,.png"
        />
      </div>

      {/* 업로드된 파일 표시 */}
      {uploadedFile && (
        <div className="bg-white border border-light-gray/60 rounded-[10px] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-black">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={onRemoveFile}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
