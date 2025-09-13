import { useState, useEffect, useRef } from 'react';
import sendbtn from '../assets/sendbtn.svg';
import * as api from '../api/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Message를 ChatMessage로 변환하는 헬퍼 함수
const messageToChatMessage = (msg: Message): api.ChatMessage => ({
  role: msg.isUser ? 'user' : 'assistant',
  content: msg.text,
  timestamp: msg.timestamp.toISOString(),
});

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요, 체키입니다! 궁금한 점은 무엇이든지 물어보세요!',
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

  const handleSendMessage = async () => {
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

      try {
        // 현재 메시지들을 ChatMessage 형태로 변환 (undefined content 제거)
        const conversationHistory = [...messages, newMessage]
          .filter(msg => msg.text && msg.text.trim() !== '') // 빈 메시지 제거
          .map(messageToChatMessage);

        let response;
        try {
          // 먼저 'message' 필드로 시도
          response = await api.askChecky(inputText, conversationHistory);
        } catch (firstError) {
          console.log('첫 번째 시도 실패, 대안 방법으로 재시도:', firstError);
          try {
            // 'question' 필드로 재시도
            response = await api.askCheckyAlt(inputText, conversationHistory);
          } catch (secondError) {
            console.log(
              '두 번째 시도 실패, 세 번째 방법으로 재시도:',
              secondError
            );
            try {
              // 'history' 필드명으로 재시도
              response = await api.askCheckyWithHistory(
                inputText,
                conversationHistory
              );
            } catch (thirdError) {
              console.log(
                '세 번째 시도 실패, 간단한 방법으로 재시도:',
                thirdError
              );
              // 가장 간단한 형태로 재시도
              response = await api.askCheckySimple(inputText);
            }
          }
        }

        // AI 응답을 Message 형태로 변환
        console.log('Received response:', response);
        const aiResponse: Message = {
          id: Date.now() + 1,
          text:
            response.answer || response.message || '응답을 받지 못했습니다.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('채팅 API 호출 실패:', error);

        // 에러 발생 시 기본 메시지 표시
        const errorResponse: Message = {
          id: Date.now() + 1,
          text: '죄송합니다. 현재 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsTyping(false);
      }
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
    <div className="h-[calc(100vh-72px)] flex flex-col">
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
