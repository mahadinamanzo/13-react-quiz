import ScoreBoard from './ScoreBoard.jsx';
import styles from './ResultScreen.module.css';

function ResultScreen({ score, total, highscore, onPlayAgain }) {
  return (
    <section className={styles.card}>
      <div className={styles.confetti} aria-hidden="true">✦</div>
      <div className={styles.badge} aria-hidden="true">🎉</div>
      <p className={styles.eyebrow}>QUIZ COMPLETE</p>
      <h1>Look at that <span>bright mind!</span></h1>
      <p className={styles.message}>You showed up, gave it a go, and learned something along the way. That’s a win.</p>
      <ScoreBoard score={score} total={total} highscore={highscore} />
      <button className={styles.button} onClick={onPlayAgain}>
        Play again <span aria-hidden="true">↻</span>
      </button>
    </section>
  );
}

export default ResultScreen;
