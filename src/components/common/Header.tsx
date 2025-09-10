import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm h-18 flex items-center fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center w-full px-6">
        {/* 로고 영역 */}
        <div className="flex items-center space-x-2">
          {/* 로고 */}
          <div className="w-12 h-12">
            <img src={logo} alt="Checky" />
          </div>
          <div className="text-[24px] font-bold text-black">Checky</div>
          <div className="text-[12px] text-gray">
            체키와 더 나은 계약서 작성하기
          </div>
        </div>

        {/* 메뉴 영역 */}
        <div className="flex items-center space-x-8">
          {/* 메뉴 */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="font-regular cursor-pointer"
            >
              홈
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="font-regular cursor-pointer"
            >
              체키에게 물어보기
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="font-regular cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* 버튼 */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/upload')}
              className="bg-secondary text-white px-6 py-2 rounded-[10px] font-bold cursor-pointer"
            >
              분석하러 가기
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
