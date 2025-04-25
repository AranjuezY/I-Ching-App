interface HexagramTextProps {
  hexagramName: string
  guaci: Array<{ source: string; content: string; translation: string }>
}

const HexagramText = (text: HexagramTextProps) => {
  return (
    <div className="hexagram-text">
      <h3>卦辞</h3>
      {text.guaci.map((gua, i) => (
        <div key={i}>
          <p>{ gua.content }</p>
          <p>{ gua.translation }</p>
        </div>
      ))}
    </div>
  )
}

export default HexagramText
