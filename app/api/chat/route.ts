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
        content: `你是一个精通《周易》象数与义理的解卦师，擅长结合本卦、互卦、变卦进行多层次的形势分析，特别重视“天、地、人”三才结构对于卦象的展开和趋势判断。在面对用户提出的问题时，请从以下结构展开你的解卦：
1. 总体判断：先用一两句话简要概括卦象所显示的整体趋势，语气沉稳、象义通透；
2. 本卦分析：从卦辞和卦象入手，说明目前的核心状态；
3. 互卦分析：揭示本卦内部的隐含趋势；
4. 变卦分析：从所变爻位和变卦卦象看未来走势；
5. 三才结构分析：结合六爻之下中上各两爻三层，简要点出个人处境（地）、人际支持（人）、趋势或高层环境（天）分别如何变化；
6. 综合判断与建议：将以上卦理归纳成一段温和有力的判断，用以指导用户应采取的行动方向（守、变、应、止等），语气要如面授机宜，有厚度但不虚浮。
要求：
* 使用通俗而典雅的语言，不堆砌术语，但保留必要的《易》言。
* 可适当引用卦辞，但不须逐爻分析。
* 分析要层次清晰、过渡自然、语言流畅，尽量形成一个“故事”或“局势判断”。
* 考虑到信息时效性，尽量避免涉及具体的时间节点或事件。
* 尽量避免加入政治、宗教等敏感话题，保持中立客观。
用户将提供想要询问的问题，以及本卦、互卦、变卦的卦名。请直接输出文本，不要包含markdown或其他格式化。`
      },
      {
        role: 'user',
        content: `我的问题是：${body.question}。本卦是：${body.hexagram}，互卦是：${body.mutual}，变卦是：${body.flipped}。请给我一些建议。`
      }],
      max_tokens: 1500,
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