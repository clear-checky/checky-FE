import { useState, useEffect, useRef } from 'react';
import sendbtn from '../assets/sendbtn.svg';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '표준 근로계약서에 대해 알고 싶어.',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: '네, 표준근로계약서에 대해 자세히 알려드릴게요. 표준근로계약서란 대한민국 고용노동부에서 근로기준법에 따라 필수적인 근로 조건을 명시하여, 누구나 쉽게 사용할 수 있도록 만들어 배포하는 표준 양식의 근로계약서를 말합니다.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: '죄송합니다. 현재 AI 응답 기능을 구현 중입니다. 곧 더 나은 서비스를 제공해드릴 예정입니다.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  return (
    <div className="h-screen flex flex-col pt-18">
      {/* 채팅 메시지 영역  */}
      <div className="flex-1 overflow-y-auto px-16 py-10">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-animation`}
            >
              <div
                className={`chat-message px-5 py-3 rounded-[20px] ${
                  message.isUser
                    ? 'bg-primary text-black'
                    : 'bg-white text-black'
                }`}
              >
                <p className="text-[16px] leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <div className="flex justify-start message-animation">
              <div className="bg-white text-gray shadow-sm border border-gray px-4 py-3 rounded-2xl">
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
                  <span className="text-xs text-gray ml-2">
                    체키가 답변을 준비 중입니다...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 섹션 - 고정 */}
      <div className="flex-shrink-0 px-16 py-4 bg-white border-t border-gray-200">
        <div className="bg-primary rounded-[20px] p-4 flex items-end space-x-3 shadow-sm">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="궁금한 점은 무엇이든지 체키에게 물어보세요!"
              className="w-full bg-transparent border-none outline-none overflow-hidden resize-none text-black placeholder-gray text-[16px] leading-relaxed"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '160px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
          >
            <img src={sendbtn} alt="send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
