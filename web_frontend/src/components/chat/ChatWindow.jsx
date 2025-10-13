import React, { useEffect, useRef } from 'react';
import Card from '../common/Card';

/**
 * ChatWindow
 * PUBLIC_INTERFACE
 * Displays the messages for current chat. Placeholder only.
 */
const ChatWindow = ({ title, messages = [] }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card title={title || 'Conversation'}>
      <div className="h-[50vh] overflow-auto space-y-2 p-1">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500">Say hello to start the conversation.</div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 text-sm shadow ${
                  m.me ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                <div className={`mt-1 text-[10px] opacity-70 ${m.me ? 'text-blue-100' : 'text-gray-500'}`}>
                  {m.time || ''}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </Card>
  );
};

export default ChatWindow;
