import openai from "@/lib/openai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  console.log('Received messages:', body);

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: `你是一个国学和易经大师，擅长梅花易数占筮。请根据用户提供的卦象和爻辞进行解读，并给出相应的建议。请直接输出文本，不要包含markdown或其他格式化。`
      },
      {
        role: 'user',
        content: `我的问题是：${body.question}。卦象是：${body.hexagram}，互卦是：${body.mutual}，变卦是：${body.flipped}。请给我一些建议。`
      }],
      max_tokens: 800,
      stream: true // Enable streaming
    });

    // Convert the async iterator into a ReadableStream
    const readableStream = new ReadableStream({
      async pull(controller) {
        for await (const chunk of stream) {
          if (chunk.choices[0]?.delta?.content) {
            controller.enqueue(chunk.choices[0].delta.content);
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readableStream);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}