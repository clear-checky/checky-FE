import { useState, useEffect, useRef } from 'react';
import * as api from '../api/api';
import Message from '../components/chat/Message';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const messageToChatMessage = (msg: Message): api.ChatMessage => ({
  role: msg.isUser ? 'user' : 'assistant',
  content: msg.text,
  timestamp: msg.timestamp.toISOString(),
});

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요, 체키입니다! 궁금한 점은 무엇이든지 물어보세요 :)',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: messageText,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(true);

      try {
        const conversationHistory = [...messages, newMessage]
          .filter(msg => msg.text && msg.text.trim() !== '')
          .map(messageToChatMessage);

        let response;
        try {
          response = await api.askChecky(messageText, conversationHistory);
        } catch (firstError) {
          console.log('첫 번째 시도 실패, 대안 방법으로 재시도:', firstError);
          try {
            response = await api.askCheckyAlt(messageText, conversationHistory);
          } catch (secondError) {
            console.log(
              '두 번째 시도 실패, 세 번째 방법으로 재시도:',
              secondError
            );
            try {
              response = await api.askCheckyWithHistory(
                messageText,
                conversationHistory
              );
            } catch (thirdError) {
              console.log(
                '세 번째 시도 실패, 간단한 방법으로 재시도:',
                thirdError
              );
              response = await api.askCheckySimple(messageText);
            }
          }
        }

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

        const errorResponse: Message = {
          id: Date.now() + 1,
          text: '죄송합니다, 잠시 후 다시 시도해주세요.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col">
      {/* 채팅 메시지 영역  */}
      <div className="flex-1 overflow-y-auto px-16 py-10">
        <div className="space-y-4">
          {messages.map(message => (
            <Message
              key={message.id}
              id={message.id}
              text={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}

          {/* 타이핑 인디케이터 */}
          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 섹션 - 고정 */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
