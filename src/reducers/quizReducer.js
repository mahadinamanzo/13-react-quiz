export const initialQuizState = {
  status: 'idle',
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: 15,
  highscore: 0,
  requestOptions: null,
  errorMessage: null,
};

function finishQuiz(state) {
  return {
    ...state,
    status: 'finished',
    highscore: Math.max(state.highscore, state.points),
  };
}

function hasValidQuestions(questions) {
  return Array.isArray(questions)
    && questions.length > 0
    && questions.every((question) => (
      typeof question?.category === 'string'
      && typeof question.prompt === 'string'
      && Array.isArray(question.options)
      && question.options.length > 0
      && question.options.every((option) => typeof option === 'string')
      && question.options.includes(question.answer)
    ));
}

export function quizReducer(state, action) {
  switch (action.type) {
    case 'start':
      if (state.status === 'ready') {
        return { ...state, status: 'active' };
      }

      if (state.status === 'idle' || state.status === 'finished' || state.status === 'error') {
        return {
          ...state,
          status: 'loading',
          questions: [],
          index: 0,
          answer: null,
          points: 0,
          secondsRemaining: 15,
          requestOptions: action.options,
          errorMessage: null,
        };
      }

      return state;

    case 'dataReceived':
      if (state.status !== 'loading') return state;
      if (!hasValidQuestions(action.questions)) {
        return {
          ...state,
          status: 'error',
          errorMessage: 'The trivia service returned invalid questions. Please try again.',
        };
      }

      return {
        ...state,
        status: 'ready',
        questions: action.questions,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: 15,
        errorMessage: null,
      };

    case 'dataFailed':
      return state.status === 'loading'
        ? { ...state, status: 'error', errorMessage: action.message }
        : state;

    case 'newAnswer': {
      if (state.status !== 'active' || state.answer !== null) return state;
      const question = state.questions[state.index];
      if (!question?.options.includes(action.answer)) return state;

      return {
        ...state,
        answer: action.answer,
        points: state.points + Number(action.answer === question.answer),
      };
    }

    case 'nextQuestion':
      if (state.status !== 'active' || state.answer === null) return state;
      if (state.index === state.questions.length - 1) return finishQuiz(state);

      return {
        ...state,
        index: state.index + 1,
        answer: null,
        secondsRemaining: 15,
      };

    case 'finish':
      return state.status === 'active' ? finishQuiz(state) : state;

    case 'restart':
      return { ...initialQuizState, highscore: state.highscore };

    case 'tick':
      if (state.status !== 'active') return state;
      if (state.secondsRemaining <= 1) {
        return { ...finishQuiz(state), secondsRemaining: 0 };
      }

      return { ...state, secondsRemaining: state.secondsRemaining - 1 };

    default:
      return state;
  }
}
