// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  console.log('Received messages:', messages);

  // Request the OpenAI API for the response based on the prompt
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });
  console.log('Generated result:', result);
 
  return result.toDataStreamResponse();
}
