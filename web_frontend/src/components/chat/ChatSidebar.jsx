import React from 'react';
import Card from '../common/Card';
import TextField from '../common/forms/TextField';
import Tag from '../common/Tag';

/**
 * PUBLIC_INTERFACE
 * ChatSidebar - list of chat threads/contacts with navigation semantics.
 */
const ChatSidebar = ({ threads = [], activeId, onSelect }) => {
  return (
    <Card title="Conversations">
      <div className="space-y-3">
        <TextField placeholder="Search..." name="chat-search" />
        <nav role="navigation" aria-label="Conversations">
          <ul role="list" className="space-y-2 max-h-[60vh] overflow-auto" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {threads.length === 0 ? (
              <li role="listitem">
                <div className="text-sm text-gray-500">No conversations.</div>
              </li>
            ) : (
              threads.map((t) => (
                <li key={t.id} role="listitem">
                  <button
                    onClick={() => onSelect?.(t)}
                    aria-current={activeId === t.id ? 'page' : undefined}
                    aria-label={`Open conversation ${t.name}`}
                    className={`w-full text-left p-2 rounded-md border hover:bg-gray-50 transition ${
                      activeId === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{t.name}</div>
                      {t.unread > 0 && <Tag color="secondary">{t.unread}</Tag>}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{t.lastMessage || 'No messages yet'}</div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </Card>
  );
};

export default ChatSidebar;
