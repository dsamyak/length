import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useQuestions() {
  const { state, dispatch } = useContext(AppContext);

  const { sessionQuestions, currentQuestionIndex, score, hintsRemaining } = state;

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= sessionQuestions.length && sessionQuestions.length > 0;

  const answerQuestion = (isCorrect) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { isCorrect } });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const useHint = () => {
    dispatch({ type: 'USE_HINT' });
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: sessionQuestions.length,
    score,
    hintsRemaining,
    isFinished,
    answerQuestion,
    nextQuestion,
    useHint,
  };
}
