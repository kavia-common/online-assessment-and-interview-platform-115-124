import React, { useState } from 'react';
import Button from '../common/Button';

/**
 * PUBLIC_INTERFACE
 * MessageInput - text input with send button and accessible form semantics.
 */
const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const submit = (e) => {
    e?.preventDefault?.();
    if (!text.trim()) return;
    onSend?.(text);
    setText('');
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-8" role="form" aria-label="Send message">
      <label className="sr-only" htmlFor="chat-input">Message</label>
      <input
        id="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        aria-label="Message"
        style={{
          flex: 1,
          padding: 12,
          borderRadius: 10,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            submit(e);
          }
        }}
      />
      <Button type="submit" variant="primary" aria-label="Send message">
        Send
      </Button>
    </form>
  );
};

export default MessageInput;
