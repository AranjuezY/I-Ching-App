interface HexagramProps {
  name: string
  sequence: string
}

const Hexagram = (hexagram: HexagramProps) => {
  return (
    <div className="hexagram">
      <div className="sequence-diagram">
        {hexagram.sequence.split('').map((line, i) => (
          <div key={i} className={`line ${line === '1' ? 'yang' : 'yin'}`} />
        ))}
      </div>
      <h3>{hexagram.name}</h3>
    </div>
  )
}

export default Hexagram
