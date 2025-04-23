import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const hexagrams = await prisma.hexagrams.findMany({
    select: {
      id: true,
      hexagram_name: true,
      hexagram_sequence: true
    },
    orderBy: {
      id: 'asc'
    }
  })

  // Format the response as simple {id, name, sequence} objects
  const response = hexagrams.map(h => ({
    id: h.id,
    name: h.hexagram_name,
    sequence: h.hexagram_sequence
  }))

  return NextResponse.json(response)
}
