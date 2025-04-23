interface HexagramTextProps {
  guaci: Array<{ source: string; content: string }>
  yaoci: Array<{
    position: number
    texts: Array<{ source: string; content: string }>
  }>
}

const HexagramText = (text: HexagramTextProps) => {
  return (
    <div className="hexagram-text">
    <h3>卦辞</h3>

    <h3>爻辞</h3>
    {text.yaoci.map((yao, i) => (
      <div key={i} className="yao">
        <h4>{yao.position}爻</h4>
        {yao.texts.map((text, j) => (
          <p key={j}>{text.content}</p>
        ))}
      </div>
    ))}
    </div>
  )
}

export default HexagramText
