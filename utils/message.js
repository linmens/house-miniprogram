import Message from 'tdesign-miniprogram/message/index';
export function showMessage(message) {
  Message.info({
    context: this,
    offset: [90, 32],
    duration: 3000,
    content: message,
  });
}