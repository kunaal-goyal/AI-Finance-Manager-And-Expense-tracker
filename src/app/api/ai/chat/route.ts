import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt, generateSmartFallbackResponse, ChatContextPayload } from '@/lib/gemini';

function sanitizeHistoryForGemini(rawHistory: any[]) {
  const list: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const msg of rawHistory || []) {
    if (!msg || typeof msg.content !== 'string' || !msg.content.trim()) continue;
    // Skip internal errors
    if (msg.content.startsWith('⚠️')) continue;
    const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model';
    list.push({ role, parts: [{ text: msg.content }] });
  }

  // Gemini requires that the first item in chat history has role 'user'
  while (list.length > 0 && list[0].role !== 'user') {
    list.shift();
  }

  // Gemini requires strictly alternating roles (user, model, user, model)
  const alternating: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const item of list) {
    if (alternating.length === 0 || alternating[alternating.length - 1].role !== item.role) {
      alternating.push(item);
    }
  }

  // History must end with 'model' so that the incoming user message alternates smoothly
  while (alternating.length > 0 && alternating[alternating.length - 1].role !== 'model') {
    alternating.pop();
  }

  return alternating.slice(-6);
}

export async function POST(req: NextRequest) {
  let userMessage = 'Analyze my expenses';
  let contextPayload: Partial<ChatContextPayload> | null = null;

  try {
    const body = await req.json().catch(() => ({}));
    const { message, history = [], context } = body;

    userMessage = typeof message === 'string' && message.trim() ? message.trim() : userMessage;
    contextPayload = context || null;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'A valid message string is required.' },
        { status: 400 }
      );
    }

    if (!context || !context.summary || !context.userProfile) {
      return NextResponse.json(
        { error: 'Financial context payload is required to give personalized answers.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if real Gemini API key is configured
    const hasValidKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('your-google-gemini-api-key');

    if (!hasValidKey) {
      const fallbackReply = generateSmartFallbackResponse(userMessage, context as ChatContextPayload);
      return NextResponse.json({
        reply: fallbackReply,
        isOfficialGemini: false,
        notice: 'Tip: Add your Google Gemini API key to .env.local to enable live model reasoning!',
      });
    }

    // Call official Google Gemini API with gemini-3.5-flash-lite
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = buildSystemPrompt(context as ChatContextPayload);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt,
    });

    const formattedHistory = sanitizeHistoryForGemini(history);

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const replyText = response.text();

    return NextResponse.json({
      reply: replyText,
      isOfficialGemini: true,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error?.message || error);

    // Fallback gracefully on any API model issue using already extracted context
    const fallbackReply = generateSmartFallbackResponse(userMessage, contextPayload);

    return NextResponse.json(
      {
        reply: fallbackReply,
        isOfficialGemini: false,
        error: error?.message || 'Error communicating with Gemini model',
      },
      { status: 200 }
    );
  }
}
