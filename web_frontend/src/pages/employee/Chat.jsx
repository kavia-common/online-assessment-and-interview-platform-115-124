import React, { useEffect, useMemo, useState } from 'react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import MessageInput from '../../components/chat/MessageInput';
import Card from '../../components/common/Card';
import { useEmployeeChatSocket } from '../../services/websocket';

/**
 * Chat
 * PUBLIC_INTERFACE
 * Employee chat page with Admin/HR. WebSocket integration is a placeholder.
 */
const Chat = () => {
  // Placeholder threads and messages
  const [threads] = useState([
    { id: 'admin', name: 'Admin', unread: 0, lastMessage: 'Welcome to the platform!' },
    { id: 'hr', name: 'HR', unread: 2, lastMessage: 'Please confirm the interview schedule.' },
  ]);
  const [active, setActive] = useState(threads[0]);
  const [messages, setMessages] = useState([
    { text: 'Welcome to the platform!', me: false, time: '09:00' },
  ]);

  // Placeholder WebSocket hook
  // Implement in services/websocket.js with proper backend URL and auth.
  const { socketConnected, sendMessage } = useEmployeeChatSocket({
    room: active?.id,
    onMessage: (msg) => {
      setMessages((prev) => [...prev, { text: msg.text, me: false, time: msg.time }]);
    },
  });

  useEffect(() => {
    // Reset messages when switching threads (placeholder behavior)
    setMessages([{ text: `You are now chatting with ${active?.name}.`, me: false, time: '' }]);
  }, [active]);

  const title = useMemo(() => (active ? `Chat with ${active.name}` : 'Conversation'), [active]);

  const handleSend = (text) => {
    const msg = { text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, { ...msg, me: true }]);
    // Attempt to send via websocket (placeholder)
    sendMessage?.(active?.id, text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <ChatSidebar threads={threads} activeId={active?.id} onSelect={setActive} />
      </div>
      <div className="lg:col-span-2 space-y-3">
        <ChatWindow title={`${title}${socketConnected ? '' : ' (Offline)'}`} messages={messages} />
        <Card>
          <MessageInput onSend={handleSend} />
          {!socketConnected && (
            <div className="mt-2 text-xs text-gray-500">
              WebSocket not connected. Messages will not be delivered (placeholder).
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
