import ReactMarkdown from 'react-markdown';
import chatbot from '../../assets/chatbot.svg';

interface MessageProps {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Message({ text, isUser }: MessageProps) {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-animation`}
    >
      {!isUser && <img src={chatbot} alt="chatbot" className="w-10 h-10" />}
      <div
        className={`chat-message px-5 py-3 rounded-[20px] ${
          isUser ? 'bg-primary text-black' : 'bg-white text-black'
        }`}
      >
        <div className="text-[16px] leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="mb-2 last:mb-0 pl-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-2 last:mb-0 pl-4">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto mb-2">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">
                  {children}
                </blockquote>
              ),
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-bold mb-2">{children}</h3>
              ),
              strong: ({ children }) => (
                <strong className="font-bold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
