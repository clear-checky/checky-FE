import { useState, useEffect, useRef } from 'react';
import sendbtn from '../../assets/sendbtn.svg';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText);
      setInputText('');
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
            disabled={disabled}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || disabled}
          className="bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
        >
          <img src={sendbtn} alt="send" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
