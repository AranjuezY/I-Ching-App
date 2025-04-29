'use client'

import { useState } from 'react'
import { HexagramName } from '../../types/hexagrams'
import styles from './hexagramPanel.module.scss'

interface HexagramPanelProps {
  allHexagrams: HexagramName[]
  onHexagramClick: (id: number) => void
}

export default function HexagramPanel({ allHexagrams, onHexagramClick }: HexagramPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Split hexagrams into two rows of 32 each
  const firstRow = allHexagrams.slice(0, 32)
  const secondRow = allHexagrams.slice(32)

  return (
    <div className={styles['hexagram-panel']}>
      <button 
        className={styles['dropdown-toggle']}
        onClick={() => setIsOpen(!isOpen)}
      >
        Hexagrams
      </button>
      <div className={`${styles['hexagram-row']} ${isOpen ? styles['mobile-visible'] : ''}`}>
        {firstRow.map(h => (
          <a 
            key={h.id} 
            href={`#${h.id}`} 
            className={styles['hexagram-link']}
            onClick={(e) => {
              e.preventDefault()
              onHexagramClick(h.id)
            }}
          >
            {h.name}
          </a>
        ))}
      </div>
      <div className={`${styles['hexagram-row']} ${isOpen ? styles['mobile-visible'] : ''}`}>
        {secondRow.map(h => (
          <a 
            key={h.id} 
            href={`#${h.id}`} 
            className={styles['hexagram-link']}
            onClick={(e) => {
              e.preventDefault()
              onHexagramClick(h.id)
            }}
          >
            {h.name}
          </a>
        ))}
      </div>
    </div>
  )
}
