import styles from './hexagram.module.scss';

interface HexagramProps {
  name: string;
  sequence: string;
}

const Hexagram = (hexagram: HexagramProps) => {
  return (
    <div className={styles.hexagram}>
      <div className={styles['sequence-diagram']}> {/* Access class names as properties */}
        {hexagram.sequence.split('').map((line, i) => (
          <div key={i} className={`${styles.line} ${line === '1' ? styles.yang : styles.yin}`} />
        ))}
      </div>
      <h3>{hexagram.name}</h3>
    </div>
  );
};

export default Hexagram;