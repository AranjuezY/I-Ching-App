'use client'

import { HexagramName } from '../../types/hexagrams'
import styles from './hexagram-panel.module.scss'

interface HexagramPanelProps {
  allHexagrams: HexagramName[]
  onHexagramClick: (id: number) => void
}

export default function HexagramPanel({ allHexagrams, onHexagramClick }: HexagramPanelProps) {
  // Split hexagrams into two rows of 32 each
  const firstRow = allHexagrams.slice(0, 32)
  const secondRow = allHexagrams.slice(32)

  return (
    <div className={styles['hexagram-panel']}>
      <div className={styles['hexagram-row']}>
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
      <div className={styles['hexagram-row']}>
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
