'use client'

import { useEffect, useState } from 'react'
import { HexagramData, HexagramName } from './types/hexagrams'
import ShowCase from './components/showcase/showcase'
import HexagramPanel from './components/hexagramPanel/hexagramPanel'
import styles from './page.module.scss'
import Link from 'next/link'

export default function Page() {
  const [hexagram, setHexagram] = useState<HexagramData | null>(null)
  const [allHexagrams, setAllHexagrams] = useState<HexagramName[]>([])
  const [loading, setLoading] = useState(true)
  const [namesLoading, setNamesLoading] = useState(true)

  useEffect(() => {
    const fetchHexagrams = async () => {
      try {
        // Fetch all hexagram names first
        const namesResponse = await fetch('/api/hexagrams')
        const namesData = await namesResponse.json()
        setAllHexagrams(namesData)
        setNamesLoading(false)

        // Then fetch the default hexagram (ID 1)
        const hexResponse = await fetch('/api/hexagrams/1')
        const hexData = await hexResponse.json()
        setHexagram(hexData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHexagrams()
  }, [])

  if (loading || namesLoading) return <div>Loading...</div>
  if (!hexagram) return <div>No data found</div>

  const handleHexagramClick = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hexagrams/${id}`);
      const data = await response.json();
      setHexagram(data);
    } catch (error) {
      console.error('Error fetching hexagram:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <HexagramPanel 
        allHexagrams={allHexagrams} 
        onHexagramClick={handleHexagramClick} 
      />
      <Link href="/plum" className={styles.plum}>
        梅花易数 | Plum Blossom Numerology
      </Link>
      <ShowCase hexagram={hexagram} />
    </div>
  )
}
