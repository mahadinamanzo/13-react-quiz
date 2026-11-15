import styles from './StartScreen.module.css';

function StartScreen({ onStart }) {
  return (
    <section className={styles.layout}>
      <div className={styles.intro}>
        <div className={styles.eyebrow}><span aria-hidden="true">✦</span> YOUR DAILY DOSE OF “DID YOU KNOW?”</div>
        <h1>Ready to give<br />your brain a <span>little play?</span></h1>
        <p>Pick a topic, trust your gut, and see what you know. No pressure—just a few fun minutes.</p>
        <div className={styles.sparkle} aria-hidden="true">✳</div>
      </div>

      <form className={styles.card} onSubmit={(event) => { event.preventDefault(); onStart(); }}>
        <div className={styles.cardHeading}>
          <div>
            <h2>Set up your quiz</h2>
            <p>Make it your kind of challenge.</p>
          </div>
          <span className={styles.cardIcon} aria-hidden="true">☻</span>
        </div>

        <label className={styles.field}>
          <span>Choose a category</span>
          <select defaultValue="general">
            <option value="general">🌈  General knowledge</option>
            <option value="science">🔬  Science & nature</option>
            <option value="history">🏛️  History</option>
            <option value="arts">🎨  Arts & culture</option>
          </select>
        </label>

        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>Difficulty</span>
            <select defaultValue="easy">
              <option value="easy">Easy breezy</option>
              <option value="medium">A bit tricky</option>
              <option value="hard">Brain bender</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>Questions</span>
            <select defaultValue="5">
              <option value="5">5 questions</option>
              <option value="10">10 questions</option>
              <option value="15">15 questions</option>
            </select>
          </label>
        </div>

        <button className={styles.startButton} type="submit">
          Let’s play <span aria-hidden="true">→</span>
        </button>
        <div className={styles.cardFoot}><span aria-hidden="true">◷</span> Takes about 2 minutes</div>
      </form>
    </section>
  );
}

export default StartScreen;
