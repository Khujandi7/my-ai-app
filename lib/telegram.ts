const API = 'https://api.telegram.org';

export interface InlineButton {
  text: string;
  callback_data: string;
}

function token(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  return t;
}

async function call(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}/bot${token()}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`Telegram ${method} failed:`, res.status, await res.text());
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function sendMessage(
  chatId: number,
  text: string,
  opts: { html?: boolean; buttons?: InlineButton[][] } = {},
) {
  return call('sendMessage', {
    chat_id: chatId,
    text: text.slice(0, 4096),
    ...(opts.html ? { parse_mode: 'HTML' } : {}),
    ...(opts.buttons ? { reply_markup: { inline_keyboard: opts.buttons } } : {}),
  });
}

export function editMessage(
  chatId: number,
  messageId: number,
  text: string,
  opts: { html?: boolean; buttons?: InlineButton[][] } = {},
) {
  return call('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text: text.slice(0, 4096),
    ...(opts.html ? { parse_mode: 'HTML' } : {}),
    reply_markup: { inline_keyboard: opts.buttons ?? [] },
  });
}

export function answerCallback(id: string, text?: string) {
  return call('answerCallbackQuery', { callback_query_id: id, ...(text ? { text } : {}) });
}

export function sendTyping(chatId: number) {
  return call('sendChatAction', { chat_id: chatId, action: 'typing' });
}
