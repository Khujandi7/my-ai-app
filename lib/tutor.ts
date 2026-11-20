import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are a friendly English tutor in a Telegram bot. The student is a Russian-speaking learner (A2-B2).
Rules:
- Reply in simple, natural English (2-4 short sentences) and end with one short follow-up question to keep the conversation going.
- If the student's message has mistakes, add a section that starts with "✏️ Исправления:" and list the corrected version and a one-line explanation IN RUSSIAN for each mistake. If there are no mistakes, skip this section.
- If the student writes in Russian or asks about grammar/vocabulary, explain in Russian with 1-2 English examples.
- Plain text only. No markdown, no asterisks, no headings.
- Stay on the topic of learning English; politely steer back if asked about something else.`;

function client() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenAI({ apiKey });
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export async function tutorReply(userText: string): Promise<string> {
  const response = await client().models.generateContent({
    model: MODEL,
    contents: userText,
    config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 600 },
  });
  return response.text?.trim() || 'Sorry, I could not answer. Please try again!';
}

export async function practiceStarter(): Promise<string> {
  const response = await client().models.generateContent({
    model: MODEL,
    contents:
      'Start a short conversation practice. Pick a random everyday topic (travel, food, work, hobbies, family, etc.), say hello, ask ONE simple question about it in English, and add a Russian translation of the question in parentheses. Max 3 sentences.',
    config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 300 },
  });
  return response.text?.trim() || "Hi! What did you do today? (Что ты сегодня делал?)";
}
