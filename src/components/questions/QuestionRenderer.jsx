import React, { useState, useEffect, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { useQuestions } from '../../hooks/useQuestions';
import { useAudio } from '../../hooks/useAudio';
import { GameObject } from '../ui/GameObjects';
import CharacterSpeech from '../ui/CharacterSpeech';
import { narrate } from '../../utils/audio';
import { playReadQuestion } from '../../utils/narration';

export default function QuestionRenderer({ question, onAnswer, externalMode = false }) {
  const internalHook = useQuestions();
  const { play } = useAudio();
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [sortItems, setSortItems] = useState(question.objects || []);
  const narrationRef = useRef(null);

  useEffect(() => {
    narrationRef.current?.cancel();
    // In external mode (PlayPhase), the parent handles intro audio, so we wait a bit before reading the question
    const timer = setTimeout(() => {
      narrationRef.current = narrate(playReadQuestion(question.question));
    }, externalMode ? 2000 : 500);

    setShowHint(false);
    setFeedback(null);
    setSortItems(question.objects || []);

    return () => {
      clearTimeout(timer);
      narrationRef.current?.cancel();
    };
  }, [question, externalMode]);

  const handleAnswer = (answerId) => {
    if (feedback) return;
    let isCorrect = false;

    if (question.type === 'sort_order') {
      const currentOrder = sortItems.map(item => item.id);
      isCorrect = currentOrder.join(',') === question.correctAnswer.join(',');
    } else {
      isCorrect = answerId === question.correctAnswer;
    }

    if (externalMode && onAnswer) {
      // Let the parent (PlayPhase) handle scoring, lives, XP
      onAnswer(isCorrect);
    } else {
      // Internal mode (used by old flow)
      if (isCorrect) {
        play('correct');
        setFeedback('correct');
        internalHook.answerQuestion(true);
        setTimeout(() => {
          setFeedback(null);
          internalHook.nextQuestion();
        }, 2000);
      } else {
        play('wrong');
        setFeedback('wrong');
        internalHook.answerQuestion(false);
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  const handleHint = () => {
    const remaining = externalMode ? 1 : internalHook.hintsRemaining;
    if (remaining > 0 && !showHint) {
      if (!externalMode) internalHook.useHint();
      setShowHint(true);
    }
  };

  const renderVisualPick = () => (
    <div className="visual-objects">
      {question.options.map((opt) => {
        const obj = question.objects.find(o => o.id === opt.id);
        return (
          <div key={opt.id} className="visual-object-card" onClick={() => handleAnswer(opt.id)}>
            <GameObject type="pencil" color={obj.color} lengthPx={obj.lengthPx} />
            <span className="visual-object-label">{opt.text}</span>
          </div>
        );
      })}
    </div>
  );

  const renderTrueFalse = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {question.objects.map(obj => (
          <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 120, textAlign: 'right', color: 'var(--text-secondary)' }}>{obj.label}</span>
            <GameObject type="snake" color={obj.color} lengthPx={obj.lengthPx} />
          </div>
        ))}
      </div>
      <div className="options-grid">
        {question.options.map((opt) => (
          <button key={opt.id} className={`btn ${opt.id === 'T' ? 'btn-teal' : 'btn-coral'}`} style={{ fontSize: '1.3rem', minWidth: 120 }} onClick={() => handleAnswer(opt.id)}>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );

  const renderWordFill = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {question.objects.map(obj => (
          <div key={obj.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <GameObject type="stick" color={obj.color} lengthPx={obj.lengthPx} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{obj.label}</span>
          </div>
        ))}
      </div>
      <div className="options-grid">
        {question.options.map(opt => (
          <button key={opt.id} className="option-btn" onClick={() => handleAnswer(opt.id)}>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSortOrder = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Reorder.Group axis="y" values={sortItems} onReorder={setSortItems}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400, marginBottom: 24, listStyle: 'none' }}>
        {sortItems.map((item) => (
          <Reorder.Item key={item.id} value={item} className="drag-item">
            <GameObject type="stick" color={item.color} lengthPx={item.lengthPx} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button className="btn btn-pink" onClick={() => handleAnswer('sort')}>Submit Order</button>
    </div>
  );

  const renderMatchIt = () => (
    <div className="visual-objects">
      {question.options.map((opt) => {
        const obj = question.objects.find(o => o.id === opt.id);
        return (
          <div key={opt.id} className="visual-object-card" onClick={() => handleAnswer(opt.id)}>
            <GameObject type="pencil" color={obj.color} lengthPx={obj.lengthPx} />
            <span className="visual-object-label">{opt.text}</span>
          </div>
        );
      })}
    </div>
  );

  const renderStoryProblem = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CharacterSpeech character="milo" text="Listen carefully to the story!" position="left" />
      <div className="options-grid" style={{ marginTop: 16 }}>
        {question.options.map(opt => (
          <button key={opt.id} className="btn btn-teal" onClick={() => handleAnswer(opt.id)}>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (question.type) {
      case 'visual_pick': return renderVisualPick();
      case 'true_false': return renderTrueFalse();
      case 'word_fill': return renderWordFill();
      case 'sort_order': return renderSortOrder();
      case 'match_it': return renderMatchIt();
      case 'story_problem': return renderStoryProblem();
      default: return null;
    }
  };

  return (
    <div className="question-card">
      <h2 className="question-text">{question.question}</h2>
      {renderContent()}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24 }}>
        <button className="hint-btn" onClick={handleHint} disabled={showHint}>
          💡 Need a hint?
        </button>
        {showHint && <div className="hint-box">{question.hint}</div>}
      </div>
    </div>
  );
}
