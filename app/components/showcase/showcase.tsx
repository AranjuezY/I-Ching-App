import { HexagramData } from '../../types/hexagrams'
import Hexagram from '../hexagram/hexagram'
import HexagramText from '../hexagramtext/hexagramtext'
import styles from './showcase.module.scss'

interface HexagramProps {
  hexagram: HexagramData
}

const ShowCase = ({ hexagram }: HexagramProps) => {
  const renderRelatedHexagram = (hex: {name: string, sequence: string} | null, label: string) => {
    if (!hex) return null
    return (
      <div className={styles['related-hexagram']}>
        <h3>{ label }</h3>
        <Hexagram name={hex.name} sequence={hex.sequence} />
      </div>
    )
  }

  return (
    <div className={styles['hexagram-container']}>
      {/* Main Hexagram */}
      <Hexagram name={hexagram.name} sequence={hexagram.sequence} />

      {/* Text Content */}
      <HexagramText guaci={hexagram.guaci} hexagramName={hexagram.name} />

      {/* Related Hexagrams */}
      <div className={styles['related-hexagrams']}>
        {renderRelatedHexagram(hexagram.relations.mutual, "互掛 | Mutual")}
        {renderRelatedHexagram(hexagram.relations.reverse, "錯掛 | Inverse")}
        {renderRelatedHexagram(hexagram.relations.inverse, "綜掛 | Reverse")}
      </div>
    </div>
  )
}

export default ShowCase
