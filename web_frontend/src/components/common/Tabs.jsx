import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tabs - Accessible tabs with keyboard navigation and ARIA roles.
 * Props:
 * - items: [{ key, label, content }]
 * - initialKey: string (optional)
 * - onChange: function(key)
 * - idBase: string (for aria ids)
 */
export default function Tabs({ items = [], onChange, initialKey, idBase = 'tabs' }) {
  const initial = initialKey ?? items[0]?.key;
  const [active, setActive] = useState(initial);
  const [focusIndex, setFocusIndex] = useState(() => Math.max(0, items.findIndex((i) => i.key === initial)));
  const tabRefs = useRef([]);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    setFocusIndex(Math.max(0, items.findIndex((i) => i.key === active)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const selectByIndex = (idx) => {
    const it = items[idx];
    if (!it) return;
    setActive(it.key);
    onChange && onChange(it.key);
  };

  const onKeyDown = useCallback(
    (e) => {
      const last = items.length - 1;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = focusIndex === last ? 0 : focusIndex + 1;
        setFocusIndex(next);
        tabRefs.current[next]?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = focusIndex === 0 ? last : focusIndex - 1;
        setFocusIndex(prev);
        tabRefs.current[prev]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setFocusIndex(0);
        tabRefs.current[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        setFocusIndex(last);
        tabRefs.current[last]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectByIndex(focusIndex);
      }
    },
    [focusIndex, items]
  );

  const tabId = (idx) => `${idBase}-tab-${idx}`;
  const panelId = (idx) => `${idBase}-panel-${idx}`;

  const activeIndex = Math.max(0, items.findIndex((i) => i.key === active));

  return (
    <div>
      <div
        role="tablist"
        aria-label="Tabs"
        onKeyDown={onKeyDown}
        className="tab-list"
      >
        {items.map((i, idx) => {
          const selected = idx === activeIndex;
          return (
            <button
              key={i.key}
              id={tabId(idx)}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(idx)}
              tabIndex={focusIndex === idx ? 0 : -1}
              ref={(el) => (tabRefs.current[idx] = el)}
              className={`tab-button ${selected ? 'active' : ''}`}
              onClick={() => selectByIndex(idx)}
            >
              {i.label}
            </button>
          );
        })}
      </div>
      {items.map((i, idx) => {
        const hidden = idx !== activeIndex;
        return (
          <div
            key={i.key}
            id={panelId(idx)}
            role="tabpanel"
            aria-labelledby={tabId(idx)}
            hidden={hidden}
            style={{ paddingTop: 16 }}
            tabIndex={0}
          >
            {!hidden && i.content}
          </div>
        );
      })}
    </div>
  );
}
