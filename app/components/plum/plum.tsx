import Hexagram from '../hexagram/hexagram'

interface PlumProps {
  hexagram: string
  hexagramName: string | undefined
  mutual: string
  mutualName: string | undefined
  flipped: string
  flippedName: string | undefined
  flipId: number
}

const Plum = (plum: PlumProps) => {
  return (
    <div className="plum-container">
      <h2>Plum Blossom Hexagram</h2>
      <div className="hexagrams">
        <Hexagram 
          name={plum.hexagramName} 
          sequence={plum.hexagram} 
        />
        <Hexagram 
          name={plum.mutualName} 
          sequence={plum.mutual} 
        />
        <Hexagram 
          name={plum.flippedName} 
          sequence={plum.flipped} 
        />
      </div>
    </div>
  )
}

export default Plum
