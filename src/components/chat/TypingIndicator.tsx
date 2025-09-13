import chatbot from '../../assets/chatbot.svg';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <img src={chatbot} alt="chatbot" className="w-10 h-10 mr-5" />
      <div className="bg-white text-[#9d9d9d] border-[2px] border-[#9d9d9d] px-5 py-2 rounded-2xl">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-gray rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
          <span className="text-[16px] text-gray ml-2">
            체키가 답변을 준비 중입니다
          </span>
        </div>
      </div>
    </div>
  );
}
