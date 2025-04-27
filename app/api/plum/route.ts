import { plumGenerator } from '@/lib/utils/plum';
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

export async function GET() {
  const { hexagram, mutual, flipped, flipId } = plumGenerator();
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
    flipId: flipId
  });
}
