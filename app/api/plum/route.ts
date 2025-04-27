import prisma from '@/lib/prisma';

async function getHexagramName(hexagram: string) {
  const result = await prisma.hexagrams.findFirst({
    where: {
      hexagram_sequence: hexagram
    },
    select: {
      hexagram_name: true
    }
  });
  return result?.hexagram_name;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hexagram = [searchParams.get('hexagram') || ''];
  const mutual = [searchParams.get('mutual') || ''];
  const flipped = [searchParams.get('flipped') || ''];
  
  const hexagramName = await getHexagramName(hexagram[0]);
  const mutualName = await getHexagramName(mutual[0]);
  const flippedName = await getHexagramName(flipped[0]);

  return Response.json({
    hexagram: hexagram[0],
    hexagramName: hexagramName,
    mutual: mutual[0],
    mutualName: mutualName,
    flipped: flipped[0],
    flippedName: flippedName,
  });
}
