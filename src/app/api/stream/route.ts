import { streamText,UIMessage,convertToModelMessages } from "ai";
import { azure } from "@ai-sdk/azure";
 
export async function POST(request: Request) {
  const { prompt } = await request.json();

  //const{messages}: {messages:UIMessage[]}= await request.json();
  try {
    const result = streamText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"),
      prompt: prompt,
      system:"You are a helpful AI assistant that provides detailed and informative responses to user queries.",
     // messages: convertToModelMessages(messages),
     temperature: 0.7,
    });
    result.usage.then((usage)=> {
      console.log("Input tokens:", usage.inputTokens);
      console.log("Output tokens:", usage.outputTokens);
      console.log("Total tokens:", usage.totalTokens);
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json({ error: "Error generating text" }, { status: 500 });
  }
}