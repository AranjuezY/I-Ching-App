export interface HexagramName {
  id: number
  name: string
  sequence: string
}

export interface HexagramData {
  name: string
  sequence: string
  guaci: Array<{ source: string; content: string; translation: string }>
  relations: {
    mutual: { name: string; sequence: string } | null
    reverse: { name: string; sequence: string } | null
    inverse: { name: string; sequence: string } | null
  }
}
