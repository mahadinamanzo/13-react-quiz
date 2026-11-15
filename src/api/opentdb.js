function decodeHtml(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`The trivia service returned HTTP ${response.status}.`);
  }

  return response.json();
}

export async function fetchCategories(signal) {
  const payload = await getJson('https://opentdb.com/api_category.php', signal);
  if (!Array.isArray(payload.trivia_categories)) {
    throw new Error('The trivia service returned an invalid category list.');
  }

  return payload.trivia_categories.map((category) => ({
    id: String(category.id),
    name: decodeHtml(category.name),
  }));
}

function responseCodeMessage(code) {
  const messages = {
    1: 'No questions matched those settings. Try a different category or difficulty.',
    2: 'The trivia service rejected those quiz settings. Please try different options.',
    3: 'The trivia service could not find the requested session.',
    4: 'The trivia session has no questions left. Please start a new quiz.',
    5: 'The trivia service is receiving too many requests. Please wait a moment and try again.',
  };

  return messages[code] ?? `The trivia service returned an unknown response code (${code}).`;
}

function normalizeQuestions(results) {
  return results.map((item) => {
    if (
      typeof item.category !== 'string'
      || typeof item.question !== 'string'
      || typeof item.correct_answer !== 'string'
      || !Array.isArray(item.incorrect_answers)
      || !item.incorrect_answers.every((answer) => typeof answer === 'string')
    ) {
      throw new Error('The trivia service returned an invalid question.');
    }

    const answer = decodeHtml(item.correct_answer);
    const options = shuffle([
      answer,
      ...item.incorrect_answers.map(decodeHtml),
    ]);

    return {
      category: decodeHtml(item.category),
      prompt: decodeHtml(item.question),
      answer,
      options,
    };
  });
}

export async function fetchQuestions({ amount, categoryId, difficulty }, signal) {
  const params = new URLSearchParams({
    amount: String(amount),
    category: String(categoryId),
    difficulty,
    type: 'multiple',
  });
  const payload = await getJson(`https://opentdb.com/api.php?${params}`, signal);

  if (typeof payload.response_code !== 'number') {
    throw new Error('The trivia service returned an invalid response.');
  }
  if (payload.response_code !== 0) {
    throw new Error(responseCodeMessage(payload.response_code));
  }
  if (!Array.isArray(payload.results) || payload.results.length === 0) {
    throw new Error(responseCodeMessage(1));
  }

  return normalizeQuestions(payload.results);
}
