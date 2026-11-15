import { useEffect, useReducer, useState } from 'react';
import { fetchCategories, fetchQuestions } from '../api/opentdb.js';
import { initialQuizState, quizReducer } from '../reducers/quizReducer.js';
import StartScreen from './StartScreen.jsx';
import Question from './Question.jsx';
import ProgressBar from './ProgressBar.jsx';
import Timer from './Timer.jsx';
import ResultScreen from './ResultScreen.jsx';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import styles from './App.module.css';

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const {
    status,
    questions: quizQuestions,
    index,
    answer,
    points,
    secondsRemaining,
    highscore,
    requestOptions,
    errorMessage,
  } = state;
  const currentQuestion = quizQuestions[index];
  const totalQuestions = quizQuestions.length;
  const [categoryState, setCategoryState] = useState({
    status: 'loading',
    categories: [],
    error: null,
  });
  const [categoryRetry, setCategoryRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCategoryState({ status: 'loading', categories: [], error: null });

    fetchCategories(controller.signal)
      .then((categories) => {
        setCategoryState({ status: 'ready', categories, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setCategoryState({
          status: 'error',
          categories: [],
          error: error instanceof Error ? error.message : 'Could not load quiz categories.',
        });
      });

    return () => controller.abort();
  }, [categoryRetry]);

  useEffect(() => {
    if (status !== 'loading' || !requestOptions) return undefined;

    const controller = new AbortController();
    async function loadQuestions() {
      try {
        const receivedQuestions = await fetchQuestions(requestOptions, controller.signal);
        dispatch({ type: 'dataReceived', questions: receivedQuestions });
      } catch (error) {
        if (controller.signal.aborted) return;
        dispatch({
          type: 'dataFailed',
          message: error instanceof Error ? error.message : 'Could not load quiz questions.',
        });
      }
    }

    loadQuestions();
    return () => controller.abort();
  }, [status, requestOptions]);

  useEffect(() => {
    if (status === 'ready') dispatch({ type: 'start' });
  }, [status]);

  useEffect(() => {
    if (status !== 'active') return undefined;

    const timerId = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(timerId);
  }, [status, index]);

  function handleStart(options) {
    dispatch({ type: 'start', options });
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

      {status === 'idle' && (
        <StartScreen
          onStart={handleStart}
          categories={categoryState.categories}
          categoriesStatus={categoryState.status}
          categoriesError={categoryState.error}
          onRetryCategories={() => setCategoryRetry((attempt) => attempt + 1)}
        />
      )}

      {(status === 'loading' || status === 'ready') && (
        <section className={styles.quizScreen} aria-live="polite">
          <Loading message="Loading your questions…" />
        </section>
      )}

      {status === 'error' && (
        <section className={styles.quizScreen} role="alert">
          <ErrorMessage
            message={errorMessage ?? 'We couldn’t load your quiz. Please try again.'}
            actionLabel="Back to setup"
            onRetry={() => dispatch({ type: 'restart' })}
          />
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
