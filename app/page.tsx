'use client'

import { useEffect, useState } from 'react'
import { HexagramData } from './types/hexagrams'
import ShowCase from './components/showcase'

export default function Page() {
  const [hexagram, setHexagram] = useState<HexagramData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/hexagrams/1')
        const data = await response.json()
        console.log(data)
        setHexagram(data)
      } catch (error) {
        console.error('Error fetching hexagram:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!hexagram) return <div>No hexagram data found</div>

  return (
    ShowCase({ hexagram })
  )
}
