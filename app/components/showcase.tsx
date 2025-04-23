import { HexagramData } from '../types/hexagrams'
import Hexagram from './hexagram'
import HexagramText from './hexagramtext'

interface HexagramProps {
  hexagram: HexagramData
}

const ShowCase = ({ hexagram }: HexagramProps) => {
  const renderRelatedHexagram = (hex: {name: string, sequence: string} | null, label: string) => {
    if (!hex) return null
    return (
      <div className="related-hexagram">
        <h3>{ label }</h3>
        <Hexagram name={hex.name} sequence={hex.sequence} />
      </div>
    )
  }

  return (
    <div className="hexagram-container">
      {/* Main Hexagram */}
      <Hexagram name={hexagram.name} sequence={hexagram.sequence} />

      {/* Text Content */}
      <HexagramText guaci={hexagram.guaci} yaoci={hexagram.yaoci} />

      {/* Related Hexagrams */}
      <div className="related-hexagrams">
        {renderRelatedHexagram(hexagram.relations.mutual, "Mutual Hexagram")}
        {renderRelatedHexagram(hexagram.relations.reverse, "Reverse Hexagram")}
        {renderRelatedHexagram(hexagram.relations.inverse, "Inverse Hexagram")}
      </div>
    </div>
  )
}

export default ShowCase
