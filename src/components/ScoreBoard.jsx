import styles from './ScoreBoard.module.css';

function ScoreBoard({ score, total }) {
  return (
    <div className={styles.scoreboard}>
      <div className={styles.score}>
        <span className={styles.scoreValue}>{score}<span>/{total}</span></span>
        <span className={styles.scoreLabel}>correct answers</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.statIcon} aria-hidden="true">⚡</span>
        <span className={styles.statValue}>Nice work!</span>
        <span className={styles.scoreLabel}>keep that curiosity</span>
      </div>
    </div>
  );
}

export default ScoreBoard;
