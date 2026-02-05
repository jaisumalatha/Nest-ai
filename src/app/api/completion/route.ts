import { generateText } from 'ai';
import { azure } from '@ai-sdk/azure';

export async function POST(request: Request) {
  try {
    let prompt: string | undefined;

    // Try to parse JSON body safely
    try {
      const body = await request.json();
      prompt = body?.prompt;
    } catch {
      // Ignore JSON parse errors — may be using query params instead
    }

    // If prompt not found in body, look in query string
    if (!prompt) {
      const { searchParams } = new URL(request.url);
      prompt = searchParams.get('prompt') || '';
    }

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const { text } = await generateText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o'),
      prompt,
    });

    return Response.json({ text });
  } catch (error) {
    console.error('Error in /api/completion:', error);
    return Response.json({ error: 'Error generating text' }, { status: 500 });
  }
}
