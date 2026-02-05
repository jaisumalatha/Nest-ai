import { convertToModelMessages, streamText, UIMessage } from "ai";
import { azure } from "@ai-sdk/azure";
 
export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  try {
    const result = streamText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"),
      messages: convertToModelMessages(messages),
    });
 
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response("Failed to stream connection", { status: 500 });
  }
}