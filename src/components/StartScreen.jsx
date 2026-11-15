import ErrorMessage from './ErrorMessage.jsx';
import Loading from './Loading.jsx';
import useLocalStorageState from '../hooks/useLocalStorageState.js';
import styles from './StartScreen.module.css';

const initialSettings = {
  categoryId: '9',
  difficulty: 'easy',
  amount: '10',
};

function StartScreen({
  onStart,
  categories,
  categoriesStatus,
  categoriesError,
  onRetryCategories,
}) {
  const [savedSettings, setSavedSettings] = useLocalStorageState(
    'quizzy-last-settings',
    initialSettings,
  );
  const storedSettings = savedSettings && typeof savedSettings === 'object'
    ? savedSettings
    : initialSettings;
  const categoryId = categories.some((category) => category.id === storedSettings.categoryId)
    ? storedSettings.categoryId
    : categories.find((category) => category.id === '9')?.id ?? categories[0]?.id ?? '9';
  const difficulty = ['easy', 'medium', 'hard'].includes(storedSettings.difficulty)
    ? storedSettings.difficulty
    : initialSettings.difficulty;
  const amount = ['5', '10', '15'].includes(String(storedSettings.amount))
    ? String(storedSettings.amount)
    : initialSettings.amount;
  const canStart = categoriesStatus === 'ready' && categories.length > 0;

  function updateSetting(name, value) {
    setSavedSettings((current) => ({
      ...initialSettings,
      ...(current && typeof current === 'object' && !Array.isArray(current) ? current : {}),
      [name]: value,
    }));
  }

  return (
    <section className={styles.layout}>
      <div className={styles.intro}>
        <div className={styles.eyebrow}><span aria-hidden="true">✦</span> YOUR DAILY DOSE OF “DID YOU KNOW?”</div>
        <h1>Ready to give<br />your brain a <span>little play?</span></h1>
        <p>Pick a topic, trust your gut, and see what you know. No pressure—just a few fun minutes.</p>
        <div className={styles.sparkle} aria-hidden="true">✳</div>
      </div>

      <form
        className={styles.card}
        onSubmit={(event) => {
          event.preventDefault();
          const settings = { amount, categoryId, difficulty };
          setSavedSettings(settings);
          onStart(settings);
        }}
      >
        <div className={styles.cardHeading}>
          <div>
            <h2>Set up your quiz</h2>
            <p>Make it your kind of challenge.</p>
          </div>
          <span className={styles.cardIcon} aria-hidden="true">☻</span>
        </div>

        <label className={styles.field}>
          <span>Choose a category</span>
          <select
            value={categoryId}
            onChange={(event) => updateSetting('categoryId', event.target.value)}
            disabled={!canStart}
          >
            {categories.map((category) => (
              <option value={category.id} key={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        {categoriesStatus === 'loading' && (
          <Loading compact message="Loading categories…" />
        )}
        {categoriesStatus === 'error' && (
          <ErrorMessage
            compact
            message={categoriesError}
            actionLabel="Retry categories"
            onRetry={onRetryCategories}
          />
        )}

        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>Difficulty</span>
            <select
              value={difficulty}
              onChange={(event) => updateSetting('difficulty', event.target.value)}
            >
              <option value="easy">Easy breezy</option>
              <option value="medium">A bit tricky</option>
              <option value="hard">Brain bender</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>Questions</span>
            <select value={amount} onChange={(event) => updateSetting('amount', event.target.value)}>
              <option value="5">5 questions</option>
              <option value="10">10 questions</option>
              <option value="15">15 questions</option>
            </select>
          </label>
        </div>

        <button className={styles.startButton} type="submit" disabled={!canStart}>
          Let’s play <span aria-hidden="true">→</span>
        </button>
        <div className={styles.cardFoot}><span aria-hidden="true">◷</span> Takes about 2 minutes</div>
      </form>
    </section>
  );
}

export default StartScreen;
