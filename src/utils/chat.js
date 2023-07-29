export function isPoll(message) {
  return message.attachments?.[0]?.type === 'poll';
}
