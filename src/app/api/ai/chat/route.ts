import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt, generateSmartFallbackResponse, ChatContextPayload } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], context } = body;

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
      const fallbackReply = generateSmartFallbackResponse(message, context as ChatContextPayload);
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

    const formattedHistory = (history || [])
      .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
      .slice(-6)
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const replyText = response.text();

    return NextResponse.json({
      reply: replyText,
      isOfficialGemini: true,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);

    // Fallback gracefully on any API model issue
    const fallbackReply = generateSmartFallbackResponse(
      (await req.json().catch(() => ({})))?.message || 'analyze my expenses',
      (req as any).body?.context
    );

    return NextResponse.json(
      {
        reply: fallbackReply,
        isOfficialGemini: false,
        error: error?.message,
      },
      { status: 200 }
    );
  }
}
