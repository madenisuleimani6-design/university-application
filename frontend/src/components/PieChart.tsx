export interface PieSlice {
  label: string;
  value: number;
}

const PALETTE = ['#003d82', '#ff6600', '#2d5016', '#0066cc', '#7a5195', '#ef5675', '#ffa600'];

function PieChart({ data, size = 180 }: { data: PieSlice[]; size?: number }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const radius = size / 2 - 4;
  const center = size / 2;

  const slicePath = (startAngle: number, endAngle: number) => {
    const start = { x: center + radius * Math.cos(startAngle), y: center + radius * Math.sin(startAngle) };
    const end = { x: center + radius * Math.cos(endAngle), y: center + radius * Math.sin(endAngle) };
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  let angle = -Math.PI / 2;
  const slices = data.filter((slice) => slice.value > 0).map((slice, index) => {
    const span = total > 0 ? (slice.value / total) * Math.PI * 2 : 0;
    const path = span >= Math.PI * 2 - 0.0001
      ? undefined
      : slicePath(angle, angle + span);
    const color = PALETTE[index % PALETTE.length];
    angle += span;
    return { ...slice, color, path, full: path === undefined };
  });

  return (
    <div className="pie-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Vote share pie chart">
        {total === 0 && <circle cx={center} cy={center} r={radius} fill="#e0e0e0" />}
        {slices.map((slice) => slice.full
          ? <circle key={slice.label} cx={center} cy={center} r={radius} fill={slice.color} />
          : <path key={slice.label} d={slice.path} fill={slice.color} stroke="#ffffff" strokeWidth="1.5" />)}
        {total > 0 && <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" className="pie-chart-total">{total}</text>}
      </svg>
      <ul className="pie-chart-legend">
        {data.map((slice, index) => (
          <li key={slice.label}>
            <span className="pie-chart-swatch" style={{ background: PALETTE[index % PALETTE.length] }} />
            <span className="pie-chart-label">{slice.label}</span>
            <strong>{total > 0 ? `${((slice.value / total) * 100).toFixed(1)}%` : '0.0%'}</strong>
            <em>{slice.value} votes</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PieChart;
