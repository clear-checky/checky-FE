import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="bg-black text-white pt-16 relative z-50">
            <div className="w-full px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* 로고 및 설명 */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4">
                            <span className="text-2xl font-bold">Checky</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            AI 기반 계약서 분석 서비스로<br />
                            안전하고 투명한 계약서를 작성하세요.
                        </p>
                        <div className="text-xs text-gray-400">
                            © 2025 Checky. All rights reserved.
                        </div>
                    </div>

                    {/* 서비스 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">서비스</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => navigate('/upload')}
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    계약서 분석
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    체키에게 물어보기
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/faq')}
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    FAQ
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* 고객지원 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">고객지원</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="mailto:support@checky.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    support@checky.com
                                </a>
                            </li>
                            <li>
                                <span className="text-gray-300">평일 09:00 - 18:00</span>
                            </li>
                            <li>
                                <span className="text-gray-300">토요일 09:00 - 13:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 하단 구분선 및 추가 정보 */}
                <div className="border-t border-gray-700 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                        <div className="mb-4 md:mb-0">
                            <span className="mr-4">개인정보처리방침</span>
                            <span className="mr-4">이용약관</span>
                            <span>사업자정보</span>
                        </div>
                        <div className="text-center">
                            <p>개인정보 보호를 위해 모든 정보는 24시간 내 영구 삭제됩니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
