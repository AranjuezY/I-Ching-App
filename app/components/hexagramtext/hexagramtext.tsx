interface HexagramTextProps {
  hexagramName: string
  guaci: Array<{ source: string; content: string }>
}

const HexagramText = (text: HexagramTextProps) => {
  return (
    <div className="hexagram-text">
      <h3>卦辞</h3>
      {text.guaci.map((gua, i) => (
        <p key={i}>{ gua.content }</p>
      ))}
    </div>
  )
}

export default HexagramText
