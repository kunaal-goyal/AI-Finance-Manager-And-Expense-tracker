import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import {
  buildSystemPrompt,
  generateSmartFallbackResponse,
  normalizeCategory,
  normalizePaymentMethod,
  ChatContextPayload,
} from '@/lib/gemini';

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

// Transaction management tools definition for Google Gemini
const transactionTools = [
  {
    name: 'add_transaction',
    description: 'Add a new financial transaction (expense or income) to the student ledger when they ask to log or add spending/earnings.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'Short and clear title e.g. College Canteen Lunch, Metro Recharge, Pizza with Friends, Freelance Web Design',
        },
        amount: {
          type: SchemaType.NUMBER,
          description: 'Positive numerical amount in user currency e.g. 150, 2500',
        },
        type: {
          type: SchemaType.STRING,
          enum: ['expense', 'income'],
          description: 'Whether this transaction is an expense or income',
        },
        category: {
          type: SchemaType.STRING,
          description:
            'Expense category (Food and Dining, Transportation, Accommodation and Hostel, Education and Stationery, Shopping, Entertainment, Healthcare, Subscriptions, Personal Care, Other) or Income category (Monthly Allowance, Part-time Job, Freelancing, Scholarship, Gifts, Other Income)',
        },
        paymentMethod: {
          type: SchemaType.STRING,
          enum: ['UPI', 'Cash', 'Card', 'Net Banking', 'Other'],
          description: 'Method of payment used',
        },
        date: {
          type: SchemaType.STRING,
          description: 'Date in YYYY-MM-DD format. Use today if not specified.',
        },
        description: {
          type: SchemaType.STRING,
          description: 'Optional additional details or context',
        },
      },
      required: ['title', 'amount', 'type', 'category'],
    },
  },
  {
    name: 'delete_transaction',
    description: 'Delete an existing transaction from the student records using its exact ID from the recent transactions list.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        transactionId: {
          type: SchemaType.STRING,
          description: 'The exact ID of the transaction to delete (from the RECENT RECORDED TRANSACTIONS list)',
        },
        title: {
          type: SchemaType.STRING,
          description: 'Title of the transaction being removed',
        },
      },
      required: ['transactionId'],
    },
  },
];

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

    // Call official Google Gemini API with gemini-3.5-flash-lite and transaction skills
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = buildSystemPrompt(context as ChatContextPayload);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: transactionTools as any }],
    });

    const formattedHistory = sanitizeHistoryForGemini(history);

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.6,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const functionCalls = response.functionCalls();

    const sym = context.userProfile?.currencySymbol || '₹';

    // Check if Gemini invoked a tool skill
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const args: any = call.args || {};

      if (call.name === 'add_transaction') {
        const type: 'expense' | 'income' = args.type === 'income' ? 'income' : 'expense';
        const amount = Math.abs(Number(args.amount)) || 0;
        const category = normalizeCategory(args.category, type);
        const paymentMethod = normalizePaymentMethod(args.paymentMethod);
        const title = args.title || (type === 'income' ? 'Income' : 'Expense');
        const todayStr = new Date().toISOString().split('T')[0];
        const date = args.date && /^\d{4}-\d{2}-\d{2}$/.test(args.date) ? args.date : todayStr;
        const description = args.description || `Added via SpendWise AI Assistant (${paymentMethod})`;

        const actionData = {
          title,
          amount,
          type,
          category,
          paymentMethod,
          date,
          description,
        };

        const reply = type === 'expense'
          ? `### ✅ Expense Recorded!\n\n` +
            `I've logged **${title}** (**${sym}${amount.toLocaleString()}**) under **${category}** paid via **${paymentMethod}**.\n\n` +
            `* **Date:** ${date}\n` +
            `* **Status:** Added to your ledger\n\n` +
            `Your balance, remaining budget, and spending analytics have been updated automatically!`
          : `### 💰 Income Added!\n\n` +
            `I've logged **${title}** (**${sym}${amount.toLocaleString()}**) under **${category}** received via **${paymentMethod}**.\n\n` +
            `* **Date:** ${date}\n` +
            `* **Status:** Added to your ledger\n\n` +
            `Your available balance and savings rate have been refreshed!`;

        return NextResponse.json({
          reply,
          action: {
            type: 'ADD_TRANSACTION',
            data: actionData,
          },
          isOfficialGemini: true,
        });
      }

      if (call.name === 'delete_transaction') {
        const transactionId = args.transactionId;
        const title = args.title || 'Transaction';

        return NextResponse.json({
          reply: `### 🗑️ Transaction Deleted\n\n` +
            `I've removed **${title}** (ID: \`${transactionId}\`) from your records.\n\n` +
            `Your budget limits, spending totals, and charts have all been recalculated.`,
          action: {
            type: 'DELETE_TRANSACTION',
            data: {
              transactionId,
              title,
            },
          },
          isOfficialGemini: true,
        });
      }
    }

    // Standard natural language conversational answer
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
