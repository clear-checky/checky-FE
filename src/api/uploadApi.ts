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
    task_id: `file_${Date.now()}`,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type.split('/')[1],
    extracted_text: `<<${file.name}>>\n\n- 이 파일은 Mock 데이터로 생성된 추출 텍스트입니다.\n- 실제 OCR 추출 결과를 시뮬레이션합니다.\n- 계약서 분석을 위한 텍스트 내용이 여기에 표시됩니다.`,
  };
};

const mockCheckAnalysisStatus = async (taskId: string) => {
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
export const uploadFile = async (file: File) => {
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

export const checkAnalysisStatus = async (taskId: string) => {
  if (USE_MOCK_DATA) {
    return mockCheckAnalysisStatus(taskId);
  }

  console.log('상태 확인 시작:', taskId);

  try {
    const response = await fetch(`${API_BASE_URL}/upload/status/${taskId}`);
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

export const getAnalysisResult = async (taskId: string) => {
  if (USE_MOCK_DATA) {
    // Mock 데이터로 분석 결과 반환
    return {
      id: taskId,
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
  const response = await fetch(`${API_BASE_URL}/upload/analysis/${taskId}`);

  if (!response.ok) {
    throw new Error('분석 결과를 가져오는데 실패했습니다.');
  }

  return response.json();
};
