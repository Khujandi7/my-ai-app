import { NextRequest, NextResponse } from 'next/server';
import { dailyVocabulary, quizQuestions, type Difficulty } from '@/data/content';
import {
  answerCallback,
  editMessage,
  escapeHtml,
  sendMessage,
  sendTyping,
  type InlineButton,
} from '@/lib/telegram';
import { practiceStarter, tutorReply } from '@/lib/tutor';

export const runtime = 'nodejs';
export const maxDuration = 30;

const LABELS: Record<Difficulty, string> = {
  easy: '🟢 Лёгкий',
  medium: '🟡 Средний',
  hard: '🔴 Сложный',
};

const HELP =
  '👋 Привет! Я бот для изучения английского.\n\n' +
  '/word — слово дня\n' +
  '/quiz — викторина с вопросами\n' +
  '/practice — разговорная практика с ИИ\n' +
  '/help — это сообщение\n\n' +
  'Или просто напиши мне любое сообщение на английском (или вопрос по-русски), и я исправлю ошибки и отвечу.';

function wordOfTheDay() {
  const day = Math.floor(Date.now() / 86_400_000);
  return dailyVocabulary[day % dailyVocabulary.length];
}

function randomWord() {
  return dailyVocabulary[Math.floor(Math.random() * dailyVocabulary.length)];
}

function sendWord(chatId: number, random: boolean) {
  const w = random ? randomWord() : wordOfTheDay();
  const text =
    `📚 <b>${escapeHtml(w.word)}</b> — ${escapeHtml(w.translation)}\n\n` +
    `💬 <i>${escapeHtml(w.example)}</i>`;
  return sendMessage(chatId, text, {
    html: true,
    buttons: [[{ text: '🔄 Другое слово', callback_data: 'w' }]],
  });
}

function difficultyMenu(chatId: number) {
  return sendMessage(chatId, 'Выбери уровень сложности:', {
    buttons: [
      (Object.keys(LABELS) as Difficulty[]).map((d) => ({
        text: LABELS[d],
        callback_data: `d:${d}`,
      })),
    ],
  });
}

function pickQuestion(difficulty: Difficulty) {
  const pool = quizQuestions.filter((q) => q.difficulty === difficulty);
  return pool[Math.floor(Math.random() * pool.length)];
}

function questionPayload(difficulty: Difficulty) {
  const q = pickQuestion(difficulty);
  const buttons: InlineButton[][] = q.options.map((opt, i) => [
    { text: opt, callback_data: `q:${q.id}:${i}` },
  ]);
  return { text: `${LABELS[difficulty]}\n\n${q.text}`, buttons };
}

async function handleMessage(chatId: number, rawText: string) {
  const text = rawText.trim();
  const command = text.split(/[\s@]/)[0].toLowerCase();

  if (command === '/start' || command === '/help') return sendMessage(chatId, HELP);
  if (command === '/word') return sendWord(chatId, false);
  if (command === '/quiz') return difficultyMenu(chatId);

  if (command === '/practice') {
    await sendTyping(chatId);
    return sendMessage(chatId, await practiceStarter());
  }

  if (text.startsWith('/')) return sendMessage(chatId, 'Не знаю такую команду. Напиши /help.');

  await sendTyping(chatId);
  try {
    return await sendMessage(chatId, await tutorReply(text.slice(0, 1000)));
  } catch (err) {
    console.error('tutor error', err);
    return sendMessage(chatId, 'Упс, ИИ-репетитор сейчас недоступен. Попробуй позже 🙏');
  }
}

async function handleCallback(
  id: string,
  chatId: number,
  messageId: number,
  data: string,
) {
  if (data === 'w') {
    await answerCallback(id);
    return sendWord(chatId, true);
  }

  if (data.startsWith('d:')) {
    const d = data.slice(2) as Difficulty;
    if (!(d in LABELS)) return answerCallback(id);
    await answerCallback(id);
    const { text, buttons } = questionPayload(d);
    return editMessage(chatId, messageId, text, { buttons });
  }

  if (data.startsWith('q:')) {
    const [, qid, idxStr] = data.split(':');
    const q = quizQuestions.find((x) => x.id === qid);
    const idx = Number(idxStr);
    if (!q || Number.isNaN(idx)) return answerCallback(id);

    const ok = idx === q.correctAnswer;
    await answerCallback(id, ok ? '✅ Верно!' : '❌ Неверно');
    const result =
      `${q.text}\n\n` +
      (ok
        ? `✅ Верно! ${q.options[q.correctAnswer]}`
        : `❌ Ты ответил: ${q.options[idx]}\n✅ Правильный ответ: ${q.options[q.correctAnswer]}`) +
      `\n\n💡 ${q.explanation}`;
    return editMessage(chatId, messageId, result, {
      buttons: [
        [
          { text: '➡️ Ещё вопрос', callback_data: `d:${q.difficulty}` },
          { text: '🎚 Сложность', callback_data: 'm' },
        ],
      ],
    });
  }

  if (data === 'm') {
    await answerCallback(id);
    return editMessage(chatId, messageId, 'Выбери уровень сложности:', {
      buttons: [
        (Object.keys(LABELS) as Difficulty[]).map((d) => ({
          text: LABELS[d],
          callback_data: `d:${d}`,
        })),
      ],
    });
  }

  return answerCallback(id);
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const update = await req.json();
    if (update.message?.text) {
      await handleMessage(update.message.chat.id, update.message.text);
    } else if (update.callback_query?.message) {
      const cq = update.callback_query;
      await handleCallback(cq.id, cq.message.chat.id, cq.message.message_id, cq.data ?? '');
    }
  } catch (err) {
    console.error('telegram webhook error', err);
  }
  // Always 200 so Telegram doesn't endlessly retry the same update.
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: true, service: 'english-bot' });
}
