import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  
  const hexagram = await prisma.hexagrams.findUnique({
    where: { id },
    include: {
      hexagram_relations_hexagram_relations_hexagram_idTohexagrams: {
        include: {
          hexagrams_hexagram_relations_mutual_idTohexagrams: true,
          hexagrams_hexagram_relations_opposite_idTohexagrams: true,
          hexagrams_hexagram_relations_inverted_idTohexagrams: true
        }
      },
      yaos: {
        include: {
          text_yao_links: {
            include: {
              texts: true
            }
          }
        },
        orderBy: {
          position: 'asc'
        }
      },
      text_hexagram_links: {
        include: {
          texts: true
        }
      }
    }
  })

  if (!hexagram) {
    return NextResponse.json({ error: 'Hexagram not found' }, { status: 404 })
  }

  const relation_row = hexagram.hexagram_relations_hexagram_relations_hexagram_idTohexagrams

  const relations = {
    mutual: relation_row?.hexagrams_hexagram_relations_mutual_idTohexagrams ? {
      name: relation_row.hexagrams_hexagram_relations_mutual_idTohexagrams.hexagram_name,
      sequence: relation_row.hexagrams_hexagram_relations_mutual_idTohexagrams.hexagram_sequence
    } : null,
    reverse: relation_row?.hexagrams_hexagram_relations_opposite_idTohexagrams ? {
      name: relation_row.hexagrams_hexagram_relations_opposite_idTohexagrams.hexagram_name,
      sequence: relation_row.hexagrams_hexagram_relations_opposite_idTohexagrams.hexagram_sequence
    } : null,
    inverse: relation_row?.hexagrams_hexagram_relations_inverted_idTohexagrams ? {
      name: relation_row.hexagrams_hexagram_relations_inverted_idTohexagrams.hexagram_name,
      sequence: relation_row.hexagrams_hexagram_relations_inverted_idTohexagrams.hexagram_sequence
    } : null
  }

  const guaci = hexagram.text_hexagram_links.map(link => ({
    source: link.texts.source,
    content: link.texts.content,
    translation: link.texts.translation
  }))

  return NextResponse.json({
    name: hexagram.hexagram_name,
    sequence: hexagram.hexagram_sequence,
    guaci,
    relations
  })
}
