import { useEffect, useReducer } from 'react';
import { questions } from '../data/questions.js';
import { initialQuizState, quizReducer } from '../reducers/quizReducer.js';
import StartScreen from './StartScreen.jsx';
import Question from './Question.jsx';
import ProgressBar from './ProgressBar.jsx';
import Timer from './Timer.jsx';
import ResultScreen from './ResultScreen.jsx';
import styles from './App.module.css';

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const { status, questions: quizQuestions, index, answer, points, secondsRemaining, highscore } = state;
  const currentQuestion = quizQuestions[index];
  const totalQuestions = quizQuestions.length;

  useEffect(() => {
    if (status === 'ready') dispatch({ type: 'start' });
  }, [status]);

  useEffect(() => {
    if (status !== 'active') return undefined;

    const timerId = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(timerId);
  }, [status]);

  function handleStart() {
    dispatch({ type: 'start' });
    dispatch({ type: 'dataReceived', questions });
  }

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#"
          onClick={(event) => {
            event.preventDefault();
            dispatch({ type: 'restart' });
          }}
          aria-label="Quizzy home"
        >
          <span className={styles.brandMark} aria-hidden="true">q</span>
          <span>quizzy<span className={styles.brandDot}>.</span></span>
        </a>
        <span className={styles.headerNote}>A little brain boost</span>
      </header>

      {status === 'idle' && <StartScreen onStart={handleStart} />}

      {(status === 'loading' || status === 'ready') && (
        <section className={styles.quizScreen} aria-live="polite">
          <p>Getting your quiz ready…</p>
        </section>
      )}

      {status === 'error' && (
        <section className={styles.quizScreen} role="alert">
          <h1>We couldn’t load your quiz.</h1>
          <p>Please try again.</p>
          <button className={styles.nextButton} onClick={() => dispatch({ type: 'restart' })}>
            Back to start
          </button>
        </section>
      )}

      {status === 'active' && currentQuestion && (
        <section className={styles.quizScreen} aria-label="Quiz question">
          <div className={styles.quizMeta}>
            <span className={styles.categoryPill}>{currentQuestion.category}</span>
            <Timer seconds={secondsRemaining} />
          </div>
          <ProgressBar current={index + 1} total={totalQuestions} />
          <Question
            question={currentQuestion}
            questionNumber={index + 1}
            total={totalQuestions}
            answer={answer}
            onAnswer={(selectedAnswer) => dispatch({ type: 'newAnswer', answer: selectedAnswer })}
          />
          <div className={styles.quizFooter}>
            <span className={styles.footerHint}>
              {answer === null
                ? 'Choose the best answer'
                : answer === currentQuestion.answer
                  ? 'That’s right!'
                  : `Not quite — the answer is ${currentQuestion.answer}.`}
            </span>
            {answer !== null && (
              <button
                className={styles.nextButton}
                onClick={() => dispatch({
                  type: index === totalQuestions - 1 ? 'finish' : 'nextQuestion',
                })}
              >
                {index === totalQuestions - 1 ? 'See results' : 'Next question'}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </section>
      )}

      {status === 'finished' && (
        <ResultScreen
          score={points}
          total={totalQuestions}
          highscore={highscore}
          onPlayAgain={() => dispatch({ type: 'restart' })}
        />
      )}

      <footer className={styles.footer}>Made for curious minds <span aria-hidden="true">✦</span></footer>
    </main>
  );
}

export default App;
