# Quizzy

A playful React 19 quiz app powered by the [Open Trivia Database](https://opentdb.com/).

## Features

- Choose a category, difficulty, and question count.
- Answer multiple-choice questions with immediate correct/incorrect feedback.
- Use `1`–`4` to select an answer and `Enter` to continue.
- Race a 15-second timer on each question.
- Save your high score and last-used quiz settings in local storage.
- Responsive layout, keyboard focus styles, and live announcements for answer feedback.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, then serve it locally with `npm run preview`.
Vite writes the deployable static site to `dist/`.

## Screenshots

_Screenshot placeholders — add captures of the start screen, an active question, and the results screen._

## What I learned about hooks

- `useState` keeps small, independent values such as the saved form settings.
- `useReducer` keeps related quiz transitions—loading, answering, scoring, and finishing—in one predictable place.
- The `useLocalStorageState` custom hook reuses the same persistence behavior for the high score and last-used settings.
- `useEffect` synchronizes with external systems: it fetches categories and questions, manages the timer, and saves local state. Dependency arrays control when those effects repeat; cleanup aborts requests, clears intervals, and removes event listeners.
- React Strict Mode intentionally repeats effect setup and cleanup in development to help reveal effects that are not safe to repeat.

## Deploy with Vercel

Push this repository to GitHub, then on [vercel.com](https://vercel.com/) choose **Add New → Project**, import the repository, and select **Deploy**. Vercel detects Vite automatically.
