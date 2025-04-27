import Hexagram from '../hexagram/hexagram'
import styles from './plum.module.scss'

interface PlumProps {
  hexagram: string
  hexagramName: string | undefined
  hexagramTuanci: string | undefined
  mutual: string
  mutualName: string | undefined
  mutualTuanci: string | undefined
  flipped: string
  flippedName: string | undefined
  flippedTuanci: string | undefined
  flipId: number
}

const Plum = (plum: PlumProps) => {
  return (
    <div className={styles['plum-container']}>
      <h2>Plum Blossom Hexagram</h2>
      <div className={styles.hexagrams}>
        <div className={styles['hexagram-container']}>
          <Hexagram
            name={plum.hexagramName}
            sequence={plum.hexagram}
          />
          <p>{plum.hexagramTuanci}</p>
        </div>
        <div className={styles['hexagram-container']}>
          <Hexagram
            name={plum.mutualName}
            sequence={plum.mutual}
          />
          <p>{plum.mutualTuanci}</p>
        </div>
        <div className={styles['hexagram-container']}>
          <Hexagram
            name={plum.flippedName}
            sequence={plum.flipped}
          />
          <p>{plum.flippedTuanci}</p>
        </div>
      </div>
    </div>
  )
}

export default Plum
