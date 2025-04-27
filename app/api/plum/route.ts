import prisma from '@/lib/prisma';

async function getHexagramNameAndId(hexagram: string): Promise<{hexagram_name: string | null; id: number | null}> {
  const result = await prisma.hexagrams.findFirst({
    where: {
      hexagram_sequence: hexagram
    },
    select: {
      hexagram_name: true,
      id: true
    }
  });
  return result;
}

async function getHexagramTuanci(hexagramId: number) {
  const result = await prisma.texts.findFirst({
    where: {
      source: '彖傳',
      text_hexagram_links: {
        some: {
          hexagram_id: hexagramId
        }
      }
    },
    select: {
      content: true
    }
  });
  console.log(`id: ${hexagramId}; tuanci: ${result}`)
  return result?.content || null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hexagramSequence = searchParams.get('hexagram') || '';
  const mutualSequence = searchParams.get('mutual') || '';
  const flippedSequence = searchParams.get('flipped') || '';

  async function fetchHexagramData(sequence: string): Promise<{ name: string | null; tuanci: string | null } | null> {
    const hexagramInfo = await getHexagramNameAndId(sequence);
    if (!hexagramInfo) {
      return null;
    }
    const tuanci = await getHexagramTuanci(hexagramInfo.id as number);
    return { name: hexagramInfo.hexagram_name, tuanci };
  }

  const [hexagramData, mutualData, flippedData] = await Promise.all([
    fetchHexagramData(hexagramSequence),
    fetchHexagramData(mutualSequence),
    fetchHexagramData(flippedSequence),
  ]);

  if (!hexagramData) {
    return Response.json({ error: `Hexagram with sequence '${hexagramSequence}' not found` }, { status: 404 });
  }

  return Response.json({
    hexagram: hexagramSequence,
    hexagramName: hexagramData.name,
    hexagramTuanci: hexagramData.tuanci,
    mutual: mutualSequence,
    mutualName: mutualData?.name || null,
    mutualTuanci: mutualData?.tuanci || null,
    flipped: flippedSequence,
    flippedName: flippedData?.name || null,
    flippedTuanci: flippedData?.tuanci || null,
  });
}
