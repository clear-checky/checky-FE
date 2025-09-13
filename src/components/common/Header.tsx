import logo from '../../assets/logo.svg';
import HeaderButton from './HeaderButton';

export default function Header() {

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
            <HeaderButton to="/">
              홈
            </HeaderButton>
            <HeaderButton to="/chat">
              체키에게 물어보기
            </HeaderButton>
            <HeaderButton to="/faq">
              FAQ
            </HeaderButton>
          </div>

          {/* 버튼 */}
          <div className="flex items-center">
            <HeaderButton to="/upload" variant="primary">
              분석하러 가기
            </HeaderButton>
          </div>
        </div>
      </div>
    </header>
  );
}
