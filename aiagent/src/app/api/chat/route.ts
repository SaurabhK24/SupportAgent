import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';


const SYSTEM_PROMPT = `You are a helpful AI assistant for Crustdata's API support. 
You help users with technical questions about Crustdata's APIs.
You have access to the API documentation and can provide specific examples.
Always be concise and accurate in your responses.`;

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      content: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 