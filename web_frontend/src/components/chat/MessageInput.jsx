import React, { useState } from 'react';
import Button from '../common/Button';
import TextField from '../common/forms/TextField';

/**
 * MessageInput
 * PUBLIC_INTERFACE
 * Text input with send button. Placeholder only.
 */
const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    onSend?.(text);
    setText('');
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <TextField
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
      </div>
      <Button variant="primary" onClick={send}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
