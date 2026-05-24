import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { GameObject } from '../ui/GameObjects';

export default function SortQueue({ onComplete }) {
  const { play } = useAudio();

  const [items, setItems] = useState([
    { id: 'C', color: '#6C3FC5', lengthPx: 250 },
    { id: 'A', color: '#FF6B35', lengthPx: 100 },
    { id: 'B', color: '#0FB5AE', lengthPx: 180 },
  ]);

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);

  const handleCheck = () => {
    const isSorted = items[0].id === 'A' && items[1].id === 'B' && items[2].id === 'C';

    if (isSorted) {
      play('correct');
      setValidated(true);
      setTimeout(onComplete, 2000);
    } else {
      play('wrong');
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="station-header">
        <h2>📊 Sort: Shortest → Longest</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Drag to rearrange. Top = Shortest, Bottom = Longest.
      </p>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 500, marginBottom: 32, listStyle: 'none' }}
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className={`drag-item ${validated ? 'validated' : ''}`}
          >
            <GameObject type="stick" color={item.color} lengthPx={item.lengthPx} />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button
        className="btn btn-pink"
        onClick={handleCheck}
        disabled={validated}
        style={error ? { animation: 'shake 0.4s ease' } : {}}
      >
        {validated ? '✓ Correct!' : 'Check Order!'}
      </button>
    </div>
  );
}
