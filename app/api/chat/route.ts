import openai from "@/lib/openai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  console.log('Received messages:', body);

  try {
    // Request the OpenAI API for the response based on the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: `你是一个国学和易经大师，擅长梅花易数占筮。请根据用户提供的卦象和爻辞进行解读，并给出相应的建议。`
      },
      {
        role: 'user',
        content: `我的问题是：${body.question}。卦象是：${body.hexagram}，互卦是：${body.mutual}，变卦是：${body.flipped}。请给我一些建议。`
      }],
      max_tokens: 800
    });

    return NextResponse.json({
      response: response.choices[0].message.content,
      usage: response.usage,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
