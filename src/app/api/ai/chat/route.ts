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
      // Return smart simulated response based on real student financial context
      const fallbackReply = generateSmartFallbackResponse(message, context as ChatContextPayload);
      return NextResponse.json({
        reply: fallbackReply,
        isOfficialGemini: false,
        notice: 'Tip: Add your Google Gemini API key to .env.local to enable live model reasoning!',
      });
    }

    // Call official Google Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = buildSystemPrompt(context as ChatContextPayload);

    // Use gemini-1.5-flash for high speed and accurate financial analysis
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    // Format chat history for Gemini SDK
    // Gemini SDK expects { role: 'user' | 'model', parts: [{ text: string }] }
    const formattedHistory = (history || [])
      .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
      .slice(-8) // keep recent turns
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

    // Provide friendly student-appropriate fallback on API or rate limit errors
    const errorMessage = error?.message || '';
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('key not valid')) {
      return NextResponse.json(
        {
          error: 'Your Google Gemini API key appears invalid. Please check .env.local or AI Studio.',
          fallbackReply: generateSmartFallbackResponse(
            'analyze my expenses',
            (req as any).body?.context
          ),
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to process AI response. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
