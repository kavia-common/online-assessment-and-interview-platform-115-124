import React, { useEffect, useMemo, useState } from 'react';
import { shuffle, seededShuffle } from '../../utils/randomize';

/**
 * PUBLIC_INTERFACE
 * OptionsShuffle randomizes options and returns selected via onChange.
 */
export default function OptionsShuffle({ options = [], value, onChange, seed, name = 'option' }) {
  const [mapIdx, setMapIdx] = useState([]);

  useEffect(() => {
    const indices = options.map((_, i) => i);
    const order = (typeof seed === 'number' ? seededShuffle(indices, seed) : shuffle(indices));
    setMapIdx(order);
  }, [options, seed]);

  const ordered = useMemo(() => mapIdx.map((i) => ({ key: i, label: options[i] })), [mapIdx, options]);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {ordered.map((opt, idx) => {
        const id = `${name}-${opt.key}`;
        return (
          <label key={id} htmlFor={id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            border: '1px solid var(--border-color)',
            borderRadius: 10,
            background: 'var(--bg-surface)',
            cursor: 'pointer',
          }}>
            <input
              id={id}
              type="radio"
              name={name}
              checked={value === opt.key}
              onChange={() => onChange?.(opt.key)}
            />
            <span>{String.fromCharCode(65 + idx)}.</span>
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}
