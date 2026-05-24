// Fisher-Yates shuffle algorithm
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function selectQuestions(pool, count = 20) {
  return shuffle(pool).slice(0, count);
}

export function shuffleOptions(question) {
  if (!question.options) return question;
  return { ...question, options: shuffle(question.options) };
}
