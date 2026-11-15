import styles from './Question.module.css';

function Question({ question, questionNumber, total }) {
  return (
    <section className={styles.question}>
      <div className={styles.counter}>QUESTION {String(questionNumber).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span></div>
      <h1>{question.prompt}</h1>
      <div className={styles.answers} role="group" aria-label="Answer choices">
        {question.options.map((option, index) => (
          <button className={styles.answer} key={option} type="button">
            <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
            <span>{option}</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Question;
