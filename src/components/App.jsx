import { useState } from 'react';
import { questions } from '../data/questions.js';
import StartScreen from './StartScreen.jsx';
import Question from './Question.jsx';
import ProgressBar from './ProgressBar.jsx';
import Timer from './Timer.jsx';
import ResultScreen from './ResultScreen.jsx';
import styles from './App.module.css';

function App() {
  const [screen, setScreen] = useState('start');
  const currentQuestion = questions[0];

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <a className={styles.brand} href="#" onClick={() => setScreen('start')} aria-label="Quizzy home">
          <span className={styles.brandMark} aria-hidden="true">q</span>
          <span>quizzy<span className={styles.brandDot}>.</span></span>
        </a>
        <span className={styles.headerNote}>A little brain boost</span>
      </header>

      {screen === 'start' && <StartScreen onStart={() => setScreen('quiz')} />}

      {screen === 'quiz' && (
        <section className={styles.quizScreen} aria-label="Quiz question">
          <div className={styles.quizMeta}>
            <span className={styles.categoryPill}>{currentQuestion.category}</span>
            <Timer seconds={15} />
          </div>
          <ProgressBar current={1} total={questions.length} />
          <Question question={currentQuestion} questionNumber={1} total={questions.length} />
          <div className={styles.quizFooter}>
            <span className={styles.footerHint}>Choose the best answer</span>
            <button className={styles.nextButton} onClick={() => setScreen('results')}>
              Finish quiz <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      )}

      {screen === 'results' && (
        <ResultScreen onPlayAgain={() => setScreen('start')} />
      )}

      <footer className={styles.footer}>Made for curious minds <span aria-hidden="true">✦</span></footer>
    </main>
  );
}

export default App;
