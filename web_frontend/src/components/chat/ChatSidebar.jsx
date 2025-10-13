import React from 'react';
import Card from '../common/Card';
import TextField from '../common/forms/TextField';
import Tag from '../common/Tag';

/**
 * ChatSidebar
 * PUBLIC_INTERFACE
 * Sidebar showing list of chat threads/contacts. Placeholder only.
 */
const ChatSidebar = ({ threads = [], activeId, onSelect }) => {
  return (
    <Card title="Conversations">
      <div className="space-y-3">
        <TextField placeholder="Search..." />
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {threads.length === 0 ? (
            <div className="text-sm text-gray-500">No conversations.</div>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect?.(t)}
                className={`w-full text-left p-2 rounded-md border hover:bg-gray-50 transition ${
                  activeId === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.name}</div>
                  {t.unread > 0 && <Tag color="secondary">{t.unread}</Tag>}
                </div>
                <div className="text-xs text-gray-500 truncate">{t.lastMessage || 'No messages yet'}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatSidebar;
