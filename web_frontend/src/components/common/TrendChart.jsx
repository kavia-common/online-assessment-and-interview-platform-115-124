import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * TrendChart
 * Renders a minimalist sparkline-like trend chart using SVG.
 * Props:
 *  - data: number[]
 *  - height, color, strokeWidth, fill
 */
const TrendChart = ({ data, height = 60, color = '#2563EB', strokeWidth = 2, fill = 'rgba(37,99,235,0.1)' }) => {
  const width = 240;

  const { path, area } = useMemo(() => {
    if (!data || data.length === 0) return { path: '', area: '' };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const norm = (v) => {
      if (max === min) return height / 2;
      return height - ((v - min) / (max - min)) * (height - 8) - 4; // padding
    };
    const step = (width - 8) / Math.max(1, data.length - 1);
    const points = data.map((v, i) => [4 + i * step, norm(v)]);

    const d = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
    const a = `${d} L ${points[points.length - 1][0]} ${height - 4} L 4 ${height - 4} Z`;
    return { path: d, area: a };
  }, [data, height]);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trend chart">
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

TrendChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  height: PropTypes.number,
  color: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
};

export default TrendChart;
