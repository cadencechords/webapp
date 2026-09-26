import type { StreamMessage } from 'stream-chat-react';

export function isPoll(message: StreamMessage) {
  return message.attachments?.[0]?.type === 'poll';
}
