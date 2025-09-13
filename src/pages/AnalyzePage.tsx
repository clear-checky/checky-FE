import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import ClauseCard from '../components/ClauseCard';
import SafetyScoreBar from '../components/SafetyScoreBar';
import type { Article } from '../components/types';
import { getAnalysisResult } from '../api/api';

type Counts = { danger: number; warning: number; safe: number; total: number };

// 문장 위험도 집계
const computeCounts = (articles: Article[]): Counts => {
  let danger = 0,
    warning = 0,
    safe = 0,
    total = 0;

  for (const a of articles) {
    // sentences가 배열인지 확인하고 안전하게 처리
    if (a.sentences && Array.isArray(a.sentences)) {
      for (const s of a.sentences) {
        total += 1;
        if (s.risk === 'danger') danger += 1;
        else if (s.risk === 'warning') warning += 1;
        else safe += 1;
      }
    }
  }
  return { danger, warning, safe, total };
};

export default function AnalyzePage() {
  const { taskId } = useParams<{ taskId?: string }>();
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('계약서');

  // API → taskId가 있으면 결과 조회
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrMsg(null);
      try {
        // UploadPage에서 전달받은 데이터가 있으면 사용
        if (location.state && location.state.parsedArticles) {
          console.log('UploadPage에서 전달받은 데이터 사용:', location.state);
          console.log('parsedArticles 구조:', location.state.parsedArticles);
          console.log('전달받은 fileName:', location.state.fileName);
          setArticles(location.state.parsedArticles as Article[]);
          // AI 추출 제목 사용
          if (
            location.state.analysisResult &&
            location.state.analysisResult.title
          ) {
            console.log(
              'AI 추출 제목 설정:',
              location.state.analysisResult.title
            );
            setFileName(location.state.analysisResult.title);
          } else if (location.state.fileName) {
            const fileNameWithoutExt = location.state.fileName.replace(
              /\.[^/.]+$/,
              ''
            );
            console.log('fallback fileName 설정:', fileNameWithoutExt);
            setFileName(fileNameWithoutExt);
          } else {
            console.log('제목 정보가 없어서 기본값 사용');
          }
        } else if (taskId) {
          // 백엔드 파이프라인 결과 사용
          const res = await getAnalysisResult(taskId);
          console.log('백엔드에서 받은 데이터 구조:', res);
          console.log('백엔드에서 받은 file_name:', res.file_name);
          setArticles(res.articles as Article[]);
          // 백엔드에서 받은 AI 추출 제목 사용
          if (res.title) {
            console.log('백엔드 AI 추출 제목 설정:', res.title);
            setFileName(res.title);
          } else if (res.file_name) {
            const fileNameWithoutExt = res.file_name.replace(/\.[^/.]+$/, '');
            console.log('fallback file_name 설정:', fileNameWithoutExt);
            setFileName(fileNameWithoutExt);
          } else {
            console.log('백엔드에서 제목 정보가 없어서 기본값 사용');
          }
        } else {
          // taskId가 없으면 에러 표시
          setErrMsg(
            '분석할 계약서가 없습니다. 업로드 페이지에서 파일을 업로드해주세요.'
          );
          setArticles([]);
        }
      } catch (err: any) {
        console.error('분석 결과 로드 실패:', err);
        setErrMsg(err?.message ?? '분석 결과를 불러오지 못했습니다.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [taskId, location.state]);

  // 디버깅: articles 상태 확인
  console.log('현재 articles 상태:', articles);
  console.log('articles 길이:', articles.length);

  const counts = useMemo(() => computeCounts(articles), [articles]);
  const safetyPercent = useMemo(() => {
    if (!counts.total) return 100;
    return Math.round((counts.safe / counts.total) * 1000) / 10;
  }, [counts]);

  const printRef = useRef<HTMLDivElement | null>(null);

  if (loading) {
    return <div className="p-10 text-center text-gray">분석 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-black mb-6">{fileName}</h1>

        {errMsg && (
          <div className="mb-4 rounded-[10px] bg-red/10 p-3 text-sm text-red">
            {errMsg}
          </div>
        )}

        <SectionHeader
          title="계약서 요약"
          subtitle="조항을 클릭하면 상세 위험 문장과 수정 권고를 확인할 수 있어요."
          counts={{
            danger: counts.danger,
            warning: counts.warning,
            safe: counts.safe,
          }}
        />

        <div ref={printRef} className="space-y-4 print-scale-80">
          {articles.map(a => (
            <ClauseCard key={a.id} article={a} />
          ))}

          <h2 className="mt-10 text-[22px] font-semibold text-black mb-2">
            내 계약서는 얼마나 안전할까?
          </h2>
          <div className="rounded-[10px] border border-light-gray/60 bg-white/70 p-6 shadow-sm">
            <p className="text-gray mb-4 text-center">
              전체 문장 대비 안전 지수는{' '}
              <span className="font-extrabold text-green text-[36px] px-3">
                {safetyPercent}%
              </span>{' '}
              입니다.
            </p>
            <SafetyScoreBar
              danger={counts.danger}
              warning={counts.warning}
              safe={counts.safe}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
