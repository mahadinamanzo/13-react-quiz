import styles from './Timer.module.css';

function Timer({ seconds }) {
  return (
    <div className={styles.timer} aria-label={`${seconds} seconds remaining`}>
      <span className={styles.clock} aria-hidden="true">◷</span>
      <span>00:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}

export default Timer;
