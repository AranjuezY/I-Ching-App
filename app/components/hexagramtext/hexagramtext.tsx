interface HexagramTextProps {
    hexagramName: string
    guaci: Array<{ source: string; content: string; translation: string }>
}

const HexagramText = (text: HexagramTextProps) => {
    return (
        <div className="hexagram-text">
            <h3>卦辭</h3>
            {text.guaci.map((gua, i) => {
                if (gua.source === "经文") {
                    return (
                        <div key={i}>
                            <p>{gua.content}</p>
                            <p>{gua.translation}</p>
                        </div>
                    )
                }
            })}
            <h3>彖辭</h3>
            {text.guaci.map((gua, i) => {
              if (gua.source === "彖傳") {
                return (
                  <div key={i}>
                    <p>{ gua.content }</p>
                    <p>{ gua.translation }</p>
                  </div>
                )
              }
            })}
        </div>
    )
}

export default HexagramText
